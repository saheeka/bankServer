
//import jwt

const jwt = require('jsonwebtoken')


const db = require('./db')

let user = {
  1000: { pname: "ram", account_number: 1000, balance: 2000, password: "userone", transaction: [] },
  1001: { pname: "ram pj", account_number: 1001, balance: 5000, password: "usertwo", transaction: [] }
}

const register = (account_number, pname, password) => {
  return db.User.findOne({ account_number }).then(user => {
    console.log(user);
    if (user) {
      return {
        statusCode: 422,
        status: false,
        message: "user already exist ! please login"
      }
    }
    else {
      const newUser = new db.User({
        pname,
        account_number,
        balance:0,
        password,
        transaction: []
      })
      newUser.save()
      return {
        statusCode: 200,
        status: true,
        message: "successfully registered..."
      }
    }
  })
  // if(account_number in user)
  // {
  //     return{
  //         statusCode:422,
  //         status: false,
  //         message:"user already exist ! please login"
  //     }
  // }

  // else {
  //   user[account_number] = {
  //     pname,
  //     account_number,
  //     balance:0,
  //     password,
  //     transaction:[]
  //   }
  //   console.log(user);

  //   return {
  //       statusCode:200,
  //         status:true,
  //         message:"successfully registered..."
  //   }
  // }
}

//login

const login = (account_number, password) => {
  return db.User.findOne({ account_number, password })
    .then(user => {
      if (user) {
        const token = jwt.sign({
          currentNo: account_number
        }, 'supersecretkey123123')

        return {
          statusCode: 200,
          status: true,
          message: "succesfully logged in..",
          token,
          currentUser:user.pname,
          
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "invalid user or password"
        }
      }
    })
  //   if (account_number in user) {
  //     if (password == user[account_number]["password"]) {
  //       currentUser=user[account_number]["pname"]
  //       acc_num=account_number
  //       req.session.currentNo=user[account_number]

  //       //token generation
  //       const token=jwt.sign({
  //         currentNo:account_number
  //       }, 'supersecretkey123123')

  //       return {
  //           statusCode:200,
  //           status:true,
  //           message:"succesfully logged in..",
  //           token
  //       }

  //     }
  //     else {
  //       return{
  //           statusCode:422,
  //           status:false,
  //           message:"invalid password"
  //       }
  //     }
  //   }
  //   else {
  //    return{
  //       statusCode:422,
  //       status:false,
  //       message:"invalid user.."
  //    }
  //   }
}
//deposit


const deposit = (account_number, password, amount) => {
  var amt = parseInt(amount)
  return db.User.findOne({ account_number, password }).then(user => {
    console.log(user)
    if (!user) {
      return {
        statusCode: 422,
        status: false,
        message: "invalid password"
      }
    }
else{
    user.balance += amt
    user.transaction.push({
      amount: amt,
      type: "CREDIT"
    })
    user.save()
    return {
      statusCode: 200,
      status: true,
      message: amt + "Deposited successfully & new balancd is " + user.balance
    }
  }  
  })
  //    if (account_number in user) {
  //      if (password == user[account_number]["password"]) {
  //        user[account_number]["balance"] += amt
  //        user[account_number]["transaction"].push({
  //          amount:amt,
  //          type:"CREDIT"
  //        })
  //         return {
  //            statusCode:200,
  //            status:true,
  //            message:amt+"Deposited successfully & new balancd is "+user[account_number]["balance"]
  //        }
  //      }
  //      else {
  //        return{
  //             statusCode:422,
  //              status:false,
  //            message:"invalid password"
  //        }
  //      }
  //    }

  //    else {
  //     return{
  //        statusCode:422,
  //         status:false,
  //         message:"invalid user"
  //     }

  //    }
}


//  //withdraw
const withdraw = (req,account_number, password, amount) => {
  var amt = parseInt(amount)
  return db.User.findOne({ account_number, password }).then(user => {
    if (!user) {
      return {
        statusCode: 422,
        status: false,
        message: "invalid credentials"
      }
    }
    if(req.currentAcc != user.account_number){
      return {
        statusCode: 422,
        status: false,
        message: "operation denied"
      }
    }
    if (user.balance < amt) {
      return {
        statusCode: 422,
        status: false,
        message: "insufficient balance"
      }

    }
    else{
    user.balance -= amt


    user.transaction.push({
      amount: amt,
      type: "DEBIT"
    })
    user.save()
    return {
      statusCode: 200,
      status: true,
      message: amt + "Debited successfully & new balancd is " + user.balance
    }
  }
  })
}

// if (account_number in user) {
//   if (password == user[account_number]["password"]) {
//     if (user[account_number]["balance"] > amt) {
//       user[account_number]["balance"] -= amt
//       user[account_number]["transaction"].push({
//         amount:amt,
//         type:"DEBIT"
//       })
//       return{
//          statusCode:200,
//           status:true,
//           message:amt+" debited and new balance is"+user[account_number]["balance"] 
//       }
//     }
//     else {
//      return{
//          statusCode:422,
//          status:false,
//          message:"invalid password"
//      }
//     }
//   }
//   else {
//    return{
//        statusCode:422,
//        status:false,
//        message:"invalid user"
//    }
//   }
// }
//}



//transaction
const getTransaction = (account_number) => {
  return db.User.findOne({ account_number}).then(user => {
    console.log(user)
    if(user)
    {
      
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
    else {
      return {
        statusCode: 422,
        status: false,
        message: "invalid user"
      }
    }

  })
}
//   if (account_number in user) {
//     return {
//       statusCode: 200,
//       status: true,
//       transaction: user[account_number].transaction
//     }
//   }
//   else {
//     return {
//       statusCode: 422,
//       status: false,
//       message: "invalid user"
//     }
//   }
// }


//delete account
const deleteAcc=(account_number)=>{
  return db.User.deleteOne({account_number})
  .then(user=>{
    if(user){
      return {
              statusCode: 200,
              status: true,
              message:"Account number deleted successfully"
            }
          }
          else {
            return {
              statusCode: 422,
              status: false,
              message: "invalid operation"
            }
          }
  })
}
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc

}