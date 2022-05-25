const express=require('express')
const app=express()
const bodyparser=require('body-parser')
app.use(bodyparser.json())
const cloudsch=require('../modal/user')
const adminschem=require('../modal/admin')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const jsonwebtoken=require('jsonwebtoken')

const JsonDB = require('node-json-db').JsonDB;
const Config = require('node-json-db/dist/lib/JsonDBConfig').Config;
const uuid=require('uuid')
// const speakeasy=require('speakeasy')
var db = new JsonDB(new Config("coinsale_db", true, false, '/'));


const speakeasy=require('speakeasy')

exports.login=function(req,res){

    adminschem.find({email:req.body.email},{password:1}, (err, result) => {
    if(result==0){
      res.send('err')
    }
    else{
        const decryptedString = cryptr.decrypt(result[0].password);
        if(decryptedString==req.body.password){
         const token= jsonwebtoken.sign({ email: req.body.email }, "secretkey", {expiresIn:'20s'})
                   res.send({token:token})
        }
   else{
     res.send("incorrect")
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
       
         res.send("token verify failed please verfied the to");
       
       }
       
       
       };
     
     exports.verify=(req,res,next)=>{
       jsonwebtoken.verify(req.token, "secretkey", (err, authData) => {
       
       if (err) {
     
         // res.sendStatus(403);
         res.json({message:"please login first"});
     
       } else {

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
       
     });
     };
   

// kyc

    exports.userfind=(req,res)=>
    {
    cloudsch.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
}


