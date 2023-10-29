const usersData = require('./Models/usersSchema')
const bcrypt = require("bcrypt");


const jwt = require("jsonwebtoken");

const getUsers = async (req, res)=>{
  const Q = await usersData.find();
  res.status(200).send(Q)
}

exports.getUsers = getUsers

// @User registration
// @values Validation 
const inputValuesValidation = (request,response,next) =>{
  const { username, name, password , email } = request.body; 
  
  if (!username || !name || !password || !email ){
      response.status(400).send({errMsg:"All Fields are mandatory"})
  }else{
    next()
  }
}  

// @PasswordValidation 

const PasswordValidation =(request, response, next)=>{
  const { password} = request.body 

  if (password.length < 8 ){
    
  response.status(400).send({
      errMsg: 'Password should have minimum 8 characters'
    })
    
  } else{
    next();
  }
} 
      
      
// @MailValidation

const MailValidation = async (request,response,next)=>{ 

  const {email} = request.body;

  const isAnyObjectWithThisMail = await usersData.findOne({email})

  if ( !isAnyObjectWithThisMail ){
    
    next()
    
  }else{
    
    response.status(400).send(
    {
    errMsg:'email already exists'
    })

  }

}

const registeringUser = async(req,res)=>{

  const {name,username,password,email} = req.body 
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const checkUsername = await usersData.findOne({username}) 
  
  if (!checkUsername){

    const Q = await usersData.create({
      name,
      username,
      password:hashedPassword,
      email
    })

    res.status(201).send(Q)
    
  }else{
    
    res.status(400).send({errMsg:'Username already exists'})

  }
}

const getUser =  async (req,res) =>{
    
  const {id} = req.params 
  
  try {
    
    const isUserWithID = await usersData.findById(id) 

    if(!isUserWithID){
      
      res.status(404).send({errMsg:"USER Not Found"})
      
    }
    else{

      res.status(200).send(isUserWithID)

    }
  }
  catch (error) {
    
    res.status(404).send({
      errMsg:`${error}`
    })
  }
} 

const deleteUser = async ( req , res ) => {
  const {id} = req.params
  try {
    const searchIdToDel = await usersData.findByIdAndDelete(id)  
    if (!searchIdToDel){
      res.status(404).send({
        errMsg:"No User"
      })
    }else{
      res.status(200).send(searchIdToDel)
    }
  } catch (error) {
    res.status(400).send(error)
  }
}

const loginUser =async (request, response) => {
  const { username, password } = request.body;
  try {
    
  const dbUser = await usersData.findOne( {username} )
  if (dbUser === null) {
    response.status(400);
    response.send({errMsg:"Invalid User"});
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password); 
    if (isPasswordMatched ) {
      const payload = {
      username,
      }
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN"); 

      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }} catch (error) {
    response.status(400).send({errMsg:error})
  }
}


exports.registeringUser = registeringUser
exports.MailValidation = MailValidation
exports.inputValuesValidation = inputValuesValidation
exports.PasswordValidation = PasswordValidation
exports.getUser = getUser
exports.deleteUser = deleteUser
exports.loginUser = loginUser