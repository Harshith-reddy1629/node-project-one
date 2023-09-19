const express = require("express");

const cors = require("cors");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const dotenv = require("dotenv").config();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const databasePath = path.join(__dirname, "sample.db");

const mongoose = require("mongoose"); 
const { ObjectId } = require("mongodb");



const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8001;


const mongoConnectionDb = async ()=>{
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING) ;
    console.log("database",connect.connections.name)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}


mongoConnectionDb();

const usersSchema = mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please add the name"],
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

let database = null;
const initializeDbAndServer = async () => {
    try {
      database = await open({
        filename: databasePath,
  
        driver: sqlite3.Database,
      });
  
      app.listen(PORT, () =>
        console.log(`Server Running at http://localhost:${PORT}/`)
      );
    } catch (error) {
      console.log(`DB Error: ${error.message}`);
      process.exit(1);
    }
  };
  
  initializeDbAndServer();  

// @User registration

// @values Validation 
const inputValuesValidation = (request,response,next) =>{
  const { username, name, password ,email } = request.body; 

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
    
    // console.log(!isAnyObjectWithThisMail)

    if ( !isAnyObjectWithThisMail ){

      next()

    }else{

      response.status(400).send(
        {
          errMsg:'email already exists'
        }
      )

    }

  }

  app.get('/register/',async (req, res)=>{
    const Q = await usersData.find();
    res.status(200).send(Q)
  })
  
  app.post('/register/',inputValuesValidation,PasswordValidation,MailValidation,async(req,res)=>{

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

      res.status(400).send(checkUsername)

    }
  })

  app.get('/register/:id/' , async (req,res) =>{

    const {id} = req.params 

    try {
      
      const Q = await usersData.findById(id) 

      if(!Q){

        res.status(404).send({errMsg:"USER Not Found"})

      }
      else{

        res.status(200).send(Q)

      }
    }
    catch (error) {
     
      res.status(404).send({
      errMsg:`${error}`
     })
    }
  } )

  app.delete('/register/:id', async ( req , res ) => {
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
  } )

  app.post("/login/", async (request, response) => {
    const { username, password } = request.body;
    try {
      
    
    const dbUser = await usersData.findOne( {username} )
   
    if (dbUser === undefined) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }} catch (error) {
      response.status(400).send({errMsg:error})
    }
  });