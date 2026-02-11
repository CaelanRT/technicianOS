const express = require('express');

const app = express();

const port = 3000 || process.env.PORT;


app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>');
})

app.listen(port, () =>{
    console.log('server is listening on port 3000...');
})

