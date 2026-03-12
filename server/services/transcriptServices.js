const {OpenAI} = require('openai');
const fs = require('fs');

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// could probably create a service that reads the file and sends it back

// service that gets the contents of the file and sends to llm, returns the response
const sendTranscriptToLLM = async (dataPath) => {


    // Test hitting the api
    /*const response = await client.responses.create({
        model: "gpt-5.4",
        input: "Write a one-sentence bedtime story about a unicorn."
    });
    
    console.log(response.output_text);*/

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
                        text: "This file is a transcription of a zoom call recording between an implementation specialist and a customer. Please read this transcription and compile a list of all tasks completed on this service based on what is said in the transcription.",
                    },
                ],
            }
        ]
    })

    // get response
    console.log(response.output_text);

    return response.output_text;
    
}

// service that does stuff with the tasks!

module.exports = sendTranscriptToLLM;