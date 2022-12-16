module.exports = {
  findAll: async (model) => {
    const result = {};
    await model
      .find()
      .sort({ date: "desc" })
      .lean()
      .then((docs) => {
        result.docs = docs.slice();
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },
};
