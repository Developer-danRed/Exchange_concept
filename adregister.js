
const express=require('express')
const app=express()
const bodyparser=require('body-parser')
app.use(bodyparser.json())
const adminschem=require('../modal/admin')
const jsonwebtoken=require('jsonwebtoken')
const userschem=require('../modal/user')
var nodemailer = require('nodemailer');
const cmsmanage=require('../modal/cmsmanage')
const contact=require('../modal/contact')
const site=require('../modal/sitebasis')
const market=require('../modal/curren')
// const admin = require('../modal/admin')
const Cryptr = require('cryptr');
// const { stringify } = require('querystring')
// const { findOne, updateMany } = require('../modal/admin')
const otpGenerator = require('otp-generator')
const pairmansch = require('../modal/pairman')
const dotenv=require('dotenv')
// dotenv.config({path:`${__dirname}/.env`})
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const rpc = require('node-json-rpc2');

var moment=require('moment')

// const otpGenerator = require('otp-generator')


//web3
const Web3  =  require('web3');
const web3  =  new Web3("https://ropsten.infura.io/v3/a1adccee1f9641a0b5f31b21690eb483");
//tron
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io"); // For Shasta
// const fullNode = new HttpProvider("https://api.trongrid.io"); // For Mainnet
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "03B433392656870A216606E98CB3AA5EDD940E021C5BA3660F9CF4365257FF95";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);


//btc
var bitcoin_rpc = require('node-bitcoin-rpc')
// var btcbalance= require('balance-crypto')
let btc_config={
                protocol : "http",
                host :"192.168.1.60",
                user : "bitcoin",
                password : "Bitcoin",
                port  : "18332"
};
var translist=require('../modal/translistbtc')
const admin = require('../modal/admin')
const { marketprice } = require('./currman')







const cryptr = new Cryptr('myTotallySecretKey');
const otp=otpGenerator.generate(6)
// adminregis

exports.adminreg=(req,res)=>{

    const encryptedString = cryptr.encrypt(req.body.password);
    let user = new adminschem({
    
        email: req.body.email,
        password: encryptedString,
        pattern:req.body.pattern
    });
    
    user.save((err, result) => {
        
                if(err)
                {
                    res.send('insert error')
                }
                else{
                    res.send('insert successfully')
            
                }
    });


}
var adminnewtoken;
//login
exports.login=function(req,res){

 adminschem.find({email:req.body.email},{password:1}, (err, result) => {
 if(result==0){
   res.json('err')
 }
 else{
     const decryptedString = cryptr.decrypt(result[0].password);
     if(decryptedString==req.body.password){
      const token= jsonwebtoken.sign({ email: req.body.email }, "adminsecretkey", {expiresIn:'500s'})
                res.json({token:token})

                adminnewtoken=token
     }
else{
  res.json({message:"incorrect"})
}
 }

 })

  
      }
    
     
  
  // token verify
  exports.verifyToken=(req, res,next) =>{
  
    const bearerHeader = req.headers["authorization"];
    
    if (typeof bearerHeader !== "undefined") {
    
      const bearerToken = bearerHeader.split(" ")[1];
    
      req.token = bearerToken;
    
      next()
    
    } else {
    
      res.json({message:"token verify failed please verfied the to"});
    
    }
    
    
    };
  
  exports.verify=(req,res,next)=>{
    if(adminnewtoken == req.token)
    {
    jsonwebtoken.verify(req.token, "adminsecretkey", (err, authData) => {
    
    if (err) {
  
      // res.sendStatus(403);
      res.json({message:"please login first"});
  
    } else {
  
      if(adminnewtoken==req.token)
      {
        var adminde_token=jsonwebtoken.decode(adminnewtoken);
        var adminde_email=adminde_token.email
        req.email=adminde_email
        // console.log(req.email)
        next()
      }
    
   
    }
    
  });
}
else{
  res.send('incorrect token')
}
  };

