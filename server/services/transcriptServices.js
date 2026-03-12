const {OpenAI} = require('openai');
const fs = require('fs');
const { prisma } = require('../db/db');
const {BadRequestError} = require('../errors/customError');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// service that queries the DB for the project tasks
const queryDBForTasks = async (projectId) => {
    const tasks = await prisma.task.findMany({
        where: {
            projectId: projectId
        }
    })

    // this is a placeholder, need to figure out throwing an error and retry stuff for here
    if (!tasks) {
        throw new BadRequestError('no tasks with that ID');
    }

    const tasksArray = [];

    for (i = 0; i < tasks.length; ++i) {
        let templateTask = {
            id: tasks[i].id,
            name: tasks[i].name,
            description: tasks[i].description
        };

        tasksArray.push(templateTask);
    }

    console.log(tasksArray);

    return tasksArray;
    
}

// service that gets the contents of the file and sends to llm, returns the response
const sendTranscriptToLLM = async (dataPath, tasksArray) => {


    //upload file
    const file = await client.files.create({
        file: fs.createReadStream(dataPath),
        purpose: 'user_data'
    })

    // send request to llm
    const response = await client.responses.create({
        model: 'gpt-5',
        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_file",
                        file_id: file.id,
                    },
                    {
                        type: "input_text",
                        text: `
                        Objective:
                        You are tasked with reading a transcript and comparing it to a list of tasks formatted in JSON format.

                        Input:
                        - uploaded input file
                        - JSON Array ${JSON.stringify(tasksArray, null, 2)}
                        
                        Directives:
                        The goal is to read the file that is the transcript and decipher from that transcript what tasks were completed, based on the tasks that are being given to you in the JSON Array from the input section. The input file is a transcription of a zoom call recording between an implementation specialist and a customer. Read the JSON input of the tasks, then read the transcript and keep a list of what tasks you can decipher were completed based on reading the call transcript. 
                        
                        Output:
                        Output your findings in the following JSON format -
                        tasks: [
                            {
                                id: id of task taken from input (int),
                                completed: 'true' or 'false' (boolean),
                                certainty: number between 1 - 100 with 100 being absolutely positive the task was complete (int)
                            }
                        ]
                        `,
                    },
                ],
            }
        ]
    })

    // get response
    //console.log(response.output_text);

    return response.output_text;
    
}

// service that does stuff with the tasks!

module.exports = {sendTranscriptToLLM, queryDBForTasks};