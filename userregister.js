const express = require('express')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
// const admin=require('../modal/admin')
const userschem = require('../modal/user')
const adminschem = require('../modal/admin')
const currentprice = require('../modal/curren')
const withdraw = require('../modal/transhistory')

const market=require('../modal/curren')
const fiatwithdraw=require('../modal/withdraw')
// const pair=require('../modal/pairman')
const deposit = require('../modal/deposit')
const rpc = require('node-json-rpc2');
// web3
const Web3 = require('web3');
const web3 = new Web3("https://ropsten.infura.io/v3/a1adccee1f9641a0b5f31b21690eb483");

const coinexchange = require('../modal/exchangehistory')



const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
 const fullNode = new HttpProvider("https://api.shasta.trongrid.io"); // For Shasta
// const fullNode = new HttpProvider("https://api.trongrid.io"); // For Mainnet
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");

//btc
var bitcoin_rpc = require('node-bitcoin-rpc')
// var btcbalance= require('balance-crypto')
let btc_config = {
  protocol: "http",
  host: "192.168.1.60",
  user: "bitcoin",
  password: "Bitcoin",
  port: "18332"
};
var translist = require('../modal/translistbtc')

// const Web3 = require("web3");
const currencyman = require('../modal/curren')
const pairmanage = require('../modal/pairman')
const jsonwebtoken = require('jsonwebtoken')
var nodemailer = require('nodemailer');
const admin = require('../modal/admin')
const dotenv = require('dotenv')
dotenv.config({ path: `${__dirname}/.env` })

const transhis = require('../modal/transhistory')
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');
// const admin = require('../modal/admin')
const Cryptr = require('cryptr');
// var web3 = new Web3('https://ropsten.infura.io/v3/a1adccee1f9641a0b5f31b21690eb483');

var moment = require('moment')

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': "AYFHPq6iRpKLUR9crhFZBh97QWd3_GtgOKWLwLAO-4KOdYM4CArqd5wsjyT3_5WTU123Z4btoCWild48"

  , 'client_secret': "EL9L8zszbZyzV5Z3k38rhmVTeoSadpyJuyHWMPsS4LuHogCFaw8dK25gp-EISaBVG-Joo5ZzV0xyhHU4"
 
});

const otpGenerator = require('otp-generator')
const user = require('../modal/user')

const cryptr = new Cryptr('myTotallySecretKey');
const otp = otpGenerator.generate(6)
const reotp=otpGenerator.generate(13)
// adminregis
var cw = require('crypto-wallets');

const exp = require("express");
const { response } = require('express')
const exp1 = exp();

// user register

exports.userreg = (req, res) => {
  const password1 = req.body.password
  const encryptedString = cryptr.encrypt(password1);
  // var newacc = reotp
  // const encryptedString1 = cryptr.encrypt(confirmpassword1)
  let user = new userschem({

    email: req.body.email,
    password: encryptedString,
    // confirmpass:req.body.confirmpassword,
    username: req.body.username,
    fiataccno: reotp,
    fiatamt:'0'

  });

  if (password1 == req.body.confirmpassword) {

    user.save((err, result) => {

      if (err) {
        res.json({message:'already register'})
      }
      else {
 var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.From,
            // user:req.body.email,
            pass: process.env.Password
            // pass:req.body.passsword
          }
        });

        var mailOptions = {
          from: process.env.From,
          // from:req.body.email,
          to: process.env.To,
          // to:req.body.email,
          subject: "paypal wallet:",
          text: "Thanks for your registraion, account created successfully your private key will be secure properly in our bank.so dont worry.don't share your account_no and private key."
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({message:'email server error'});
          } else {
            res.json({message:'New Account created successfully confirmation message send your Register email' });
          }
        });
  }
    });

  }
  else {
    res.json({message:'password doesnot match'})
  }
}


//user login
var newtoken1;

var logindt = moment().format('MM/DD/YYYY')
exports.userlogin = function (req, res) {
  var useremail = req.body.email
  userschem.find({ email:useremail},{email:1,password:1}, (err, result) => {
    if (result == 0) {
      res.json({message:'email or password incorrect'})
    }
    else {
      const decryptedString = cryptr.decrypt(result[0].password);
      // console.log(decryptedString)
      if (decryptedString == req.body.password) {
        userschem.updateOne({ email: useremail }, { $set: { login_time: logindt, user_status: 'Active now' } }, { new: true }, (err, data) => {
          if (err) {
            res.json({message:'login error'})

          }
          else {
            // res.json({message:'login success'})
            const token = jsonwebtoken.sign({ email: req.body.email }, "usersecretkey", { expiresIn: '50s' })
            res.json({ token: token })
            newtoken1 = token
          }
        })
      

      }
      else {
        res.json({message:'incorrect password'})
      }

    }

  })


}

// user logout

var logout = moment().format('MM/DD/YYYY')
exports.userout = (req, res) => {
  var useremail = req.body.email
  userschem.find({ email: useremail }, { email: 1 }, (err, data) => {
    // if(data){

    // console.log(user1)
    if (data == 0) {
      res.json({message:"no email"})
    }
    else {
      var user1 = data[0].email
      if (user1 == useremail) {
        userschem.updateOne({ email: useremail }, { $set: { logout_time: logout, user_status: 'Logut' } }, { new: true }, (err, data) => {

          if (data == 0) {
            res.json({message:'email error'})
          }
          else {

            res.json({message:'logout successfully'})
          }
        })
      }
    }

    // }

  })
  // console.log(useremail)

}


// token verify
exports.userverifyToken = (req, res, next) => {

  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {

    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    next()

  } else {

    res.json({message:"token verify failed please verfied the to"});

  }


};


// user token verify

