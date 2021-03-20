const express = require("express");
const cookieParser = require("cookie-parser");
//const bcrypt = require('bcryptjs');
const app = express();
app.use(cookieParser());
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

const findURL = function(obj, value) {
  const userURLs = {};
  for (let key of Object.keys(obj)) {
    if (obj[key].userId === value) {
      userURLs[key] = obj[key];
    }
  } return userURLs;
};


const generateRandomString = function() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let string = '';
  while (string.length !== 6) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
}

const findUserByEmail = (email) => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};

const bodyParser = require("body-parser");
// const { delete } = require("request");S
app.use(bodyParser.urlencoded({extended: true}));

// ---/urls


app.get("/urls", (req, res) => {
  const user = req.cookies.user_id
  let filteredDatabase = {};
  for (let url in urlDatabase) {
    if (findURL(urlDatabase[url], users)) {
      filteredDatabase[url] = findURL(urlDatabase[url], userId);
    }
  }
  if (users) {
    const templateVars = { 
      urls: findURL(urlDatabase, req.cookies.user_id), 
      users: req.cookies.user_id };
    if (!req.cookies.user_id) {
      return res.redirect('/login');
    }
  res.render("urls_index", templateVars);
  }
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
    users: req.cookies.user_id };
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
  const user = req.cookies.user_id
  const templateVars = {
    user: users[req.cookies["user_id"]]
  };
  if(user){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
  res.render("urls_new", templateVars);
});

//---/u

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
  res.redirect(longURL);
  });

//---/LOGIN

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

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  for (const user in users) {
    if (findUserByEmail(users[user], email)) {
      if (bcrypt.compareSync(password, users[user].password)) {
        res.cookie("user_id", users[user].id);
        res.redirect("/urls");
        return;
      }
    };
  if (!userObj) {
    res.status(403).send('No such email')
  }
  if (userObj.password !== password) {
    res.status(403).send('Password is incorrect');
    }
  }
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
  const templateVars = { users: req.cookies.user_id };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const userID = randomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.redirect("/400");
  }
  for (const user in users) {
    if (findUserByEmail(users[user], email)) {
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