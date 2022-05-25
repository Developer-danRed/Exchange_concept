const dbconnect=require('../config/config')

const trans =new dbconnect.Schema({


label:{
    type:String
},
amount:{
    type:Number
},
category:{
    type:String
},
confirmations:
{
    type:String
},
blockindex:
{
    type:Number
},
created_at: {type: Date, default: Date.now},

updated_at: {type: Date, default: Date.now},


})

module.exports=dbconnect.model('translist',trans)