exports.userverify = (req, res, next) => {
  if (newtoken1 == req.token) {
    jsonwebtoken.verify(req.token, "usersecretkey", { expiresIn: '500s' }, (err, authData) => {

      if (err) {

        // res.sendStatus(403);
        res.json({message:"Token Expire regenerate a new JsonWeb Token"});

      } else {

        if(newtoken1==req.token)
        {
          var de_token=jsonwebtoken.decode(newtoken1);
          var de_email=de_token.email
          req.email=de_email
          console.log(req.email)
          next()
        }
else{
  res.json({message:'decode error'})
}
      
 
      }

    });
  }
  else {
    res.json({message:'incorrect token'})
  }
};



//change password 

exports.userchange = (req, res, next) => {
var email=req.email
  const oldpassword = req.body.oldpassword
  const newpass = req.body.newpassword
  const encryptedString = cryptr.encrypt(newpass);
  userschem.find({ email: email }, { password: 1 }, (err, data) => {

    if (err) {
      res.json({message:'invalid Email'})
    }
    else {
      // console.log(data)
      const oldpass = data[0].password
      const decryptedString = cryptr.decrypt(oldpass);
      // console.log(decryptedString)
      if (oldpassword == decryptedString) {
        // console.log('same')
        userschem.findOneAndUpdate({ email: email }, { $set: { password: encryptedString } }, function (err, data) {
          if (err) {
            res.json({message:'Updation Error'})
          }

          else {
            res.json({message:'Password changed Successfully'})

          }
        })
      }
      else {
        res.json({message:'your oldpassword does not match'})
      }
      // 


    }

  })

}


var currentotp;
//send mail
exports.usersendmail = function (req, res) {
  var emailid = req.body.email
  userschem.find({ email: emailid }, { email: 1 }, (err, data) => {
    if (data == 0) {
      res.json({message:'invalid email'})
    }
    else {
      var postemail = data[0].email
      if (emailid == postemail) {
        var otptimevalid = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        currentotp = otptimevalid
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.From,
            pass: process.env.Password
          }
        });

        var mailOptions = {
          from: process.env.From,
          to: process.env.To,
          subject: "using this resetlinkrouter:'localhost:1109/user/userotpverify'",
          text: otp
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json('Mail Send Error');
          } else {
            res.json({message:'Your Reset password Link send to your Registraion Email'});
          }
        });

      }
      else {
        res.json({message:'invalid email'})
      }
    }

  })

}


//userotpverify
exports.userotpverify = function (req, res) {
  // var email=req.email

  const otpverifytime = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")


  const calculation = moment(otpverifytime).diff(currentotp, 'seconds')



  const otpcode = req.body.otpcode
  const password = req.body.password
  const confirm = req.body.confirmpassword
  if (confirm == password) {

    const encryptedString = cryptr.encrypt(password);
    if (otpcode == otp) {
      if (calculation <= 60) {

        userschem.findOneAndUpdate({ email: req.body.email }, { $set: { password: encryptedString } }, (err, data) => {
          if (err) {
            res.json({message:'new password update error'})
          }
          else {
            // console.log('updated')
            res.json({message:'Your password Changed Successfully'})
          }
        })
      }
      else {
        res.json({message:'time expire regenrate-otp'})
      }
    }
    else {
      res.json({message:'otp invalid'})
    }
  }
  else {
    res.json({message:'password doesnot match'})
  }
}



// userdeposit kyc verify


var dat1email;
var fiat1
var fiat
var addfiat
var kyc
var email1
var fiatacc
var dbacc
exports.userdepositverify = (req, res) => {
  dat1email = req.email
  userschem.find({ email: dat1email }, { kyc_status: 1, email: 1, fiatamt: 1,fiataccno:1 }, (err, data) => {

   


    fiat1 = req.body.fiat
    fiatacc=req.body.fiataccno
    //  adfiat=req.body.fiat
    // console.log(dat1email)
    if (data == 0) {
    res.json({message:'email error'})
}
    else {
      email1 = data[0].email
      // console.log(email1)
      kyc = data[0].kyc_status
      //  console.log(kyc)
      fiat = data[0].fiatamt
      // console.log(fiat)
      dbacc=data[0].fiataccno

      
      // console.log(addfiat)
      // console.log(fiat)
      // console.log(kyc)
      if (email1 == dat1email) {
        if(fiatacc == dbacc)
{

  if (kyc == 'approove') {


    res.json({ message: `http://localhost:1109/user/startpay` })
  }
  else if (kyc == 'disapproove') {

    res.json({ message: 'disapproove of your kyc status so cannot deposit for your account' })
  }
  else {

    res.json({ message: 'kyc not verify' })
  }
}
else{
 
  res.json({message:'accno error'})
}

     }
      else {
        res.json({message:'invalid email'})
      }

    }

  })


}

// exports.deposit=(req,res,next)=>{
//   const total=req.body.amount
//   const quantity=req.body.quantity

//   next()
// }

const payoption = 0
// var total=25
var quantity = 1

exports.userpayfunction = (req, res) => {

addfiat = fiat + fiat1
  if (payoption == 0) {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": "http://localhost:1109/user/success",
        "cancel_url": "http://localhost:1109/user/cancel"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": "Red Sox Hat",
            "sku": "001",
            "price": addfiat,
            "currency": "USD",
            "quantity": quantity
          }]
        },
        "amount": {
          "currency": "USD",
          "total": addfiat
        },
        "description": "Hat for the best team ever"
      }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === 'approval_url') {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }
  else {
    console.log('err')
  }
}