exports.change=(req,res)=>{
    
var adminemail=req.email
const oldpassword=req.body.oldpassword
const newpass=req.body.newpassword
const encryptedString = cryptr.encrypt(newpass);
adminschem.find({email:adminemail},(err,data)=>{
 
    if(err)
    {
        // res.json({message:'invalid email'})
        throw err
    }
else{
  // console.log(data)
// var dbadminemail=data[0].email
  // if(dbadminemail == adminemail)
  // {
   
      var oldpass=data[0].password
      // console.log(oldpass)
      const decryptedString = cryptr.decrypt(oldpass);    
      // console.log(decryptedString)
  if(oldpassword==decryptedString)
  {
    // console.log('same')
    adminschem.findOneAndUpdate({email:adminemail},{$set:{password:encryptedString}},function(err,data){
          if(err)
          {
              res.json({message:'invalid email'})
          }
         
          else
          {
           res.json({message:'password changed Successfully'})
   
          }
        })
  }
  else{
    res.json({message:'your oldpassword does not match'})
  }
    // 
     
// }
// else{
//   res.json({message:'invalid email'})
// }
}

})

    
}

// console.log(otp)
exports.sendmail=function(req,res){
  var emailid=req.body.email
          adminschem.find({email:emailid},{email:1},(err,data)=>{
if(data ==0)
{
  res.send('invalid email')
}
else{
  var postemail=data[0].email
  // console.log(postemail)
  if(emailid == postemail)
  {
 
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.From,
      // user:req.body.email,
      pass: process.env.Password
      // pass:req.body.passsword
    }
  });
  
  var mailOptions = {
    from: process.env.From,
    // from:req.body.email,
    to: process.env.To,
    // to:req.body.email,
    subject: "using this resetlinkrouter:'localhost:1109/admin/otpverify'",
    text: otp
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      res.json({message:error});
    } else {
      res.json({message:'Email sent: ' + info.response});
    }
  });

}
else{
  res.json({message:'invalid email address'})
}
}
          })
        }
      
          

exports.otpverify=function(req,res){

const otpcode=req.body.otpcode
const password=req.body.password
const confirm=req.body.confirmpassword
if(confirm==password){

const encryptedString = cryptr.encrypt(password);
if(otpcode == otp )
{
  adminschem.findOneAndUpdate({email:req.body.email},{$set:{password:encryptedString}},(err,data)=>{
if(err){
  res.json({message:'error'})
}
else{
  // console.log('updated')
  res.json({message:'New Password Update Successfully'})
}
  })
}
else{
  res.json({message:'otp invalid'})
}
}
else{
  res.json({message:'password doesnot match'})
}
}

