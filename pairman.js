const dbconnect=require('../config/config')

const pairmanagement =new dbconnect.Schema({

from_currency:{
    type:String,
    
},
to_currency:{
    type:String,
    
},
exchange:
{
    type:String,

},
exchange_fee:{
    type:Number
},


})

module.exports=dbconnect.model('pairman',pairmanagement)