exports.userpaysuccess = (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "USD",
        "total": addfiat
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
      // console.log(error.response);
      throw error;
    } else {
      // console.log(JSON.stringify(payment));
      // res.send('Success');

      const collecttotal = payment.transactions[0].amount.total
      console.log(collecttotal)
      const orderid = payment.id
      console.log(orderid)
      const shipping = payment.payer.payer_info.shipping_address.recipient_name
      // console.log(shipping)

      console.log(dat1email)
      userschem.find({ email: dat1email }, { fiatamt: 1,fiataccno:1 }, (err, data) => {
        if (data == 0) {

          res.json({ message: "data error" })

        }
        else {
          var fiatacc = data[0].fiataccno

          // var collectotal1=fiat+collecttotal
          userschem.findOneAndUpdate({ email: dat1email }, { $set: { fiatamt: collecttotal } }, (err, data) => {
            if (err) {
              throw err
            }
            else {

              var dep = new deposit({
                email: dat1email,
                fiat: fiat1,
                PayId:orderid,
                fiataccno:dbacc
              })
              dep.save((err, data) => {

                if (err) {
                  throw err
                }

                else {
                  res.json({ message: 'deposit success' })
                }
              })


            }
          })
        }

      })





    }
  });
}

// user balance getting

var balance
var balemail
var posemail
var acc_no
var accname
var trxacc
var trxbalance
var result
var btcbal
exports.getbal = (req, res) => {
  posemail = req.body.email
  accname = req.body.acc_name
  userschem.find({ email: posemail }, { email: 1, eth_account_no: 1, btc_acc_no: 1, trx_account_no: 1 }, (err, data) => {


    if (data) {
      balemail = data[0].email
      acc_no = data[0].eth_account_no
      trxacc = data[0].trx_account_no
      btcbal = data[0].btc_acc_no
      // console.log(btcbal)
      if (balemail == posemail) {
        if (accname == 'eth') {

          web3.eth.getBalance(acc_no, async (err, result) => {
            if (err) {
              res.json({message:err});
              return;
            }
            balance = web3.utils.fromWei(result, "ether");

            // res.json({message:balance + " ETH"});

            userschem.findOneAndUpdate({ email: posemail }, { $set: { ethwallet: balance } }, (err, data) => {
              if (data) {
                res.json({message:data,balance})
              }
              else {
                res.json({message:err})
              }
            })


          });

        }
        else if (accname == 'trx') {
          const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, PrivateKey1);

      
          var tron = trxacc
          // console.log(tron)
          var address = tron
          tronWeb.trx.getBalance(address, (err, balance) => {
            // console.log(balance)
            trxbalance = balance

          });
          userschem.findOneAndUpdate({ email: posemail }, { $set: { trxwallet: trxbalance } }, (err, data) => {
            if (err) {
              res.json({message:'error'})
            }
            else {
              res.json({message:data})

            }

          })

        }
        else if (accname == 'btc') {

          translist.find({ label: req.body.name }, { label: 1, amount: 1 }, (err, data) => {
            if (data == 0) {
              res.json({ success: false, message: 'username error' })
            }
            else {
              var btcwal = data[0].amount
              var lab = data[0].label
              // console.log(lab)
              // console.log(btcwal)
              // res.send(data)
              userschem.find({ email: req.body.email }, { username: 1 }, (err, data) => {
                if (data == 0) {

                  res.json({ success: false, message: 'username not find' })
                }
                else {
                  var uname = data[0].username
                  // console.log(uname)
                  if (uname == lab) {
                    userschem.findOneAndUpdate({ email: posemail }, { $set: { btcwallet: btcwal } }, (err, data) => {
                      if (data == 0) {
                        res.json({message:"no reg"})
                      }
                      else {
                        res.json({message:data})

                      }
                    })
                  }
                  else {
                    res.json({
                      success: false,
                      message: "username not same"
                    })
                  }

                }


              })

            }
          })

        }
        else {
          res.json({message:'not in account'})
        }
      }
      else {
        res.json({message:'invalid email'})
      }

    }
    else {
      res.json({message:'data error'})
    }
  })

}

// user btctransaction list

exports.btctranslist = (req, res) => {
  bitcoin_rpc.init(btc_config.host, btc_config.port, btc_config.user, btc_config.password)

  bitcoin_rpc.call("listtransactions", ["*", 1000], function (err, data) {
    if (err)
    {
      throw err
    }
    else {

     var name = req.body.name

      for (var i = 0; i <=100; i++) {
        if (data.result[i].label == name) 
        {
          var add1 = data.result[i].address
          var amt = data.result[i].amount
          var lab = data.result[i].label
          var cat = data.result[i].category
          var con = data.result[i].confirmations
          var blk = data.result[i].blockindex

          // var address

          var trans = new translist({
            label: lab,
            amount: amt,
            category: cat,
            confirmations: con,
            blockindex: blk,
            address: add1

          })

          // console.log(add1)

          trans.save((err, data) => {
            if (err)
              console.log(err)
            else {
              res.json({message:'save success'})
            }
          })
        }
      }

    }
  })

}


// useraccount checking

exports.useraccount = (req, res) => {

  userschem.find({ email: req.body.email }, (err, data) => {
    if (data) {
      res.json({message:data})


    } else {
      res.json({message:'invalid email'})
    }
  })
}


// ethtransaction

