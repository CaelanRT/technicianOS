require('dotenv').config();
const express = require('express');
const app = express();

// package imports
const cookieParser = require('cookie-parser')

// middleware imports
const errorHandler = require('./middleware/errorHandler');

// middleware
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

const projectsRouter = require('./routes/projectsRoutes');
const tasksRouter = require('./routes/tasksRoutes');
const usersRouter = require('./routes/usersRoutes');
const organizationsRouter = require('./routes/organizationsRoutes');
const authRouter = require('./routes/authRoutes');

const port = process.env.PORT || 3000;

//routes
app.get('/', (req, res) => {
    res.send('<h1>TechnicianOS</h1>');
})

app.use('/api/v1', projectsRouter);
app.use('/api/v1', tasksRouter);
app.use('/api/v1', usersRouter);
app.use('/api/v1', organizationsRouter);
app.use('/api/v1', authRouter);

// errors
app.use(errorHandler);

app.listen(port, () => {
    console.log(`server is listening on port ${port}...`);
})
