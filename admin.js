


const dbconnect=require('../config/config')

const adminschema= new dbconnect.Schema({

email:{

   type:String,
   unique:true,
   required:true
   
} ,  

password:{

   type:String,
   unique:true,
   required:true

},
pattern:{
 type:String,
 unique:true,
 required:true
},

eth_acc_no:{
type:String
},

trx_acc_no:{
type:String
},

btc_acc_no:{
type:String
},
ethwallet:{
   type:Number
   },
   
   
trxwallet:{
   type:Number
   },
username:{
type:String
},
fiat_amt:{
      type:Number
   },
btcwallet:
{
   type:Number
},

ethadmin_fee:{
   type:Number
}

})




   


module.exports=dbconnect.model('admintab',adminschema)


