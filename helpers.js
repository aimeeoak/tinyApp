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
};
  
const findUserByEmail = (email) => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};


  
const bodyParser = require("body-parser");
  // const { delete } = require("request");S
app.use(bodyParser.urlencoded({extended: true}));

module.exports = { findURL };
module.exports = { generateRandomString };
module.exports = { findUserByEmail };
module.exports = { bodyParser };