const Task = require('../models/task-model');
const paginationHelper = require('../../../helpers/pagination')
const searchHelper = require('../../../helpers/search')
// [GET] /tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status;
    }
    // Search
    let objectSearch = searchHelper(req.query)

    if (req.query.keyword) {
        find.title = objectSearch.regex
    }
    // End Search

    // Pagination
    let initPagination = {
        currentPage: 1,
        limitItems: 2
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countTasks);
    // End pagination

    // Sort
    const sort = {}
    if (req.query.sortKey && req.query.sortValue) {
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
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json(record)
    } catch (err) {
        res.json({ message: "Not found" })
    }
}

// [PATCH] /tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne(
            { _id: id },
            {
                $set: { status: status }
            }
        )

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        })
    } catch (error) {
        res.json({
            code: 404,
            message: "Lỗi tài nguyên không tồn tại"
        })
    }

}

// [PATCH] /tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        switch (key) {
            case "status":
                await Task.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        status: value
                    }
                )
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })

                break;
            case "delete":
                await Task.updateMany(
                    {
                        _id: { $in: ids }
                    },
                    {
                        $set: {
                            deleted: true,
                            deletedAt: new Date()
                        }
                    }
                )
                res.json({
                    code: 200,
                    message: "Xóa thành công nhiều nhiệm vụ"
                })
                break;
            default:
                res.json({
                    code: 404,
                    message: "Không tồn tại"
                })
                break;
        }


    } catch (error) {
        res.json({
            code: 404,
            message: "Không tồn tại"
        })
    }

}


//[POST] /tasks/create
module.exports.create = async (req, res) => {
    try {
        const task = new Task(req.body)
        const data = await task.save()
        res.json({
            code: 200,
            message: "Tạo thành công",
            data: data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }
}

//[PATCH] /task/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id

        await Task.updateOne({ _id: id }, req.body)
        res.json({
            code: 200,
            message: "Cập nhật thành công nhiệm vụ"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }

}

//[DELETE] /task/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id

        await Task.updateOne(
            { _id: id },
            {
                deleted: true,
                deletedAt: new Date()
            }
        );
        res.json({
            code: 200,
            message: "Xóa thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi"
        })
    }
}