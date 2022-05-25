const withdraw=require('../modal/transhistory')
const fiatamt=require('../modal/withdraw')
const fiatdeposit=require('../modal/deposit')
const exchangehist=require('../modal/exchangehistory');
const { userfind } = require('./kycocr');
const userschem=require('../modal/user')
var historyname;
var transemail
var exchange;

exports.transaction=(req,res,next)=>{
var email=req.email
// transemail=req.body.email
historyname=req.body.History_name

// userschem.find({email:transemail},(err,data)=>{

// if(data == 0)
// {
//     res.json({message:'email error'})
// }
// else{
  
//     var kyc=data[0].kyc_status
//     var tfa=data[0].tfa_status

//     if(kyc == 'approove' && tfa == '1')
//     {
// var currency=req.body.currency_name
if(historyname == 'withdraw' || historyname =='Withdraw')
{
fiatamt.find({email:email},(err,data)=>{
if(err)
{
    res.json({message:"data error"})
}
else{
    
    res.json({message:data})
}


})
}
else if(historyname == 'Deposit' || historyname == 'deposit')
{
 fiatdeposit.find({email:email},(err,data)=>{

        if(err)
        {
            res.json({message:"deposit history error"})
        }
        else{
            res.json({message:data})
        }
            })
}

else if(historyname == 'Exchange' || historyname == 'exchange')
{

exchangehist.find({from_email:email},(err,data)=>{

if(err)
{
res.json({message:'exchange history error'})
}
else{

    res.json({message:data})
}



})


}
else
{
    res.json({message:"please give a correct historyname"})
}
 }

    // else
    // {
    //     res.json({message:'kyc status and tfa status not verified'})
    // }

// }


// })

// }


exports.adminviewoverallhistory=(req,res,next)=>{
var email=req.email
  fiatamt.find({email:email},(err,data1)=>{
        if(err)
        {
            res.json({message:"fiat data error"})
        }
        else{
            
            // res.json({message:data})
 fiatdeposit.find({email:email},(err,data2)=>{

                if(err)
                {
                    res.json({message:"deposit history error"})
                }
                else{
                    // res.json({message:data})

                    exchangehist.find({from_email:email},(err,data3)=>{

                        if(err)
                        {
                        res.json({message:'exchange history error'})
                        }
                        else{
                        
                            res.json({message:data1,data2,data3})
                        }
                        
                        
                        
                        })






                }
                    })






        }
        
        
        })









}