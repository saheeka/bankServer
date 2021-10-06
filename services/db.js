//import mongoose
const mongoose=require('mongoose')

//connect server to db
mongoose.connect('mongodb://localhost:27017/bankApp',{
    useNewUrlParser:true
})

//model creation
const User= mongoose.model('User',{
    pname:String,
    account_number:Number,
    balance:Number,
    password:String,
    transaction:[]

})
module.exports={
User
}