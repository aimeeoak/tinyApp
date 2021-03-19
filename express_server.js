const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const PORT =8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "WyattEarp": {
    id: "WyattEarp", 
    email: "w.earp@usmarshals.gov", 
    password: "Josephine"
  },
 "DocHolliday": {
    id: "DocHolliday", 
    email: "thedentist@pokerstars.com", 
    password: "imurhuckleberry"
  }
};

// const addUserToDB = (email, password, user_id, db) => {
//   db[user_id] = {
//     id: user_id, email, password
//   };
// };

// const generateRandomString = function() {
//   const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   let string = '';
//   while (string.length !== 6) {
//     string += chars[Math.floor(Math.random() * chars.length)];
//   }
// }

const findUserByEmail = (email) => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};

const bodyParser = require("body-parser");
// const { delete } = require("request");S
app.use(bodyParser.urlencoded({extended: true}));

// ---GET


app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase, 
    users: req.cookies.user_id };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    users: req.cookies.user_id };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    users: req.cookies.user_id };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = shortURL[longURL] 
  res.redirect(longURL);
  });


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get('/login', (req, res) => {
  //
  let userId = req.body.user_id;
  if (userId) {
    res.redirect('urls');
    return;
  }
  const templateVars = { users: req.cookies.user_id };
  res.render("login", templateVars);
});

app.get('/register', (req, res) => {
  let userId = req.body.user_id;
  if (userId) {
    res.redirect('/urls');
    return;
  }
  const templateVars = { users: req.cookies.user_id };
  res.render("register", templateVars);
});

//---POST

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL]
  res.redirect("/urls")
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = Math.random().toString(20).substr(2, 6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const userObj = findUserByEmail(email);
  if (!userObj) {
    res.status(403).send('No such email')
  }
  if (userObj.password !== password) {
    res.status(403).send('Password is incorrect');
  }
  res.cookie("user_id", req.body.user_id); 
  res.redirect('/urls');  
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const userId = generateRandomString();
  addUserToDB(email, password, userId)
  if (!email || !password) {
    return res.status(400).send("Must fill out Email and Password fields");
  }
  const foundUser = findUserByEmail(email);
  if (foundUser) {
    return res.status(400).send("Email already registered");
  }
  res.cookie("user_id", userId);
  res.redirect("/urls");
});