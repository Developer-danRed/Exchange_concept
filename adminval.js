const { not } = require('cheerio/lib/api/traversing');
var {check, validationResult}=require('express-validator');
exports.admin=[
check('email')
.not()
.isEmpty().withMessage('please fill the email')
.isEmail().withMessage('please give a valid email'),

check('password')
.not()
.isEmpty().withMessage('please fill the password')
.isLength({min:6,max:10}).withMessage('min 6 and max 10')
.matches(/^(?=.*[0-9][0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[A-Z0-9 !@#$%^&*])^/).withMessage('one caps,one small,one symbol and two numbers'),

check('pattern')
.not()
.isEmpty().withMessage('please fill the pattern')
.isNumeric().withMessage('pattern only number')
.isLength({min:5}).withMessage('give 5 digits pattern')
];

exports.adminlogin=[
check('email')
.not()
.isEmpty().withMessage('please fill the login email'),

check('password')
.not()
.isEmpty().withMessage('please fill the login password'),

check('pattern')
.not()
.isEmpty().withMessage('please fill the login pattern'),
    
];

exports.paircurrencyval=[

check('fromcurrency')
.not()
.isEmpty().withMessage('please fill the empty fromcurrency field'),


check('tocurrency')
.not()
.isEmpty().withMessage('please fill the empty tocurrency field'),

check('exchange')
.not()
.isEmpty().withMessage('please fill the empty exchange field'),

check('exchangefee')
.not()
.isEmpty().withMessage('please fill the empty exchange fees')
];

exports.currentcurrval=[
check('currency_name')
.not()
.isEmpty().withMessage(' please fill currency name ')
];


exports.managecurrval=[
check('currency_name')
.not()
.isEmpty().withMessage(' please fill currency name '),

check('symbol')
.not()
.isEmpty().withMessage('please fill the symbol'),

check('currency_type')
.not()
.isEmpty().withMessage('please fill the type of currency'),

check('market_price')
.not()
.isEmpty().withMessage('please fill the market price'),

check('min_withdraw_fee')
.not()
.isEmpty().withMessage('please fill the login pattern')
.isNumeric().withMessage('please give a numeric value '),

check('max_withdraw_fee')
.not()
.isEmpty().withMessage('please fill the max_withdraw_fee')
.isNumeric().withMessage('please give a numeric value '),

];

exports.adminchangepass=[
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


exports.adminforgotpass=[
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
    ];


    exports.pairmanage=[

check('from_currency')    
.not()
.isEmpty().withMessage('please fill the from_currency'),

check('to_currency')    
.not()
.isEmpty().withMessage('please fill the to_currency'),

check('exchange')    
.not()
.isEmpty().withMessage('please fill the exchange'),

check('exchange_fee')    
.not()
.isEmpty().withMessage('please fill the exchange_fee')
];
exports.Adminvalidation=(req,res,next)=>{
const result=validationResult(req).array();
if(!result.length)
return next();

const error =result[0].msg;
res.json({success:false,message:error})

}