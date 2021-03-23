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
    console.log(templateVars);
    return res.render("urls_index", templateVars);
  }
  return res.redirect("/login")
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
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
  res.render("urls_show", templateVars);
});

//---/u

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL
  const longURL = urlDatabase[shortURL]
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
  console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      return res.redirect("/urls");
    }
    else {
    return res.redirect("/403_login"); 
  }
  return res.redirect("/403_registration");
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
    res.redirect("/403_registration");
  }
  if (findUserByEmail(email, users)) {
    res.redirect("/403_login");
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

//---error pages

app.get("/403_registration", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(403);
  res.render("403_registration", templateVars);
});

app.get("/403_login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(403);
  res.render("403_login", templateVars);
});

app.get("*", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.status(404);
  res.render("404", templateVars);
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