var transemail;
// var btcadd
var adminbalamt;
exports.ethtransaction = (req, res) => {
  transemail = req.body.email
  userschem.findOne({ email: transemail }, { kyc_status: 1, ethwallet: 1 }, (err, data) => {

    if (data==0) {

      res.json({message:'invalid email'})
    }
    else {
      var kyc1 = data.kyc_status

   
      var ethbal = data.ethwallet
    
      if (kyc1 == 'approove') {
        const Private_Key = req.body.Private_Key
        var from_add = req.body.from_address;
        var to_address = req.body.to_address;
        var curval = req.body.value
        var currency=req.body.currency_name

        var sendamount = web3.utils.toWei(curval.toString(), 'ether')

        async function eth_transaction() {

          var SingedTransaction = await web3.eth.accounts.signTransaction({
            from: from_add,
            to: to_address,
            value: sendamount,
            gas: 210000
          }, Private_Key);

          web3.eth.sendSignedTransaction(SingedTransaction.rawTransaction).then((receipt) => {
            res.json({message:receipt});
          });

          var adminfee2 = 0.0001

          var a = ethbal - adminfee2
          // var b=curval-a
          // console.log(b)
          var balaceamt = a
          // console.log(balaceamt)
          admin.find((err, data) => {

            if (data) {

              const adminbal = data[0].ethwallet
              
              // console.log(adminbal)

              adminbalamt = adminbal + adminfee2



              userschem.findOneAndUpdate({ email: transemail }, { $set: { ethwallet: balaceamt } }, (err, res) => {

                if (data==0) {
                  
                  res.json({message:'Invalid Email'})
                }
                else {
                  // res.send('transaction saved')

                  admin.updateOne({ ethwallet: adminbalamt }, (err, data) => {
                    if (data==0) {
                      res.json({message:'Invalid Email'})

                    }
                    else {
                      let trans = new transhis({
                        email: transemail,
                        //  ethadmin_fee:adminfee2,
                        from_address: from_add,
                        to_address: to_address,
                        trans_amount: curval,
                        ethadmin_fee: adminfee2,
                        currency_name:currency



                      })
                      trans.save((err, data) => {
                        if (err) {
                          // res.json({message:'transaction error'})
                         res.json(err)
                        }
                        else {
                        console.log("transaction success")


                        }

                      })
                      // ('transaction success')
                    }
                  })
                }
              })

            }
            else {
              res.json({message:'cannot get admin bal'})
            }

          })


        }
        eth_transaction()
        // const value=SingedTransaction.value
      }


      else if (kyc == 'disapproove') {

        res.json({message:'your kyc status not approve'})
      }
      else {
        res.json({message:'kyc status invalid'})
      }
    }


  })


  // eth_transaction();
}

// btctransaction


exports.btctransaction = (req, resp) => {
  var address = req.body.To_address
  var amount = req.body.amount
  var currency=req.body.currency_name
  var adminfee=0.0002
userschem.find({email:req.body.email},(err,data)=>{
  if(data ==0){
    resp.json({message:"email error"})
  }
  else{
var btcstatus=data[0].kyc_status
var btcwal=data[0].btcwallet
if(btcstatus == 'approove')
{

bitcoin_rpc.init(btc_config.host, btc_config.port, btc_config.user, btc_config.password)


  bitcoin_rpc.call('getbalance', [], (err, res) => {
    if (err !== null) {
      res.json({message:err});

    } else if (res.result > amount) {
      bitcoin_rpc.call('sendtoaddress', [address, amount], (err, res1) => {
        if (err !== null) {
          throw (err);
        } else if (res1.error && res1.error.message) {
          resp.json({
            message: res1.error.message,
            error: 'OK'
          });
        } else if (res1.result) {
          resp.json({
            txid: res1.result,
            success: 'OK'
          });
var btcbal=btcwal-adminfee
userschem.findOneAndUpdate({email:req.body.email},{$set:{btcwallet:btcbal}},(err,data)=>{
if(data == 0)
{
  resp.json({message:'data error'})
}
else {
  

  const btctrans=new withdraw({
    email:req.body.email,
    btc_address:address,
    btctrans_amt:amount,
    btc_txid:res1.result,
    currency_name:currency,
    adminfee:adminfee
  })
  btctrans.save((err,data)=>{
    if(err)
    {
      // res.json({message:'error'})
      throw err
    }
    else
    {
      // res.json({message:'Transaction Saved'})
      console.log({mesage:data})
    }
  })



}
})
        }
      });
    } else {

      res.json({message:"no amount in wallet"})
    }
  });
}
else if(btcstatus =='disapproove')
{
resp.json({message:"kyc not approove so did not continue your transaction"})
}
else{
  resp.json({message:'kyc status data error'})
}
}
})

}


// trxtransaction

var privateKey
exports.trxtransaction = (req, res) => {
privateKey=req.body.privatekey
userschem.find({email:req.body.email},{kyc_status:1},(err,data)=>{
  if(data==0){
res.json({message:'email error'})
  }
  else{
    var kyc=data[0].kyc_status
    // console.log(kyc)
    if(kyc =='approove')
    {
      userschem.find({ trx_account_no: req.body.from_address }, { trxwallet: 1, trx_account_no: 1 }, (err, data) => {
        if (data == 0) {
          res.json({ message: 'invalid email' })
        }
        else {
          var trx_wallet = data[0].trxwallet
          // console.log(trx_wallet)
          userschem.find({ trx_account_no: req.body.To_address }, { trxwallet: 1, trx_account_no: 1 }, (err, data) => {
            if (data == 0) {
              res.json({ message: 'invalid email' })
            }
            else {
              const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

                var trx_wallet = data[0].trxwallet
                // console.log(trx_wallet)
                async function send_trx() {
    
                var from_add = req.body.from_address // Account whose private key is used to initialise Tronweb
                var to_add = req.body.To_address
                var amount = req.body.amount; // Value is in Sun : 1 TRX = 10 ** 6 Sun
    
                var transaction_object = await tronWeb.transactionBuilder.sendTrx(
                  to_add,
                  amount,
                  from_add
                ).catch((err) => { console.log(err) });
    
                const signedtxn = await tronWeb.trx.sign(
                  transaction_object,
                  privateKey
                ).catch((err) => { console.log(err) });
    
                const receipt = await tronWeb.trx.sendRawTransaction(
                  signedtxn
                ).catch((err) => { console.log(err); });
                // res.send('- Output:', receipt, '\n');
                var adminfee = 0.00002
                var trxbal = trx_wallet - amount
                var trxad = trxbal - adminfee


                userschem.findOneAndUpdate({ trx_account_no: req.body.from_address }, { $set: { trxwallet: trxad } }, (err, data) => {
                  if (data == 0) {
                    res.json({message:err})
                    // res.json({message:'trx balance updated error'})
                  }
                  else {
                    userschem.find({ trx_account_no: req.body.To_address }, { trxwallet: 1 }, (err, data) => {
                      if (data == 0) {
                        res.json({ message: "sendaccount error" })
                      }
                      else {
                        var gettotrxwal = data[0].trxwallet
                        // console.log(gettotrxwal)
                        var gettrxcal = gettotrxwal + amount
    
                        userschem.findOneAndUpdate({ trx_account_no: to_add }, { $set: { trxwallet: gettrxcal } }, (err, data) => {
    
                          if (err) {
                            res.json({message:err})
                            // res.json({message:"transaction update error"})
                          }
                          else {
    
    
                            var trxtrans = new withdraw({
                              // email:emailid,
                              trxfrom_address: from_add,
                              trxto_address: to_add,
                              currency_name: req.body.currency_name,
                              trxsend_amt: amount,
                              // trxid:trxid,
                              trxadminfee: adminfee
    
    
                            })
                            trxtrans.save((err, data) => {
                              if (err) {
                                res.json('Transaction history save error')
                              }
                              else {
                                // res.send('Transaction success')
                                admin.find((err, data) => {
                                  if (data == 0) {
                                    res.json({ message: "admin data error" })
                                  }
                                  else {
                                    var adminwal = data[0].trxwallet
                                    var trxfee = adminwal + adminfee
    
                                    admin.updateOne({ trxwallet: trxfee }, (err, data) => {
    
                                      if (data == 0) {
                                        res.json({message:err})
                                      }
                                      else {
                                        res.json({ message: receipt})
                                      }
    
    
                                    })
    
                                  }
    
                                })
                              }
                            })
                          }
                        })
                      }
                    })
    
                  }
                })
              }
    
              // send_trx();
              send_trx();
    
    
    
            }
    
          })
        }
    
      })

    } 
    else if(kyc =='disapproove')
    {
     res.json({message:'your kyc status not approove so did not continue your  transaction'}) 
    }
  }
})

}

