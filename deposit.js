const dbconnect=require('../config/config')

const deposit =new dbconnect.Schema({


email:{
    type:String
},
fiat:{
    type:Number
},
PayId:{
   type:String
},
fiataccno:{
type:String
},
created_at: {type: Date, default: Date.now},

updated_at: {type: Date, default: Date.now},


})

module.exports=dbconnect.model('deposit',deposit)