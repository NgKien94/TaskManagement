const express = require('express');
require('dotenv').config();
const database = require('./config/database');
const app = express();
const port = process.env.PORT;

database.connect();
const Task = require('./models/task.model');

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({ deleted: false });
    res.json(tasks)
})

app.get('/tasks/detail/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const record = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json(record)
    } catch (err) {
       res.json({message: "Not found"})
    }
})

app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})