// cryptonewaccount

exports.cryptoaccnew = (req, res) => {
  var account_name = req.body.acc_name
  var emailname = req.body.email
  if (account_name == 'trx') {
    userschem.find({ email: emailname }, { trx_account_no: 1 }, (err, data) => {
      const trxacc = data[0].trx_account_no
      if (trxacc == null) {
        // const ton=[]
        const tronacc = TronWeb.createAccount()
        // ton.push(tron)
        //  console.log(tron)
        // res.send(tronacc)
        console.log(tronacc)
        userschem.findOneAndUpdate({ email: emailname }, { $set: { trx_account_no: tronacc } }, (err, data) => {
          if (data) {
            res.json({message:'trx account created successfully'})
          }
          else {
            res.json({message:'create account error'})
          }
        })
      }
      else {
        res.json({message:'you have already account in trx'})
      }
    })
  }
  else if (account_name == 'eth') {
    userschem.find({ email: emailname }, { eth_account_no: 1 }, (err, data) => {
      const trxacc = data[0].eth_account_no
      if (trxacc == null) {
        const account = web3.eth.accounts.create();
        //   console.log(account)
        const ethaddress = account.address
        const privatekey = account.privateKey
        // console.log(privatekey)

        userschem.findOneAndUpdate({ email: emailname }, { $set: { eth_account_no: ethaddress } }, (err, data) => {
          if (err) {
            res.send('error')
          }
          else {
            res.json({message:'ETH Account Created '+ privatekey})
          }
        })

      }
      else {
        res.json({message:'you have a already account in eth'})
      }
    })
  }
  else if (account_name == 'btc') {
    var holdername = req.body.name
    userschem.find({ email: emailname }, { btc_acc_no: 1 }, (err, data) => {
      const btcacc = data[0].btc_acc_no
      if (btcacc == null) {
        rpcclient = new rpc.Client(btc_config);
        var method = 'getnewaddress';
        rpcclient.call({
          method: method,
          params: [holdername],
          id: '0',
          jsonrpc: '2.0'
        }, (cerr, btc_address) => {
          if (cerr)
            throw cerr
          else {


            var btcadd = btc.result
            // res.send(btcadd)
            const btc = btc_address

          }

          userschem.findOneAndUpdate({ email: emailname }, { $set: { btc_acc_no: btcadd } }, (err, data) => {
            if (data) {

              res.json({message:'account created successfully'})
            }
            else {
              res.json({message:err})
            }
          })

        });

      }
      else {
        res.json({message:'Already you have account in btc'})
      }

    })
  }
  else {
    res.json({message:'only have a eth and trx and btc accounts'})
  }
}



// coin exchange

