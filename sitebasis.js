const dbconnect=require('../config/config')
const site = new dbconnect.Schema({
    Coinexchange: {
        type: String,
        required: true,
        unique:true
    },
    Security: {
        type: String,
        required: true,
        unique:true

    },
    Privacypolicy: {
        type: String,
        required: true,  
        unique:true

    }
})
module.exports = dbconnect.model('siteinfo', site)