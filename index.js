const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const mongoConnectionDb = require('./MongoConnection/mongoConnectionDb')

const usersData = require('./Models/usersSchema')
const todoData = require('./Models/todoSchema')

const dotenv = require("dotenv").config();

const bcrypt = require("bcrypt");

const {inputValuesValidation,
  PasswordValidation ,
  MailValidation,
  getUsers, 
  registeringUser, 
  getUser, 
  deleteUser, 
  loginUser} = require('./userMiddleware');

const { getTodos } = require("./todomidleware");

mongoConnectionDb();

const PORT = process.env.PORT || 8001;
app.listen(PORT, () =>
console.log(`Server Running at http://localhost:${PORT}/`)
);


  app.get('/register/', getUsers)

  app.get('/todo/',getTodos)
  
  app.post('/register/', inputValuesValidation, MailValidation, PasswordValidation, registeringUser)

  app.get('/register/:id/' , getUser)

  app.delete('/register/:id', deleteUser )

  app.post("/login/", loginUser);
