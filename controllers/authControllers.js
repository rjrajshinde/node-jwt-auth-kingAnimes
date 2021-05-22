const User = require("../model/userModel");
const jwt = require('jsonwebtoken');
const { create } = require("../model/userModel");

// function for handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  //login error handlers
  if (err.message === "Invalid Credentials"){
    errors.mess = "Invalid Credentials"
  }

  // validation errors
  if (err.message.includes('users validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

//function for create json web tokens
const maxAge = 3 * 24 * 60 * 60;//expires in 3 days
const createTokens = (id) =>{
  return jwt.sign({id},'this is kings secret', {
    expiresIn: maxAge
  });
}

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    //save data in db
    const user = await User.create({ email, password });
    //create a jwt token 
    const token = createTokens(user._id)
    //send this token with the help of cookie to browser
    res.cookie("jwt",token,{httpOnly: true, maxAge: maxAge * 1000})//this maxAge property of cookie only take input in seconds that's why we have to multiply by 1000 
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createTokens(user._id)//create a jwt token 
    //send this token with the help of cookie to browser
    res.cookie("jwt",token,{httpOnly: true, maxAge: maxAge * 1000})//this maxAge property of cookie only take input in seconds that's why we have to multiply by 1000 
    res.status(200).json({user: user._id})
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors })
  }
}

//if we want to logout from the website then we have to delete the cookie name jwt that contains the jsonwebtoken
// that contains the login information 
// but we can't delete the cookie through routes we can only delete this cookie manually
// so here we are replacing this cookie with empty string so its don't have the token with login info
// then it can't login or access the another pages.
module.exports.logout = async(req, res)=>{
  res.cookie('jwt',"",{maxAge: 1}) //here we defined the age of the cookie is 1 milisecond so 
  res.redirect('/'); 
}