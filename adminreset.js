
var {check, validationResult}=require('express-validator');
exports.adminresetpass=[
check('password')
   .not()
   .isEmpty().withMessage('please fill the password')
   .isLength({min:6,max:10}).withMessage('min 6 and max 10')
   .matches(/^(?=.*[0-9][0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[A-Z0-9 !@#$%^&*])^/).withMessage('one caps,one small,one symbol and two numbers'),
];

exports.Adminvalidationreset=(req,res,next)=>{
    const result=validationResult(req).array();
    if(!result.length)
     return next();

    const error =result[0].msg;
    res.json({success:false,message:error})

}