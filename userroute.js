const express=require('express')
const router=express.Router()
const bodyparser=require('body-parser')
router.use(bodyparser.json())
var nodemailer = require('nodemailer');
const upload = require('../helpers/mul')
const kycu=require('../helpers/cloudroute')
const userregis=require('../helpers/userregister')
// const ethacc=require('../helpers/userethacccreate')
const history=require('../helpers/histories')
const {user,uservalidation,userchangepass,userforgotpass}=require('../middleware/uservla')
// const {adminresetpass,Adminvalidationreset}=require('../middleware/adminreset')

// user register

router.post('/userregis',user,uservalidation,userregis.userreg)


// userlogin
router.get('/userlogin',userregis.userlogin)

// router.get('/userverifytoken',userregis.userverifyToken,userregis.userverify)


//user token verify

router.get('/userverify',userregis.userverifyToken,userregis.userverify)


//user changepassword

router.post('/changepass',userregis.userverifyToken,userregis.userverify,userchangepass,uservalidation,userregis.userchange)


// user mail

router.post('/usersendmail',userregis.usersendmail)

// otpverify

router.post('/userotpverify',userforgotpass,uservalidation,userregis.userotpverify)



// logout checking
router.post('/userlogout',userregis.userout)

// user profile settings
router.post('/profile',userregis.userverifyToken,userregis.userverify,upload.single('image'),kycu.profile)

// cloudnary kycupload
router.post('/images',userregis.userverifyToken,userregis.userverify,upload.array('uploadfile'),kycu.kycupload)

// deposit
router.post('/depositverify',userregis.userverifyToken,userregis.userverify,userregis.userdepositverify)

// paypal
router.get('/startpay',(req,res)=>res.render('main'))

// payinitial
router.post('/payinitial',userregis.userpayfunction)

// pay success
router.get('/success',userregis.userpaysuccess)

// pay cancel
router.get('/cancel',(req,res)=>res.send('Cancelled'))


// useraccount
router.get('/useraccount',userregis.useraccount)


// ethbalance
router.get('/ethgetbal',userregis.getbal)

// router.post('/userfiat',userregis.fiattocoin)

// ethtransaction
router.post('/ethtransaction',userregis.ethtransaction)

// cryptonewaccount
router.post('/cryptoacc',userregis.cryptoaccnew)
// router.post('/gen_bitcoin',userregis.bit_coin)

// btctransupdate
router.post('/btctransupdate',userregis.btctranslist)


// btctransaction
router.post('/btctrans',userregis.btctransaction)

// trxtransaction
router.post('/trxtransaction',userregis.trxtransaction)

// coinexchange
router.post('/exchange',userregis.coinex)

// money withdraw
router.post('/withdraw',userregis.withdraw)

// transaction history
router.post('/transactionhistory',history.transaction)

// fiat exchange
router.post('/fiatexchange',userregis.fiattoeth)



module.exports=router