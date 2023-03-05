const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const checkUser = require("./middleware/checkUser");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://king:king@node-jwt-cluster.1raq8.mongodb.net/nodejwtDB";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(3000);
    console.log("Database Connect Successfully");
  })
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser); //this middleware applies to all the routes. this "*" used when to access all routes
app.get("/", authMiddleware, (req, res) => res.render("home"));
app.get("/animes", authMiddleware, (req, res) => res.render("animes"));

//working with cookies with traditional method and with cookie-parser
// app.get('/set-cookies', (req, res)=>{
//   // res.setHeader('Set-Cookie','newUser = true')
//   res.cookie('newUser', false); // syntax = res.cookie("name-of-the-cookie", value-of-the-cookie)
//   res.cookie('isKing', true ,{ maxAge: 1000 * 60 * 60 * 24,httpOnly: true });
//   res.send("you got the cookies ")
// })
// app.get('/read-cookies',(req, res)=>{
//   const cookies = req.cookies;
//   console.log(cookies.isKing);
//   console.log(cookies.newUser);

//   res.json(cookies)
// })

//here we are including the all the routes in authRoutes here
app.use(authRoutes);
