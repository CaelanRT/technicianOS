const path =  require('path');
const sendTranscriptToLLM = require('../services/transcriptServices');


const processTranscript = (req, res) => {

    // validate the request

    // call the api to get the transcript file

    // download the file

    // get the path of the file on the server
    const dataPath = path.join(__dirname, '../dummy-data/example.vtt');

    // call the upload transcript, giving it the path of the file to upload and the tasks on the project this is affiliated with
    const llmOutput = sendTranscriptToLLM(dataPath);

    // get the return from the LLM of the tasks it thinks it completed based on the transcript

    // update the tasks

    // send the response

    res.send('process transcript');
}

module.exports = processTranscript;