var fromcoin
var tocoin
var fromaccno
var toaccno
var privateKey
// console.log(privateKey)
var exchangefee
var currentprice1
var cryptoamount
var email
exports.coinex = (req, res) => {
  const exchange1 = req.body.from_currency_name
  const exchange2 = req.body.to_currency_name
   cryptoamount = req.body.cryptoamount
  fromaccno = req.body.fromaccno,
    toaccno = req.body.toaccno,
   privateKey=req.body.privatekey
   email=req.body.email
  pairmanage.find({ from_currency: exchange1, to_currency: exchange2 }, { from_currency: 1, to_currency: 1, exchange_fee: 1 }, (err, data) => {
    if (err) {
      res.send(err)
    }
    else {
      fromcoin = data[0].from_currency
      // console.log(fromcoin)
      tocoin = data[0].to_currency
      // console.log(tocoin)
      if (fromcoin == 'trx' && tocoin == 'btc') {
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

        currentprice.find({ currency_name: exchange1 }, { currency_name: 1, market_price: 1 }, (err, data) => {
          if (err) {
            res.json({message:'error'})
          }
          else {
            var from_name = data[0].currency_name
            var from_price = data[0].market_price
            // console.log(from_name)
            // console.log(from_price)
            currentprice.find ({ currency_name: tocoin }, { currency_name: 1, market_price: 1 }, (err, data) => {
              if (err) {
                res.send('error')
              }
              else {
                var to_name = data[0].currency_name
                var to_price = data[0].market_price
                // console.log(to_name)
                // console.log(to_price)
                var exchange = cryptoamount * from_price
                var calculate = exchange / to_price
                // console.log(calculate)
                // if(to_name == tocoin)
                // {
                userschem.find({ trx_account_no:fromaccno  }, { btcwallet: 1, trxwallet: 1 }, (err, data) => {
                  if (err) {
                    res.json({ message: "error" })
                  }
                  else {


                    async function send_trx() {
    
                      var from_add = fromaccno // Account whose private key is used to initialise Tronweb
                      var to_add = toaccno
                      var amount = cryptoamount; // Value is in Sun : 1 TRX = 10 ** 6 Sun
                      
                      var transaction_object = await tronWeb.transactionBuilder.sendTrx(
                        to_add,
                        amount,
                        from_add
                      ).catch((err) => { console.log(err) });
          
                      const signedtxn = await tronWeb.trx.sign(
                        transaction_object,
                        privateKey
                      ).catch((err) => { console.log(err) });
          
                      const receipt = await tronWeb.trx.sendRawTransaction(
                        signedtxn
                      ).catch((err) => { console.log(err); });
                      console.log('- Output:', receipt, '\n');
                      var trxadminfee = 0.00002
                      // var trxbal = trx_wallet - amount
                      // var trxad = trxbal - adminfee
                    // var pos=data[0].email
                    var btc = data[0].btcwallet
                    // console.log(btc)
                    var trx = data[0].trxwallet
                    var trxadminfee=0.0002
                    var trxfrombal = cryptoamount - trx
                    var trxtotal=trxfrombal-trxadminfee
                    var totalbtc = btc + calculate
                    userschem.findOneAndUpdate({ trx_account_no: fromaccno }, { $set: { btcwallet: totalbtc, trxwallet: trxtotal } }, (err, data) => {
                      if (err) {
                        res.json({message:'Add amount error'})
                      }
                      else {

                        userschem.find({ trx_account_no: toaccno }, { trxwallet: 1, btcwallet: 1 }, (err, data) => {

                          if (err) {
                            res.json({ message: "trx update error" })
                          }
                          else {
                            var trx = data[0].trxwallet
                            var btc = data[0].btcwallet
                            // var to=data[0].email
                            var trxbal = trx + cryptoamount
                            // console.log(trxbal)
                            var btcbal = calculate - btc
                            // console.log(btcbal)
                            userschem.findOneAndUpdate({ trx_account_no: toaccno }, { $set: { trxwallet: trxbal, btcwallet: btcbal } }, (err, data) => {
                              if (err) {
                                res.json({ message: "trx balupdate error" })
                              }
                              else {
                                // res.json({message:"trx updated"})
                                let ex = new coinexchange({
                                  from_currency_name: req.body.from_currency_name,
                                  to_currency_name: req.body.to_currency_name,
                                  cryptoamount: req.body.cryptoamount,
                                  from_accno: req.body.fromaccno ,
                                  to_accno: req.body.toaccno,
                                  exchangefee:req.body.exchangefee,
                                  email:req.body.email
                                })
                                ex.save((err, data) => {

                                  if (err) {
                                    res.json({ message: "save error" })
                                  }
                                  else {
                                    res.json({ message: "exchanged successfully" })
                                  }
                                })



                              }
                            })
                          }
                        })
                      }
                    })

                  }
                  send_trx()
                  }
                })
                // }
                // userschem.findOneAndUpdate({email:postemail},{$set:{}})
              }
            })
          }
        })
      }
      else if (fromcoin == 'eth' && tocoin == 'btc') {


        currentprice.find({ currency_name: exchange1 }, { currency_name: 1, market_price: 1 }, (err, data) => {
          if (err) {
            res.send('error')

          }

          else {

            var from_name = data[0].currency_name
            var from_price = data[0].market_price
            // console.log(from_name)
            // console.log(from_price)


            currentprice.find({ currency_name: tocoin }, { currency_name: 1, market_price: 1 }, (err, data) => {
              if (err) {
                res.send('error')
              }
              else {
                var to_name = data[0].currency_name
                var to_price = data[0].market_price
                console.log(to_name)
                console.log(to_price)
                var exchange = cryptoamount * from_price
                var calculate = exchange / to_price
                // console.log(calculate)
                // if(to_name == tocoin)
                // {
                userschem.find({ eth_account_no: fromaccno }, { btcwallet: 1, ethwallet: 1 }, (err, data) => {
                  if (err) {
                    res.json({ message: "error" })
                  }
                  else {

                  var sendamount = web3.utils.toWei(cryptoamount.toString(), 'ether')

                    async function eth_transaction() {
            
                      var SingedTransaction = await web3.eth.accounts.signTransaction({
                        from: fromaccno,
                        to: toaccno,
                        value: sendamount,
                        gas: 210000
                      }, privateKey);
            
                      web3.eth.sendSignedTransaction(SingedTransaction.rawTransaction).then((receipt) => {
                        console.log(receipt);
                      });
            
                      // var adminfee2 = 0.0001
                      // var pos=data[0].email
                    var btc = data[0].btcwallet
                    var eth = data[0].ethwallet
                    var ethexchangefee=0.0002
                    var ethfrombal = cryptoamount - eth
                    var exchange=ethfrombal-ethexchangefee
                    var totalbtc = btc + calculate
                    userschem.findOneAndUpdate({eth_account_no: fromaccno }, { $set: { btcwallet: totalbtc, ethwallet: exchange } }, (err, data) => {
                      if (err) {
                        res.send('Add amount error')
                      }
                      else {
                        userschem.find({ eth_account_no: toaccno }, { ethwallet: 1, btcwallet: 1 }, (err, data) => {
                          if (err) {
                            res.json({ message: "eth update error" })
                          }
                          else {
                            var eth = data[0].ethwallet
                            var btc = data[0].btcwallet
                            // var to=data[0].email
                            var ethbal = eth + cryptoamount
                            console.log(ethbal)
                            var btcbal = calculate - btc
                            console.log(btcbal)
                            userschem.findOneAndUpdate({ eth_account_no: toaccno }, { $set: { ethwallet: ethbal, btcwallet: btcbal } }, (err, data) => {
                              if (err) {
                                res.json({ message: "eth balupdate error" })
                              }
                              else {
                                let ex = new coinexchange({
                                  from_currency_name: req.body.from_currency_name,
                                  to_currency_name: req.body.to_currency_name,
                                  cryptoamount: req.body.cryptoamount,
                                  from_accno: req.body.fromaccno,
                                  to_accno: req.body.toaccno,
                                  exchangefee:ethexchangefee,
                                  email:email
                                })
                                ex.save((err, data) => {

                                  if (err) {
                                    res.json({ message: "save error" })
                                  }
                                  else {
                                    res.json({ message: "exchanged successfully" })
                                  }
                                })
                               
                               
                               
                               
                                // res.json({ message: "eth exchange success" })
                              }
                            })
                          }
                        })

                      }
                    })
                  }
                  eth_transaction()
                  }
                })
                
              }
            })
          }

        })

      }
      else {
        res.json({ message: "pair doesnot match" })
      }
    }
  })

}

