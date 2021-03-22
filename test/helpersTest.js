const { assert } = require('chai');

const { findUserByEmail } = require('../helpers.js');
const { generateRandomString } = require("../helpers");
const { findURL } = require("../helpers");
const { users } = require("../helpers");
const { urlDatabase } = require("../helpers");

const testUsers = {
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

const testURLDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "WyattEarp" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "DocHolliday" }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("thedentist@pokerstars.com", testUsers)
    const expectedOutput = "DocHolliday";
    assert.equal(user.id, expectedOutput, 'I\'m not your huckleberry.');
  });
});


describe('generateRandomString', function() {
  it('should generate a random string', function() {
    const stringOne = generateRandomString();
    const stringTwo = generateRandomString();
    assert.notStrictEqual(stringOne, stringTwo);
  });
});

describe('findURL', function() {
  it('find the URL from the database', function() {
    const url = findURL("b2xVn2", testURLDatabase)
    const expectedOutput = "http://www.lighthouselabs.ca";
    assert.equal(url.longURL, expectedOutput, 'wrong')
  });
});
