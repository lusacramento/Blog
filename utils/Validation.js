const bcrypt = require("bcryptjs");

module.exports = {
  isEmpty: (string) => {
    if (!string || typeof string === undefined || string === null) return true;
    else return false;
  },

  isInvalidPasswordLength: (string) => {
    if (string.length < 6) return true;
    else return false;
  },

  isEquals: (string1, string2) => {
    if (string1 === string2) return true;
    else return false;
  },

  getHash: async (password) => {
    const result = {};
    const saltRounds = 10;

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          result.err = err;
        } else {
          result.hash = hash;
        }
      });
    });

    return result;
  },
  compareHash: {},
};