// withdraw fiat

var withdrawemail
var amount
var fiataccount
var fiataccno
exports.withdraw = (req, res) => {

  withdrawemail = req.body.email
  amount = req.body.amount
fiataccno=req.body.fiataccno

  userschem.find({ email: withdrawemail }, {email:1,fiatamt: 1, kyc_status: 1, tfa_status: 1,fiataccno:1 }, (err, data) => {
    if (data == 0) {
      res.json({ message:'email id error'})
    }
    else {
      var checkemail = data[0].email
      // console.log(checkemail)
      if (checkemail == withdrawemail) {
        var fiatamt = data[0].fiatamt
        // console.log(fiatamt)
        var kyc = data[0].kyc_status
        var tfa = data[0].tfa_status
        fiataccount=data[0].fiataccno
        // console.log(fiataccount)
if(fiataccno == fiataccount){
        if (kyc == 'approove' && tfa == '1') {

          var fiatbal = fiatamt - amount

          userschem.findOneAndUpdate({ email: withdrawemail }, { $set: { fiatamt: fiatbal } }, (err, data) => {

            if (err) {
              res.json({ message: 'withdraw failed' })
            }
            else {
              var hist = new fiatwithdraw({
                email: withdrawemail,
                withdraw_fiat: amount,
                fiatbalance: fiatbal,
                fiataccno:fiataccount

              })
              hist.save((err, data) => {
                if (err) {
                  res.json({ message: 'withdraw save error' })
                }
                else {
                  res.json({ message:'withdraw success' })
                }

              })



            }
          })


        }
        else {
          res.json({ message: 'kyc_status and tfa status not approove' })
        }
      }
      else{
        res.json({message:'accno error'})
      }
      }
      else {
        res.json({ message: "please check your email-Id" })
      }

    }

  })
}

// Fiat to crypto exchange
exports.fiatexchange=(req,resp)=>{
  var sendfiat=req.body.amount;
  var currency_name=req.body.currency_name;
  var email=req.body.email;
  var adminfee=0.0001
  
  userschem.find({email:email},(err,data)=>{
    if(data==0){
      resp.json({Message:"Invalid Email"})
    }
    else{
    
      var dbfiat=data[0].fiatamt
      var fiatcal=dbfiat-sendfiat
      var balfiat=fiatcal-adminfee
    userschem.findOneAndUpdate({email:email},{$set:{fiatamt:balfiat}},(err,data)=>{
  if(data==0)
  
  {
    resp.json({message:'user email error'})
  }
  else{
    // res.json({message:data})
    if(currency_name == 'btc')
  {
   market.find({currency_name:currency_name},(err,data)=>{
     var currentprice=data[0].market_price
     if(data==0)
     {
  resp.json({message:'error'})
     }
     else{
       var cryptocurreny=sendfiat/currentprice
       
       userschem.find({email:req.body.email},(err,data)=>{
if(data)
{
  var toadd=data[0].btc_acc_no
       var address = toadd
        var amount = cryptocurreny
        // var currency=req.body.currency_name
        // var adminfee=0.0002
      userschem.find({email:req.body.email},(err,data)=>{
        if(data ==0){
          resp.json({message:"email error"})
        }
        else{
      var btcstatus=data[0].kyc_status
      var btcwal=data[0].btcwallet
      if(btcstatus == 'approove')
      {  
      bitcoin_rpc.init(btc_config.host, btc_config.port, btc_config.user, btc_config.password)
      bitcoin_rpc.call('getbalance', [], (err, res) => {
          if (err !== null) {
            resp.json({message:err});
      
          } else if (res.result > amount) {
            bitcoin_rpc.call('sendtoaddress', [address, amount], (err, res1) => {
              if (err !== null) {
                throw (err);
              } else if (res1.error && res1.error.message) {
                resp.json({
                  message: res1.error.message,
                  error: 'OK'
                });
              } else if (res1.result) {
                resp.json({
                  txid: res1.result,
                  success: 'OK'
                });
      var btcbal=btcwal+amount
      userschem.findOneAndUpdate({email:req.body.email},{$set:{btcwallet:btcbal}},(err,data)=>{
      if(data == 0)
      {
        resp.json({message:'data error'})
      }
      else {
        
      console.log('saved')
   
      }
      })
      }
            });
          
          } else {
            // console.log({
            //   message: 'No amount in wallet',
            //   error: 'OK'
            // });
            resp.json({message:"no amount in wallet"})
          }
        });
      }
      else if(btcstatus =='disapproove')
      {
      resp.json({message:"kyc not approove so did not continue your transaction"})
      }
      else{
        resp.json({message:'kyc status data error'})
      }
      }
      })
    }
       })
}
   }) 
  }
  else{
  console.log('error')
}

}
    })
  
    }
  })
    }



