const mongoose = require("mongoose"); 

const usersSchema = mongoose.Schema({
    name:{
      type:String,
      required:[true,"Please add the Name"],
    },
    email:{
      type:String,
      required:[true,"Please add the email address"]
    },
    username:{
      type:String,
      required:[true,"Please add the username"]
    },
    password:{
      type:String,
      required:[true,"Please add the password"]
    },
  
  },{
    timestamps: true,
  })
  
  const usersData = mongoose.model("users",usersSchema)

  
  module.exports = usersData