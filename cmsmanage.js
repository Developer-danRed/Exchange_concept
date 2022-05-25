const dbconnect=require('../config/config')
const CmsManagement = new dbconnect.Schema({
    
        faq1: {
            type: String,
            required: true,
        },
        faq2: {
            type: String,
            required: true,

        },
        faq3: {
            type: String,
            required: true,
        },
        faq4: {
            type: String,
            required: true,
        },
    

    AboutUs: {
        type: String,
        required: true,
        unique: true
    },
    TermsAndCondition: {
        type: String,
        required: true,
        unique: true
    }

})
module.exports = dbconnect.model('CmsManagement', CmsManagement)