// fiat to eth
var PrivateKey1
exports.fiattoeth=(req,res)=>{
    var coin=req.body.coin_value;
    var currency_name=req.body.currency_name;
    var From_email=req.body.From_email;
    var To_email=req.body.To_email
    // var adminfee=0.0001
    
    adminschem.find({email:From_email},(err,data)=>{
      if(data==0){
        res.json({Message:"Invalid Email"})
      }
      else{
        var dbethval=data[0].ethwallet
        
        var dbtrxval=data[0].trxwallet
// console.log(dbtrxval)
        var admintrxacc=data[0].trx_acc_no
// console.log(admintrxacc)
        var adminethacc=data[0].eth_acc_no
       if(currency_name == 'eth')
      {
        market.find({currency_name:currency_name},(err,data)=>{
if(data == 0)
{
  res.json({message:'market_price error'})
}
else{
var ethcurrentprice=data[0].market_price
  userschem.find({email:To_email},(err,data)=>{
    if(err)
    {
      res.json({message:"user data error"})
    }
    else{
    var useraddress=data[0].eth_account_no
    var userfiat=data[0].fiatamt
   
    var fiatvalue=coin*ethcurrentprice
    // console.log(fiatvalue)
   
if(userfiat >fiatvalue)
{
    var usercoin=data[0].ethwallet
    // admin private key
      var Private_Key = req.body.Private_Key
      var from_add = adminethacc;
      var to_address =useraddress;
      // var curval = req.body.value
      // var currency=req.body.currency_name     
var toeth=web3.utils.toWei(coin.toString(),'ether')
async function eth_transaction() {
     var SingedTransaction = await web3.eth.accounts.signTransaction({
      from: from_add,
      to: to_address,
      value: toeth,
      gas: 210000
    },Private_Key );

    var upcoin=usercoin+toeth
    var upfiat=userfiat-fiatvalue
 
    web3.eth.sendSignedTransaction(SingedTransaction.rawTransaction).then((receipt) => {
      // res.json({message:receipt});
     
userschem.findOneAndUpdate({email:To_email},{$set:{fiatamt:upfiat,ethwallet:upcoin}},(err,data)=>{
if(err)
{
  res.json({message:'fiat updation error'})
}
else{
 var ethcal=dbethval-coin
    adminschem.findOneAndUpdate({email:From_email},{$set:{ethwallet:ethcal}},(err,data)=>{
  if(data==0)
  {
    res.json({message:'user email error'})
  }
  else{
 // res.json({message:'Coin  Received'})
  var withhistory= fiatwithdraw({
    from_email:From_email,
    to_email:To_email,
    currency_name:currency_name,
    deposit_eth:coin,
    ethwallet:upcoin,
    fiatbalance:upfiat,
    withdraw_fiat:fiatvalue
})
withhistory.save((err,data)=>{
  if(err)
  {
    throw err
  }
  else{
    res.json({message:receipt})
  }
})

}
})
}


})

    });
    }
    eth_transaction()
  }
  else
  {
    res.json({message:'currencyvalue not enough your buying coin'})
  }
    }
    
    })
}
})
  }
      else if(currency_name == 'trx')
      {
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, PrivateKey1);

      
        market.find({currency_name:currency_name},(err,data)=>{
          if(data == 0)
          {
            res.json({message:'market_price error'})
          }
          else{
          
          var trxcurrentprice=data[0].market_price
            userschem.find({email:To_email},(err,data)=>{
              if(err)
              {
                res.json({message:"user data error"})
              }
              else{
                var userfiat=data[0].fiatamt
                var usercoin=data[0].trxwallet
              var usertrxaddress=data[0].trx_account_no
              var fiatvalue=coin*trxcurrentprice

              if(userfiat>fiatvalue)
{

              async function send_trx() {
    
                var from_add = admintrxacc // Account whose private key is used to initialise Tronweb
                var to_add = usertrxaddress
                var amount = coin; // Value is in Sun : 1 TRX = 10 ** 6 Sun
              var PrivateKey1=req.body.Private_Key
                var transaction_object = await tronWeb.transactionBuilder.sendTrx(
                  to_add,
                  amount,
                  from_add
                ).catch((err) => { console.log(err) });
      
                const signedtxn = await tronWeb.trx.sign(
                  transaction_object,
                  PrivateKey1
                ).catch((err) => { console.log(err) });
      
                const receipt = await tronWeb.trx.sendRawTransaction(
                  signedtxn
                ).catch((err) => { console.log(err); });
                // console.log('- Output:', receipt, '\n');
                var upcoin=usercoin+coin
              
                var upfiat=userfiat-fiatvalue
          
          userschem.findOneAndUpdate({email:To_email},{$set:{fiatamt:upfiat,trxwallet:upcoin}},(err,data)=>{
          
          if(err)
          {
            res.json({message:'fiat updation error'})
          }
          else{

            var trxval=dbtrxval-coin

            adminschem.findOneAndUpdate({email:From_email},{$set:{trxwallet:trxval}},(err,data)=>{
              if(data==0)
              {
                res.json({message:'user email error'})
              }
              else{
        
            var withhistory= fiatwithdraw({
              from_email:From_email,
              to_email:To_email,
              currency_name:currency_name,
              deposit_trx:coin,
              trxwallet:upcoin,
              fiatbalance:upfiat,
              withdraw_trx:fiatvalue
          })
          withhistory.save((err,data)=>{
            if(err)
            {
              throw err
            }
            else
            {
            res.json({message:receipt})
            }
          })
              }
            })
          }
          
          
          })
                }

                send_trx()

              }
              else{
                res.json({message:'yout fiat currency not enough for your buying coin'})
              }
              }
            })
              }
            })
   }
      else{
        res.json({message:'currencyname error'})
      }
 
      }
    })
    
  }