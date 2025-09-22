let express=require('express');
const { otpsend } = require('../../Controllers/Webiste Controllers/Authentication Controller/otpSend');
const { otpverify } = require('../../Controllers/Webiste Controllers/Authentication Controller/otpVerify');
const { googleRegister } = require('../../Controllers/Webiste Controllers/Authentication Controller/googleRegiter');
const { resetotp } = require('../../Controllers/Webiste Controllers/Authentication Controller/resetPassOtp');
const { resetpassword } = require('../../Controllers/Webiste Controllers/Authentication Controller/resetPassword');
const { loginController } = require('../../Controllers/Webiste Controllers/Authentication Controller/login');



let authentication=express.Router();

authentication.post('/otp-send',otpsend)  //localhost:8000/website/auth/otp-send

authentication.post('/otp-verify',otpverify)  //localhost:8000/website/auth/otp-verify

authentication.post('/google-register',googleRegister)  //localhost:8000/website/auth/google-register

authentication.post('/reset-otp-send',resetotp)  //localhost:8000/website/auth/reset-otp-send

authentication.post('/reset-password',resetpassword)  //localhost:8000/website/auth/reset-password

authentication.post('/:loginMethod/login', loginController) //localhost:8000/website/auth/:loginMethod/login

module.exports={authentication};