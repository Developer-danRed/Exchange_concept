const dbconnect=require('../config/config')
const contact = new dbconnect.Schema({
    ContactSupport: {
        type: String,
        required: true,
        unique: true
    },
    Facebook: {
        type: String,
        required: true,
        unique: true
    },
    Instagram: {
        type: String,
        required: true,
        unique: true
    },
    Twitter: {
        type: String,
        required: true,
        unique: true
    },      

   
    HelpCenter: {
        type: String,
        required: true,
        unique: true
    },

})
module.exports = dbconnect.model('contact', contact)