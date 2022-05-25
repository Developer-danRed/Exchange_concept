
const currency=require('../modal/curren')
const cloudinary=require('./cloudnary')
const upload=require('./mul')

const axios = require("axios");
const cheerio = require("cheerio");
// const { append } = require("domutils");
const curren = require('../modal/curren');

exports.curr=async (req,res)=>{
  // const axios = require('axios');
const result = await cloudinary.uploader.upload(req.file.path)

 const curren=new currency({
       
    currency_name:req.body.currency_name,
    symbol:req.body.symbol,
    // market_price:req.body.market_price,
    min_withdraw_fee:req.body.min_withdraw_fee,
    max_withdraw_fee:req.body.min_withdraw_fee,
    currency_type:req.body.currency_type,
    currency_image:result.secure_url,
    cloudinary_id:result.public_id

})
curren.save((err,data)=>{
if(data){
    res.json({message:'Currency management successsfully'})
}
else{
    res.json({message:'Currency mangagement failed'})
}
})
}

exports.marketprice=async(req,res)=>{

// const currency_name=req.body.currency_name   

let response = null;
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get('http://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=35', {
    
    

    headers: {
        'X-CMC_PRO_API_KEY': 'f3290767-4bd9-4b8d-8507-6297064cd021',
      },
    });
   
  } catch(ex) {
    response = null;
    // error
    res.json({message:ex});
    reject(ex);
  }
  if (response) {
    const getprice = response.data;
    const time=new Date()
     const answer=getprice.data.map(a=>({Name:a.name,Marketprice:a.quote['USD'].price,lastupdated:time.toString()}))

     const eth=answer[1].Marketprice
     const ethlastdate=answer[1].lastupdated

     const trx=answer[21].Marketprice
    //  console.log(trx)
     const btc=answer[0]  //   // success
  const curr=req.body.currency_name   
    if(curr=='btc')   
    {    
    currency.findOneAndUpdate({currency_name:curr},{$set:{market_price:btc}},(err,data)=>{

        if(data)
        {
          currency.findOne({currency_name:"btc"},{market_price:1},(err,data)=>{
            if(data){
res.json({message:"currentprice updated success"+data})
            }
          })
// res.send('btc current price updated')
        }
        else{
            res.json({message:err})
        }
    })
    }
    else if(curr=='eth')
    {
        currency.findOneAndUpdate({currency_name:curr},{$set:{market_price:eth}},(err,data)=>{
            if(data)
            {
              res.json({message:'eth current price updated'})
            }
            else{
                res.json({message:'eth current price not updated'})
            }
        })
    }
           
  else if(curr=='trx')
  {
    currency.findOneAndUpdate({currency_name:curr},{$set:{market_price:trx}},(err,data)=>{
      if(data)
      {
        res.json({message:'trx current price updated'})
      }
      else{
          res.json({message:'trx current price not updated'})
      }
  })
  
  }
  else 
  {
    res.json({message:'this currency not available'})
  }

  }
});
}