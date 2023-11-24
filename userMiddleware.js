const usersData = require("./Models/usersSchema");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { ObjectId } = require("mongodb");

const getUsers = async (req, res) => {
  const Q = await usersData.find();
  res.status(200).send(Q);
};

exports.getUsers = getUsers;

// @User registration
// @values Validation
const inputValuesValidation = (request, response, next) => {
  const { username, name, password, email } = request.body;

  if (!username || !name || !password || !email) {
    response.status(400).send({ errMsg: "All Fields are mandatory" });
  } else {
    next();
  }
};

const valuesValidation = async (request, response, next) => {
  const { email, username, password } = request.body;

  const ValidationErrors = {};

  const isAnyObjectWithThisMail = await usersData.findOne({ email });
  const checkUsername = await usersData.findOne({ username });
  const isPasswordLT8 = password.length < 8;
  const isPasswordGT16 = password.length > 16;

  if (!!isAnyObjectWithThisMail)
    ValidationErrors.mailError = "user already exist with this email";
  if (!!checkUsername)
    ValidationErrors.usernameError = "this username already exists";
  if (isPasswordLT8)
    ValidationErrors.passwordError =
      "Password should have minimum 8 characters";
  if (isPasswordGT16)
    ValidationErrors.passwordError = "max 16 characters are allowed";

  if (
    !isAnyObjectWithThisMail &&
    !checkUsername &&
    !isPasswordLT8 &&
    !isPasswordGT16
  ) {
    next();
  } else {
    response.status(400).send(ValidationErrors);
  }
};

const registeringUser = async (req, res) => {
  const { name, username, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const checkUsername = await usersData.findOne({ username });

  if (!checkUsername) {
    const Q = await usersData.create({
      name,
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).send(Q);
  } else {
    res.status(400).send({
      errMsg: "Username already exists",
    });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const isUserWithID = await usersData.findById(id);

    if (!isUserWithID) {
      res.status(404).send({ errMsg: "USER Not Found" });
    } else {
      res.status(200).send(isUserWithID);
    }
  } catch (error) {
    res.status(404).send({
      errMsg: `${error}`,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const searchIdToDel = await usersData.findByIdAndDelete(id);
    if (!searchIdToDel) {
      res.status(404).send({
        errMsg: "No User",
      });
    } else {
      res.status(200).send(searchIdToDel);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const loginUser = async (request, response) => {
  const { username, password } = request.body;

  try {
    const dbUser = await usersData.findOne({ username });
    if (!dbUser) {
      response.status(400).send({ errMsg: "Invalid Username or password" });
    } else {
      const { id, name, email } = dbUser;
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched) {
        const payload = {
          username,
          id,
          name,
          email,
        };
        const jwtToken = jwt.sign(payload, process.env.MY_SECRET_TOKEN);

        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Username or Password");
      }
    }
  } catch (error) {
    response.status(400).send(error);
  }
};

exports.registeringUser = registeringUser;
exports.valuesValidation = valuesValidation;
exports.inputValuesValidation = inputValuesValidation;

exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
