
var mongoose=require('mongoose');


mongoose.connect( "mongodb://localhost:27017/coinsale_Db",(err,res) => {
if(err){
    console.log("db not connected")
}
else{
    console.log("db connected")
}
    
})
module.exports = mongoose