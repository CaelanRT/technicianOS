const express = require('express');
const app = express();

// middleware
app.use(express.json());

const router = require('./routes/projectsRoutes');

const port = 3000 || process.env.PORT;


app.get('/', (req, res) => {
    res.send('<h1>hello world</h1>');
})

app.use('/api/v1/projects', router);

app.listen(port, () => {
    console.log('server is listening on port 3000...');
})

