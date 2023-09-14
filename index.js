const express = require("express");

const cors = require("cors");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const databasePath = path.join(__dirname, "sample.db");

const app = express();

app.use(cors());

app.use(express.json());

const PORT = process.env.PORT || 8001;

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

    const selectUserQuery = `SELECT * FROM users WHERE email = '${email}'`;

    const dbUser = await database.get(selectUserQuery);

    if (dbUser === undefined){

      next()

    }else{
      response.status(400).send(
        {
          errMsg:'email already exists'
        }
      )
    }

  }

// @user Post METHOD
  app.post("/users/", PasswordValidation , MailValidation , async (request, response) => {

    const { username, name, password ,email } = request.body; 

    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const selectUserQuery = `SELECT * FROM users WHERE username = '${username}'`;
    const dbUser = await database.get(selectUserQuery);
    if (dbUser === undefined) {
      const createUserQuery = `
        INSERT INTO 
          users (username, name, password, email) 
        VALUES 
          (
            '${username}', 
            '${name}',
            '${hashedPassword}', 
            '${email}'
          )`;
      const dbResponse = await database.run(createUserQuery);
      const newUserId = dbResponse.lastID;
      response.send(dbResponse);
    } else {
      response.status(400).send({errMsg:"User already exists with this username"});
    }
  });


// @user delete

// @user delete method
app.delete( "/users/:id/" , async (request,response) =>{ 

  const { id } = request.params

const Q = `
DELETE FROM
users
WHERE
id =${id};`; 

await database.run(Q) 

response.send('done')
 
} )

// PROJECTS DB

// @project post method
// Only Admin
app.post('/projects/onlyadmin/canpost/' , async ( req , res ) =>{  

const {projectImg,projectName,description,projectLink} =  req.body  

const QueryToRun = `INSERT INTO 
projects_table ( projectImg ,projectName,description,projectLink )
VALUES (
'${projectImg}',
'${projectName}',
'${description}',
 '${projectLink}'
);`;

const runQ = await database.run( QueryToRun)

res.send({ Message:'Added'} )

} ) 


// @projects get method
app.get('/projects/', async (req,res)=>{
  const QueryToRun = `
  SELECT * FROM projects_table;
  `
  const runQ = await database.all(QueryToRun) 

  res.send( runQ )
})