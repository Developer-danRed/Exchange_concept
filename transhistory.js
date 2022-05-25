const dbconnect=require('../config/config')

const usertrans= new dbconnect.Schema({

email:{
 type:String   
},

eth_from_address:{
    type:String
    },
eth_to_address:{
        type:String
    },
ethtrans_amt:{
   type:Number
}, 
ethadmin_fee:{
type:Number
},

btc_address:{
type:String
},

btctrans_amt:{
type:Number
},
btc_txid:{
type:String
},

fiatwithdrawamt:{
 type:Number
},
yourfiatbal:{
    type:Number
},
trxfrom_address:
{
type:String
},
trxto_address:{
type:String
},
trxsend_amt:{
    type:Number
},
trxid:{
    type:String
},
trxadminfee:{
    type:Number
},
currency_name:{
    type:String
},


transaction_time: {type: Date, default: Date.now},

// updated_at: {type: Date, default: Date.now},


})

module.exports=dbconnect.model('utranshistory',usertrans)