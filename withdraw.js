const dbconnect=require('../config/config')

const withdraw =new dbconnect.Schema({

    from_email:
    {
type:String
    },
    to_email :{
type:String
    },
email:{
    type:String
},
withdraw_fiat:{
    type:Number
},
fiatbalance:{
   type:String
},
fiataccno:{
type:String
},
ethwallet:{
    type:String
},
deposit_eth:{
type:String
},
withdraw_trx:{
type:String
},
trxwallet:{
    type:String
},
deposit_trx:
{
type:String
},
withdraw_timing: {type: Date, default: Date.now},

// updated_at: {type: Date, default: Date.now},


})

module.exports=dbconnect.model('withdraw',withdraw)