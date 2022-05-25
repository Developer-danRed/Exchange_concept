var {check, validationResult}=require('express-validator');
exports.user=[
check('email')
.not()
.isEmpty().withMessage('please fill the email')
.isEmail().withMessage('please give a valid email'),

check('password')
   .not()
   .isEmpty().withMessage('please fill the password')
   .isLength({min:6,max:10}).withMessage('min 6 and max 10')
   .matches(/^(?=.*[0-9][0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[A-Z0-9 !@#$%^&*])^/).withMessage('one caps,one small,one symbol and two numbers'),

check('confirmpassword')
.not()
.isEmpty().withMessage('please fill the confirmpassword'),


check('username')
.not()
.isEmpty().withMessage('please fill the username')
.isAlpha().withMessage('alphabatical value only')
.isLength({min:4},{max:12}).withMessage('atleast give a 4 characters')
];

exports.userchangepass=[
    // check('email')
    // .not()
    // .isEmpty().withMessage('please fill the email')
    // .isEmail().withMessage('please enter valid email'),
    
    check('oldpassword')
    .not()
    .isEmpty().withMessage('please fill the oldpassword'),

    check('newpassword')
    .not()
    .isEmpty().withMessage('please fill the oldpassword')
    .isLength({min:6,max:10}).withMessage('min 6 and max 10')
    .matches(/^(?=.*[0-9][0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[A-Z0-9 !@#$%^&*])^/).withMessage('one caps,one small,one symbol and two numbers'),
    
    
];

exports.userforgotpass=[
    check('email')
    .not()
    .isEmpty().withMessage('please fill the email')
    .isEmail().withMessage('please enter valid email'),
    
    check('otpcode')
    .not()
    .isEmpty().withMessage('please fill the password'),
    
        check('password')
           .not()
           .isEmpty().withMessage('please fill the password')
           .isLength({min:6,max:10}).withMessage('min 6 and max 10')
           .matches(/^(?=.*[0-9][0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[A-Z0-9 !@#$%^&*])^/).withMessage('one caps,one small,one symbol and two numbers'),
     
           check('confirmpassword')
           .not()
           .isEmpty().withMessage('please fill the confirm-password')
];



exports.uservalidation=(req,res,next)=>{
    const result=validationResult(req).array();
    if(!result.length)
     return next();

    const error =result[0].msg;
    res.json({success:false,message:error})

}