const express = require('express')
const exp=express()
// const router = express.Router();
const cloudinary = require('./cloudnary')

var path=require('path')
const notifier = require('node-notifier');
// const User = require('../modal/cloud')
const cloudsch=require('../modal/user');
// const { findOneAndUpdate } = require('../modal/user');

// profile upload

// var email1
exports.profile=async (req,res,next)=>{
    var email1=req.email
    const result = await cloudinary.uploader.upload(req.file.path)
      cloudsch.findOneAndUpdate({email:email1},{$set:{firstname:req.body.firstname,lastname:req.body.lastname,mobilenumber:req.body.mobilenumber,profileimage:result.secure_url}},(err,data)=>{

        if(err)
        {
            res.json({message:'error'})
        }
        else{
            res.json({message:'Profile Update Successfully'})
        }
      })


}

//cloud image upload


exports.kycupload=async (req, res ,next) => {
 


const urls=[];

const files=req.files;
for(const file of files){
    const {path}=file;
    const result=await cloudinary.uploader.upload(path);
    urls.push(result.secure_url);
// console.log(urls)
};
var email=req.email;
await cloudsch.updateOne({email:email},
    {$set:{adhaarfront:urls[0],adhaarback:urls[1],selfie:urls[2]}},(err,data)=>{
      
      if(err){
res.json({message:'upload failed'})
      }  
      else{
          res.json({message:data});
          }
    })
       
 }


exports.finduserlist=(req, res) => {
    cloudsch.find(function (err, data) {
        if (err) {
            res.json({message:err});
        }
        else {
            res.json({message:data});
        }
    });
}

    

// router.delete("/remove", async (req, res) => {
//     try {
//         let user = await User.findById(req.body._id)
//         await cloudinary.uploader.destroy(user.cloudinary_id)//delete cloude_id
//         await user.remove()//remove database
   
    
//         notifier.notify('Deleted successfully');
    
     
    
     
//         // res.send('Deleted')// res.json(user)
//     } catch (error) {
//         console.log(error)
//     }
// })
// router.put('/:id', async (req, res) => {
//     try {
//         let user = await User.findById(req.params.id)
//         await cloudinary.uploader.destroy(user.cloudinary_id)
//         const result = await cloudinary.uploader.upload(req.file.path)
//         const data = {
//             name: req.body.name || user.name,
//             avatar: result.secure_url || user.avatar,
//             cloudinary_id: result.public_id || user.cloudinary_id
//         }
//         user = await User.findByIdAndUpdate(req.params.id, data, { new: true })
//         res.json(user)
//     } catch (error) {
//         console.log(error)
//     }
// })
// module.exports = router