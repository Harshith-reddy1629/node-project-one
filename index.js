const express = require("express");

const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const mongoConnectionDb = require('./MongoConnection/mongoConnectionDb')

const dotenv = require("dotenv").config();

const {inputValuesValidation,
  PasswordValidation,
  MailValidation,
  getUsers, 
  registeringUser, 
  getUser, 
  deleteUser, 
  loginUser,
  valuesValidation} = require('./userMiddleware');

const { getTodos, createTask, deleteTask, getTodoTasks } = require("./todomidleware");

const tokenValidators = require("./Validators/tokenValidators");

mongoConnectionDb();

const PORT = process.env.PORT || 8001;

app.listen(PORT, () =>
console.log(`Server Running at http://localhost:${PORT}/`)
);
 
  app.get('/register/', getUsers)

  app.post('/register/', inputValuesValidation,valuesValidation, registeringUser)
  
  app.get('/register/:id/' , getUser)
  
  app.delete('/register/:id', deleteUser )
  
  app.post("/login/", loginUser);
  
  app.get('/todos/', tokenValidators ,getTodos).post('/todo/',tokenValidators,createTask)
  app.get('/todo/', tokenValidators ,getTodoTasks)
  app.delete('/todo/:id',tokenValidators,deleteTask)