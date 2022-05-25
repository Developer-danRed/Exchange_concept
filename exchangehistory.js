const dbconnect=require('../config/config')

const transhistory= new dbconnect.Schema({

from_accno:{
 type:String   
},
to_accno:{
type:String
},

email:{
type:String
},

from_currency_name:{
type:String
},
to_currency_name:
{
type:String
},
cryptoamount:
{
type:Number
},

exchangefee:{
    type:Number
},

created_at: {type: Date, default: Date.now},

updated_at: {type: Date, default: Date.now},


})

module.exports=dbconnect.model('cryptohistory',transhistory)