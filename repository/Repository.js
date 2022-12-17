module.exports = {
  findAll: async (model, populate) => {
    const result = {};
    await model
      .find()
      .sort({ date: "desc" })
      .lean()
      .populate(populate)
      .then((docs) => {
        result.docs = docs.slice();
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },

  findById: async (model, id, populate) => {
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
      .populate(populate)
      .clone();

    return result;
  },

  save: async (model, data) => {
    const result = {};
    await new model(data)
      .save()
      .then((docs) => {
        result.docs = docs._doc;
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },

  findByIdAndUpdate: async (model, data, update) => {
    const result = {};
    await model
      .findByIdAndUpdate(data._id, data, (err, doc) => {
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

  findByIdAndRemove: async (model, id) => {
    const result = {};
    await model
      .findByIdAndRemove(id, (err) => {
        if (err) {
          result.err = err;
        }
      })
      .clone();

    return result;
  },
};
