const express = require('express');
require('dotenv').config();
const cors = require('cors')
const cookieParser = require('cookie-parser')

// Configs

const app = express();
const port = process.env.PORT;
const database = require('./config/database');
database.connect();
// cors - Cấp quyền cho FrontEnd truy cập API từ BackEnd
app.use(cors())


// Thêm dòng này để parse JSON body
app.use(express.json());
// Nếu dùng form-urlencoded (không cần trong JSON API thường dùng)
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())



// Routes version 1
const routesApiVer1 = require('./api/v1/routes/index-route')
routesApiVer1(app);


app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})