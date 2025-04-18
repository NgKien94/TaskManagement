const User = require('../models/user-model')
const md5 = require('md5')
const generateHelper = require('../../../helpers/generate')
const ForgotPassword = require('../models/forgot-password-model')
const sendMailHelper = require('../../../helpers/sendMail')

module.exports.register = async (req, res) => {

    req.body.password = md5(req.body.password)
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if(existEmail){
        res.json({
            code: 400,
            message: "Email exist"
        })
    }
    else{
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })
        await user.save();

        const token = user.token;
        res.cookie("token",token)
        res.json({
            code: 200,
            message: "Account created successfully",
            token: token
        })
    }

}


module.exports.login = async (req,res) =>{
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        res.json({
            code: 400,
            message: "Email is not exist"
        })
        return;
    }

    if(md5(password) != user.password){
        res.json({
            code: 400,
            message: "Password is incorrect"
        })
        return;
    }

    const token = user.token
    res.cookie("token",token);

    res.json({
        code: 200,
        message: "Login sucess",
        token: token
    })
}

module.exports.forgotPassword = async (req,res) =>{
    try {
        const email = req.body.email;
    
        const user = await User.findOne({
          email: email,
          deleted: false
        });
      
        if(!user){
          res.json({
            code: 400,
            message: "Email không tồn tại"
          });
          return;
        }
        
        const otp = generateHelper.generateRamdomNumer(6);
    
        const timeExpire = 2;
    
        const objectForgotPassword = {
          email: email,
          otp: otp,
          expireAt: Date.now() + timeExpire*60
        };
      
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();
        
        const subject = `Mã OTP xác minh lấy lại mật khẩu`;
        const html = `
          Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. 
          Thời hạn sử dụng là ${timeExpire} phút. 
          Lưu ý không được chia sẻ mã OTP với bất kỳ ai.
        `;
    
        sendMailHelper.sendMail(email, subject, html);
    
        res.json({
          code: 200,
          message: "Đã gửi mã OTP qua email"
        });
      } catch (error) {
        res.json({
          code: 400,
          message: "Error"
        });
      }

}