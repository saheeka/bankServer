
//import express
const express=require('express')

const session=require('express-session')

const dataService = require('./services/data.service')

//create app using express
const app=express()

//to parse json
app.use(express.json())

//
const jwt=require('jsonwebtoken')

//
const cors=require('cors')

//allow resource sharing using cors
app.use(cors({
    origin:'http://localhost:4200',
    Credentials:true
}))


//to generate session
// app.use(session({
//     secret:'randomsecretkey',
//     resave:false,
//     SaveUninitialized:false
// }))

//middleware creation- application specific
app.use((req,res,next)=>{
console.log("middleware");
next()
})


//middleware - router specific
const authMiddleware=(req,res,next)=>{
    if(!req.session.currentNo){
        return res.json ({
          statusCode:401,
               status:false,
             message:"pls login....!!"
        })
      }
      else{
          next()
      }
}

//token validation middleware
 const jwtMiddleware=(req,res,next)=>{
    try{
      // console.log(token);

     //const token=req.body.token
     const token=req.headers['x-access-token']
     const data= jwt.verify(token,'supersecretkey123123')
     req.currentAcc=data.currentNo
   next()
    }
    catch{
        const result=({
            statusCode:401,
               status:false,
             message:"pls login....!!"
        })
        res.status(result.statusCode).json(result)
   }
}

//jwt testin api
app.post('/token',jwtMiddleware,(req,res)=>{
    res.send("current account : "+req.currentAcc)
})


//Resolving HTTP method
app.get('/',(req,res)=>{
    res.status(401).send("GET METHOD  read!!!!")
})

app.post('/',(req,res)=>{
    res.send("POST METHOD create!!!!")
})

app.put('/',(req,res)=>{
    res.send("PUT METHOD update/modify..!!!!")
})

app.patch('/',(req,res)=>{
    res.send("PATCH METHOD partially update/modify...!!!!")
})

app.delete('/',(req,res)=>{
    res.send("DELETE METHOD delete!!!!")
})


//backapp resolving

//register api
app.post('/register',(req,res)=>{
    console.log(req.body)
   dataService.register(req.body.account_number,req.body.pname,req.body.password)
   .then(result=>{
    res.status(result.statusCode).json(result)
   })
        //    res.send("post method")
  //res.send(result.message)
   // res.status(result.statusCode).json(result)
   //res.status(200).send("success!!!")
   
})

//login api
app.post('/login',(req,res)=>{
    dataService.login(req.body.account_number,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result) 
    })
    //res.send("login")
    //res.send(result.message)
    //res.status(result.statusCode).json(result)
    
})

// //deposit
app.post('/deposit', jwtMiddleware,(req,res)=>{
    // console.log(req.session.currentNo)
    dataService.deposit(req.body.account_number,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

// //withdraw
app.post('/withdraw', jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.account_number,req.body.password,req.body.amount)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})
//transaction
app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataService.getTransaction(req.body.account_number).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})

//delete account api
app.delete('/deleteAcc/:account_number',jwtMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.account_number).then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})
// to set port
app.listen(3000,()=>{
console.log("server started at the port");
})


// console.log("server started");