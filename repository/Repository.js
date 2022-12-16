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

  findById: async (model, id) => {
    const result = {};

    await model
      .findById(id, (err, doc) => {
        if (err) {
          result.err = err;
        } else {
          result.doc = doc;
        }
      })
      .lean()
      .clone();

    return result;
  },

  save: async (Model, model) => {
    const result = {};
    await new Model(model)
      .save()
      .then((docs) => {
        result.docs = docs._doc;
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },
};
