const Task = require('../models/task-model');

// [GET] /tasks
module.exports.index =  async (req,res) =>{
    const find = {
        deleted: false
    }
    
    if(req.query.status){
        find.status = req.query.status;
    }

    // Sort
    const sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // End sort 

    const tasks = await Task.find(find).sort(sort);
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