exports.pairnman=(req,res)=>
{
 const pair=new pairmansch({
 from_currency:req.body.from_currency,
 to_currency:req.body.to_currency,
 exchange:req.body.exchange,
 exchange_fee:req.body.exchange_fee 
  })
 pair.save((err,data)=>{
   
if(data)
{
  res.json({message:'pair manage set success'})
}
else
{
  res.json({message:'pair manage set failed'})
}
 })

}



  // user status

  exports.userstatus=(req,res)=>{
        
    userschem.find({email:req.body.email},(err,result)=>{
if(result == 0)
{
res.json({message:"user not in database"})
}
else{
const userdata={
user_id:result,
}
if(userdata.user_id == result){

var outtime=result[0].logout_time;
const deactive =moment(outtime).add(30,'days').calendar();
if(outtime<deactive)
{
userschem.updateOne({email:req.body.email},{$set:{user_acc_status:"Active"}},{new:true},(err,data)=>{
if(data)
{
userschem.findOne({email:req.body.email},(err,data)=>{
  if(data){
    res.json({message:data})
  }
  else{
    res.json({message:'user status not update'})
  }
  
})
}
else{
res.send('userstatus error')
}    
})
}
else{
userschem.updateOne({email:req.body.email},{$set:{user_acc_status:"Deactive"}},{new:true},(err,data)=>{
  
  if(data)
  {
userschem.findOne({email:req.body.email},(err,data)=>{
  if(data)
  {
    res.json({message:data})
  }
  else{
    res.json({message:'user status error'})
  }
})

  }
  else{
    res.json({message:'user status error'})
  }
})
}
}
}
    })


  }




  // amdmin crypto account


  exports.cryptoadminnewacc=(req,res)=>{

    var account_name=req.body.acc_name
    var  emailname=req.body.email
   
   
   
     if(account_name == 'trx'){
   
   
     adminschem.find({email:emailname},{trx_acc_no:1},(err,data)=>{
      const trxacc=data[0].trx_acc_no
       if(trxacc == null)
       {
         // const ton=[]
         const tronacc=TronWeb.createAccount()
         
         // ton.push(tron)
         //  console.log(tron)
         // res.send(tronacc)
        //  console.log(tronacc)
         
   
         adminschem.findOneAndUpdate({email:emailname},{$set:{trx_acc_no:tronacc}},(err,data)=>{
           if(data)
           {
             res.json({message:'trx account created successfully'})
           }
           else{
             res.json({message:'create account error'})
           }
           })
       }
       else{
         res.json({message:'you have already account in trx'})
       }
     })
     
   
     }
     else if(account_name == 'eth')
     {
       adminschem.find({email:emailname},{eth_acc_no:1},(err,data)=>{
         const trxacc=data[0].eth_acc_no
          if(trxacc == null)
          {
           const account=web3.eth.accounts.create();
           //   console.log(account)
             const ethaddress=account.address
             const privatekey=account.privateKey
            //  console.log(privatekey)
       
             adminschem.findOneAndUpdate({email:emailname},{$set:{eth_acc_no:ethaddress}},(err,data)=>{
               if(err)
               {
                 res.json({message:'error'})
               }
               else{
                 res.send('ETH Account Created')
               }
             })
   
          }
          else{
            res.json({message:'you have a already account in eth'})
          }
         })
     
      
     }
     else if(account_name == 'btc')
     {
       var holdername=req.body.name
       adminschem.find({email:emailname},{btc_acc_no:1},(err,data)=>{
         const btcacc=data[0].btc_acc_no
          if(btcacc == null)
          {
   rpcclient = new rpc.Client(btc_config);
   var method = 'getnewaddress';
   rpcclient.call({
   method: method,
   params:[holdername],
   id: '0',
   jsonrpc: '2.0'
   }, (cerr, btc_address) => {
     if(cerr)
     throw cerr
     else{
       
      const btc=btc_address
       var  btcadd=btc.result
       // res.send(btcadd)
     
   
   }
   
     adminschem.findOneAndUpdate({email:emailname},{$set:{btc_acc_no:btcadd}},(err,data)=>{
       if(data){
       
         res.json({message:'account created successfully'})
       }
       else{
         res.json({message:err})
       }
           })
   
   });
     
   }
   else{
     res.json({message:'Already you have account in btc'})
   }
   
   })
     }
     else{
       res.json({message:'only have a eth and trx and btc accounts'})
     }
   }
   

var balance
var balemail
var posemail
var acc_no
var accname
var trxacc
var trxbalance
var result
var btcbal

exports.admincryptogetbal=(req,res)=>{
  posemail=req.body.email
  accname=req.body.acc_name
 adminschem.find({email:posemail},{email:1,eth_acc_no:1,btc_acc_no:1,trx_acc_no:1} ,(err,data)=>{
 

  if(data){
    balemail=data[0].email
    acc_no=data[0].eth_acc_no
    trxacc=data[0].trx_acc_no
    btcbal=data[0].btc_acc_no
    // console.log(btcbal)
    if(balemail == posemail)
    {
      if(accname == 'eth')
      {

      web3.eth.getBalance(acc_no, async (err, result) => {
        if (err) {
            res.json({message:err});
            return;
        }
         balance = web3.utils.fromWei(result, "ether");
        
        // res.json({message:balance + " ETH"});
        
        adminschem.findOneAndUpdate({email:posemail},{$set:{ethwallet:balance}},(err,data)=>{
          if(err)
          {
            // res.json({message:data})
            throw err
          }
          else{
            res.json({message:data})
          }
        })



    });
 
    }
    else if(accname == 'trx')
    {
      var tron=trxacc
      // console.log(tron)
      var address=tron
      tronWeb.trx.getBalance(address,(err,balance)=>{
          // console.log(balance)
           trxbalance=balance

      });
adminschem.findOneAndUpdate({email:posemail},{username:req.body.username},{$set:{trxwallet:trxbalance}},(err,data)=>{
  if(err)
  {
res.json({message:'error'})
  }
  else{
res.json({message:data})

  }
 
})

    }
    else if(accname == 'btc')
    {
     
 translist.find({label:req.body.name},{label:1,amount:1},(err,data)=>{
  if(data==0)
  {
    res.json({success:false,message:'username error'})
  }
  else{
    var btcwal=data[0].amount
    var lab=data[0].label
    // console.log(lab)
    // console.log(btcwal)
// res.send(data)
adminschem.find({email:req.body.email},{username:1},(err,data)=>{
  if(data == 0){

res.json({success:false,message:'username not find'})
  }
else{
var uname=data[0].username
  // console.log(uname)
  if(uname == lab)
  {
    adminschem.findOneAndUpdate({email:posemail},{$set:{btcwallet:btcwal}},(err,data)=>{
      if(data==0)
      {
        res.json({message:"no reg"})
      }
      else{
        res.json({message:data})
      
      }
      })
  }
  else{
    res.json({success:false,
      message:"username not same"})
  }

}


})

  }
})

    }
    else{
      res.json({message:'not in account'})
    }
  }
    else
    {
      res.json({message:'invalid email'})
    }
  
  }
  else{
    res.json({message:'data error'})
  }
 })
  
}

