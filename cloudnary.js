const cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: "******Colud_Name********",
    api_key: "******Api_Key*******",
    api_secret:"******Api_Secret*****"
})
module.exports = cloudinary
