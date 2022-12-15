module.exports = {
    isEmpty: (string) => {
      if (!string || typeof string === undefined || string === null) return true;
      else return false;
    },
  };