exports.cmsnewcontent = (req, res)=>{
  const oursite = new cmsmanage({
    faq1:req.body.faq1,
    faq2:req.body.faq2,
    faq3:req.body.faq3,
    faq4:req.body.faq4,
    faq5:req.body.faq5,
    AboutUs:req.body.AboutUs,
    TermsAndCondition:req.body.TermsAndCondition
  })
  
  oursite.save(function (err, data) {
      if (err) {
          res.json({ err })
      }
      else {
          res.json({ success: data })
      }
  })
}
exports.cmsmanage =(req, res)=>{
  cmsmanage.find(function (err, data) {
      if (err) {
          console.log(err)
      }
      else {
          res.json({ success: data })
      }
  })
}

exports.updatecms = (req, res)=> {
  cmsmanage.findByIdAndUpdate(req.body._id,
      {
          
              faq1: req.body.faq1, faq2: req.body.faq2,
              faq3: req.body.faq3, faq4: req.body.faq4,
              faq5: req.body.faq5,
              AboutUs: req.body.AboutUs,
              TermsAndCondition: req.body.TermsAndCondition
      },
      function (err, data) {
          if (err) {
              console.log(err)
          }
          else {
              res.json({ success: data })
          }
      })
}


exports.contactnewcontent = (req, res)=>{
    const oursite = new contact({
    ContactSupport :req.body.ContactSupport,
    Facebook :req.body.Facebook,
    Instagram :req.body.Instagram,
    Twitter :req.body.Twitter,
    HelpCenter :req.body.HelpCenter
  })
    oursite.save(function (err, data) {
        if (err) {
            res.json({message:err})
        }
        else {
            res.json({ success: data })
        }
    })
}
exports.contact= function(req,res){
    contact.find(function(err,data){
     if(err){
         res.json({message:err})
     }
     else{
         res.json({success:data})
     }   
 })
}


exports.updatecontact=function(req,res){
  
  contact.findByIdAndUpdate(req.body._id,req.email,
      {ContactSupport:req.body.ContactSupport,Facebook:req.body.Facebook,
          Instagram:req.body.Instagram,Twitter:req.body.Twitter,HelpCenter:req.body.HelpCenter},function(err,data){
      if(err){
          res.json({message:err})
      }
      else{
          res.json({success:data})
      }
  })
}



exports.settingnewcontent=function(req,res){
  const oursite=new site({
    Coinexchange:req.body.Coinexchange,
    Security:req.body.Security,
    Privacypolicy:req.body.Privacypolicy
  })

         oursite.save(function(err,data){   
         if(err){
             console.log(err)
         }
         else{ 
             res.json({success:data})
         }
     })
}
exports.site= function(req,res){
      site.find(function(err,data){
       if(err){
           console.log(err)
       }
       else{
           res.json({success:data})
       }   
   })
  }

exports.updatesite=function(req,res){
  site.findByIdAndUpdate(req.body._id,
      {Coinexchange:req.body.Coinexchange,Security:req.body.Security,
          Privacypolicy:req.body.Privacypolicy},function(err,data){
      if(err){
          res.send(err)
      }
      else{
          res.json({success:data})
      }
  })
}
