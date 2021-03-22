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
  
const findUserByEmail = (email, users) => {
  const user = Object.values(users).find(user => user.email === email);
  return user;
};


// module.exports = { findURL };
// module.exports = { generateRandomString };
module.exports = { findUserByEmail, findURL, generateRandomString };