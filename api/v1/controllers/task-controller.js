const Task = require('../models/task-model');
const paginationHelper = require('../../../helpers/pagination')
// [GET] /tasks
module.exports.index =  async (req,res) =>{
    const find = {
        deleted: false
    }
    
    if(req.query.status){
        find.status = req.query.status;
    }

    // Pagination
    let initPagination = {
        currentPage :1 ,
        limitItems: 2
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(initPagination,req.query,countTasks);
    // End pagination

    // Sort
    const sort = {}
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // End sort 

    

    const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    ;
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