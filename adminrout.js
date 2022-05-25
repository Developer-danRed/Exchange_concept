const express=require('express')
const router=express.Router()
const bodyparser=require('body-parser')
router.use(bodyparser.json())
const cloud=require('../helpers/cloudroute')
const currency=require('../helpers/currman')
var nodemailer = require('nodemailer');
const cloudsch=require('../modal/user')
const cloudinary = require('../helpers/cloudnary')
const upload = require('../helpers/mul')
const kyc=require('../helpers/kycocr')
const history=require('../helpers/histories')
const adminregis=require('../helpers/adregister')
const {admin,Adminvalidation,managecurrval,adminchangepass, currentcurrval, adminforgotpass,pairmanage}=require('../middleware/adminval')
// const {adminresetpass,Adminvalidationreset}=require('../middleware/adminreset')
const tfastatus=require('../helpers/tfa')
router.post('/adregis',admin,Adminvalidation,adminregis.adminreg)

router.get('/login',adminregis.login)

router.get('/verifytoken',adminregis.verifyToken,adminregis.verify)

router.post('/changepass',adminchangepass,Adminvalidation,adminregis.verifyToken,adminregis.verify,adminregis.change)

router.post('/sendmail',adminregis.sendmail)

router.post('/otpverify',adminforgotpass,Adminvalidation,adminregis.otpverify)

router.post("/twosteptoken",tfastatus.tfagenerate)

router.post('/kycstatus',kyc.login)

router.post('/kycstatusupadte',kyc.verifyToken,kyc.verify,tfastatus.tfagenerate)

router.post('/tfaverify',tfastatus.tfaverify)

router.post("/tfavalidate",tfastatus.tfavalidate)

router.post('/currencyman',adminregis.verifyToken,adminregis.verify,upload.single('currency_image'),managecurrval,Adminvalidation,currency.curr)    

router.post('/currentprice',adminregis.verifyToken,adminregis.verify,currentcurrval,Adminvalidation,currency.marketprice)

router.post('/pairmanage',pairmanage,Adminvalidation,adminregis.pairnman)

router.post('/userlist',adminregis.verifyToken,adminregis.verify,cloud.finduserlist)

router.get('/userstatus',adminregis.verifyToken,adminregis.verify,adminregis.userstatus)

router.post('/cryptoadminacc',adminregis.verifyToken,adminregis.verify,adminregis.cryptoadminnewacc)

router.post('/admingetbal',adminregis.verifyToken,adminregis.verify,adminregis.admincryptogetbal)

router.post('/cmsmanage',adminregis.verifyToken,adminregis.verify,adminregis.cmsnewcontent)

router.post('/contactmanage',adminregis.verifyToken,adminregis.verify,adminregis.contactnewcontent)

router.post('/sitebasic',adminregis.verifyToken,adminregis.verify,adminregis.settingnewcontent)

router.post('/cmsmanageinfo',adminregis.verifyToken,adminregis.verify,adminregis.cmsmanage)

router.post('/siteinfo',adminregis.verifyToken,adminregis.verify,adminregis.site)

router.post('/contactinfo',adminregis.verifyToken,adminregis.verify,adminregis.contact)

router.post('/updatecms',adminregis.verifyToken,adminregis.verify,adminregis.updatecms)

router.post('/updatecontact',adminregis.verifyToken,adminregis.verify,adminregis.updatecontact)

router.post('/updatesite',adminregis.verifyToken,adminregis.verify,adminregis.updatesite)

router.get('/overallhistory',adminregis.verifyToken,adminregis.verify,history.adminviewoverallhistory)

router.get('/particularhistory',adminregis.verifyToken,adminregis.verify,history.transaction)

module.exports=router