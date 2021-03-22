const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session")
const bcrypt = require("bcrypt");
const helpers = require("./helpers");
// const findUserByEmail = require("./helpers");
// const generateRandomString = require("./helpers");
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
const PORT =8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "WyattEarp" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "DocHolliday" }
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

app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2", "key3"],
}));

// ---/urls


app.get("/urls", (req, res) => {
  const user = req.session.user_id
  let filteredDatabase = {};
  for (let url in urlDatabase) {
    if (helpers.findURL(urlDatabase[url], user)) {
      filteredDatabase[url] = helpers.findURL(urlDatabase[url], user);
    }
  }
  if (user) {
    console.log(filteredDatabase);
    const templateVars = {
     urls: filteredDatabase,
     user: users[req.session["user_id"]].email
    }
    return res.render("urls_index", templateVars);
  }
  return res.redirect("/login")
});

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

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    users: req.session.user_id };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`)
});


//---/URLS/NEW


app.get("/urls/new", (req, res) => {
  const user = req.session.user_id
  const templateVars = {
    user: users[req.session["user_id"]]
  };
  if(user){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
  //res.render("urls_new", templateVars);
});

//---/u

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
  });

//---/LOGIN

app.get('/login', (req, res) => {
  const templateVars = { users: req.session.user_id };
  res.render("login", templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = helpers.findUserByEmail(email, users);
    if (user) {
      if (user.password === password) {
        req.session["user_id"] = user.id;
        return res.redirect("/urls");
      }
    return res.redirect("/403_login"); 
  }
  return res.redirect("/403_registration");
});

app.get('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

//---/REGISTER

app.get('/register', (req, res) => {
  let userId = req.body.user_id;
  if (userId) {
    res.redirect('/urls');
    return;
  }
  const templateVars = { users: req.session.user_id };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const userID = helpers.generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.redirect("/400");
  }
  for (const user in users) {
    if (helpers.findUserByEmail(users[user], email)) {
      res.redirect("/403_cred");
      return;
    }
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      users[userID] = { id: userID, email: email, password: hash };
      console.log((users[userID]));
      console.log(users);
      res.cookie("user_id", userID);
      res.redirect("/urls");
    })
  })
});


//---bonus babies

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