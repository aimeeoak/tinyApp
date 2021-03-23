const findURL = function(obj, value) {
  const userURLs = {};
  for (let key of Object.keys(obj)) {
    if (obj[key].userID === value) {
      userURLs[key] = obj[key];
    }
  } return userURLs;
};
  
const generateRandomString = function() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let string = '';
  while (string.length !== 6) {
    string += chars[Math.floor(Math.random() * chars.length)];
  } return string;
};
  
const findUserByEmail = (email, users) => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "WyattEarp" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "DocHolliday" }
};

const users = { 
  "WyattEarp": {
    id: "WyattEarp", 
    email: "w.earp@usmarshals.gov", 
    password: "joe"
  },
 "DocHolliday": {
    id: "DocHolliday", 
    email: "thedentist@pokerstars.com", 
    password: "imurhuckleberry"
  }
};

// module.exports = { findURL };
// module.exports = { generateRandomString };
module.exports = { findUserByEmail, findURL, generateRandomString, urlDatabase, users };