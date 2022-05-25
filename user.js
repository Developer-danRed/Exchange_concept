


const dbconnect=require('../config/config')

const userschema= new dbconnect.Schema({

email:{

   type:String,
   unique:true,
 
   
} ,
password:{

   type:String,
  
  

},
// confirmpassword:{

//     type:String,
   
  
 
//  },
username:{
 type:String,

},

firstname: {
   type: String,
   unique:true
},
lastname:{
   type:String

},
mobilenumber:{
type:Number,

},
profileimage: {
   type: String,

},

adhaarfront:{
type:String,


},
adhaarback:
{
   type:String,
   
},
selfie:
{
   type:String,
  
},

cloudinary_id: {
   type: String
},
kyc_status:{
   type:String
},
tfa_status:
{
   type:String
},
fiataccno:{
type:String
},
eth_account_no:{
type:String
},

btc_acc_no:{
   type:String
},

trx_account_no:{
type:String
},
user_acc_status:{
type:String
},
user_status:{
   type:String
},

login_time:{

type:String
},
logout_time:
{
type:String
},
created_at: {type: Date, default: Date.now},

updated_at: {type: Date, default: Date.now},

fiatamt:{
type:Number
},

ethwallet:{
type:Number
},
// ethadmin_fee:{
//    type:String
// },



trxwallet:{
type:Number
},

btcwallet:{
   type:Number
}


})




module.exports=dbconnect.model('usertab',userschema)


