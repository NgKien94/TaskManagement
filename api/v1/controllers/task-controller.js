const Task = require('../models/task-model');

// [GET] /tasks
module.exports.index =  async (req,res) =>{
    const tasks = await Task.find({ deleted: false });
    res.json(tasks)
}


// [GET] /tasks/detail/:id
module.exports.detail = async (req,res) =>{
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
}