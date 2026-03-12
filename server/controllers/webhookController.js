const path =  require('path');
const {sendTranscriptToLLM, queryDBForTasks} = require('../services/transcriptServices');
const { prisma } = require('../db/db');
const { BadRequestError } = require('../errors/customError');
const { StatusCodes } = require('http-status-codes');


const processTranscript = async (req, res) => {

    // validate the request

    // call the api to get the transcript file

    // download the file

    // get the path of the file on the server
    const dataPath = path.join(__dirname, '../dummy-data/example.vtt');

    //figure out what customer/project we're talking about

    // query the db for all the tasks related to that project
    const tasks = await queryDBForTasks(1);
    
    // call the upload transcript, giving it the path of the file to upload and the tasks on the project this is affiliated with
    const llmOutput = await sendTranscriptToLLM(dataPath, tasks);

    // get the return from the LLM of the tasks it thinks it completed based on the transcript
    const result = JSON.parse(llmOutput);

    const tasksArray = result.tasks;

    const tasksFiltered = tasksArray.filter((t) => t.completed === true && t.certainty > 80);

    // update the tasks
    for (i = 0; i < tasksFiltered.length; ++i) {
        let updatedTask = await prisma.task.update({
            where: {
                id: tasksFiltered[i].id
            },
            data: {
                status: "completed"
            }
        })

        // maybe placeholder error for now
        if (!updatedTask) {
            throw new BadRequestError('Unable to complete request');
        }
    }
    // send the response

    res.status(StatusCodes.OK).json({msg:`Successfully updated ${tasksFiltered.length} tasks`});
}

module.exports = processTranscript;