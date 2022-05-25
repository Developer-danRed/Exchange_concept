const dbconnect=require('../config/config')

const currency =new dbconnect.Schema({

currency_name:{
    type:String,
    unique:true
},
symbol:{
    type:String,
    unique:true
},
currency_image:
{
    type:String
},
cloudinary_id:{
    type:String
},

currency_type:{
type:String
},
market_price:{
 type:Number
},
min_withdraw_fee:{
    type:Number
},
max_withdraw_fee:{
    type:Number
},

lastcurrentprice:{
    type:Date
}

})

module.exports=dbconnect.model('currency',currency)