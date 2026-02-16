require('dotenv').config();
const express = require('express');
const app = express();

// middleware imports
const errorHandler = require('./middleware/errorHandler');

// middleware
app.use(express.json());

const router = require('./routes/projectsRoutes');



const port = 3000 || process.env.PORT;

//routes
app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>');
})

app.use('/api/v1', router);

// errors
app.use(errorHandler);

app.listen(port, () => {
    console.log('server is listening on port 3000...');
})

