const express=require('express')
const app=express()
const bodyparser=require('body-parser')
app.use(bodyparser.json())

//adminapi
app.set('view engine', 'ejs');


const adminapi=require('./routers/adminrout')

const userapi=require('./routers/userroute')


//  admin
app.use('/admin',adminapi)



// user api
app.use('/user',userapi)




app.post('/port',(req,res)=>{



res.send('port running successfully')
    
})
app.listen(1109)