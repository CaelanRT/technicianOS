const express = require('express');
const app = express();

const router = require('./routes/tasksRoutes');

const port = 3000 || process.env.PORT;


app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>');
})

app.use('/api/v1/tasks', router);

app.listen(port, () =>{
    console.log('server is listening on port 3000...');
})

