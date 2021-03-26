const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session")
const bcrypt = require("bcrypt");
const { generateRandomString } = require("./helpers");
const { findUserByEmail } = require("./helpers");
const { findURL } = require("./helpers");
const { urlDatabase } = require("./helpers");
const { users } = require("./helpers")
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
const PORT =8080;

app.set("view engine", "ejs");

app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2", "key3"],
}));


// ---/urls

app.get("/urls", (req, res) => {
  const user = req.session.user_id;
  if (user) {
    const templateVars = {
     urls: findURL(urlDatabase, user),
     user: users[req.session.user_id]
    }
    return res.render("urls_index", templateVars);
  }
  return res.redirect("/login")
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

// ---/urls edit and delete

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL].longURL = longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});


//---/URLS/NEW


app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  const templateVars = {
    user: users[req.session.user_id]
  };
  if(user){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL, 
    user: users[req.session.user_id] };
  if (urlDatabase[shortURL].userID === req.session.user_id) {
    res.render("urls_show", templateVars);
    return;
  } else {
    res.redirect("/401_url");
  }
});

//---/u

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
  });

//---/LOGIN

app.get('/login', (req, res) => {
  const templateVars = { user: req.session.user_id };
  res.render("login", templateVars);
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = findUserByEmail(email, users);
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      return res.redirect("/urls");
    }
    else {
    return res.redirect("/401_login");
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

//---/REGISTER

app.get('/register', (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.redirect("/401_registration");
    return;
  }
  if (findUserByEmail(email, users)) {
    res.redirect("/401_username-error");
//    res.redirect("/401_login");
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10)
  console.log(hashedPassword);
  users[userID] = { id: userID, email: email, password: hashedPassword };
  console.log((users[userID]));
  console.log(users);
    req.session.user_id = userID;
    res.redirect("/urls");
  });


//---bonus babies

app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  return res.redirect("/login")
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

//---error pages

app.get("/401_registration", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(401);
  res.render("401_registration", templateVars);
});

app.get("/401_username-error", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(401);
  res.render("401_username-error", templateVars);
});

app.get("/401_login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(401);
  res.render("401_login", templateVars);
});

app.get("/401_url", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(401);
  res.render("401_url", templateVars);
});

app.get("*", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(404);
  res.render("404", templateVars);
});