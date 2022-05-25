const express=require('express')
const router=express.Router()
const bodyparser=require('body-parser')
router.use(bodyparser.json())
const cloudsch=require('../modal/user');


const Web3 = require("web3");
const user = require("../modal/user");
    var web3 = new Web3('https://ropsten.infura.io/v3/a1adccee1f9641a0b5f31b21690eb483');



const cloudinary = require('../helpers/cloudnary')
const upload = require('../helpers/mul')
const adminregis=require('../helpers/adregister')
const twostepve=require('../helpers/kycocr')
const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const uuid=require('uuid')
// const speakeasy=require('speakeasy')
var db = new JsonDB(new Config("coinsale_db", true, false, '/'));
const speakeasy=require('speakeasy')
// var db = new JsonDB(new Config("coinsale_db", true, false, '/'));

exports.tfagenerate=(req, res) => {
    const id = uuid.v4();
    try {
      const path = `/user/${id}`;
      // Create temporary secret until it it verified
      const temp_secret = speakeasy.generateSecret();
      // Create user in the database
      db.push(path, { id, temp_secret });
      // Send user id and base32 key to user
      res.json({ id, secret: temp_secret.base32 })
    } catch(e) {
      console.log(e);
      res.status(500).json({ message: 'Error generating secret key'})
    }
  }


  exports.tfaverify=(req,res) => {
    const { userId, token } = req.body;
    try {
      // Retrieve user from database
      const path = `/user/${userId}`;
      const user = db.getData(path);
    //   console.log({ user })
      const { base32: secret } = user.temp_secret;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
      });
      if (verified) {
        // Update user data
        db.push(path, { id: userId, secret: user.temp_secret });
        // res.json({ verified: true })
        cloudsch.find({email:req.body.email},(err,data)=>{
    
            if(err){
         
                res.json({message:'invalid email'})
            }
            else{
                res.json({message:data})
            }
        })
      } else {
        res.json({ verified: false})
      }
    } catch(error) {
      console.error(error);
      res.status(500).json({ message: error})
    };
  }
  

exports.tfavalidate= (req,res) => {
    const { userId, token } = req.body;
    try {
      // Retrieve user from database
      const path = `/user/${userId}`;
      const user = db.getData(path);
    //   console.log({ user })
      const { base32: secret } = user.secret;
      // Returns true if the token matches
      const tokenValidates = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 1
      });
      if (tokenValidates) {
      cloudsch.findOneAndUpdate({email:req.body.email},{$set:{kyc_status:req.body.kycstatus}},(err,data)=>{
                if(err)
                {
                    res.json({message:'not updated your status email id is not correct'})
                }
                else{
                    res.json({message:'user kyc status updated'})
                }
            })     

 cloudsch.findOneAndUpdate({email:req.body.email},{$set:{tfa_status:'1'}},{new:true},(err,data)=>{

    if(data)
    {
        res.json({ validated: true })

   
 }
    else
    {
        res.json({message:'tfa status error'})
    }
 })
      } else {
        
cloudsch.findOneAndUpdate({email:req.body.email},{$set:{tfa_status:'0'}},{new:true},(err,data)=>
{
    if(data)
    {
        res.json({ validated: false})
    }
    else{
        res.json({message:'tfa status error'})
    }
}) 
      }
    } catch(error) {
      console.error(error);
        res.status(500).json({ message: 'Error retrieving user'})
    };
  }
