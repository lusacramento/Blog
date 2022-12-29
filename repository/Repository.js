const Repository = {
  // Search all documents.
  findAll: async (model, populate) => {
    const result = {};

    await model
      .find()
      .sort({ date: "desc" })
      .lean()
      .populate(populate)
      .then((doc) => {
        result.doc = doc.slice();
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },

  // Search a document by Id.
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

  existsByName: async (model, name) => {
    let isExists = false;
    await model
      .exists({ name: name })
      .then((doc) => {
        doc === null ? (isExists = false) : (isExists = true);
      })
      .catch(() => false);
    return isExists;
  },

  // Save a document.
  save: async (model, data) => {
    const result = {};

    await new model(data)
      .save()
      .then((doc) => {
        result.doc = doc._doc;
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },

  findOne: async (model, query) => {
    const result = {};

    await model
      .findOne(query)
      .then((doc) => {
        result.doc = doc;
      })
      .catch((err) => {
        result.err = err;
      });

    return result;
  },

  // Search a document by Id and update it.
  findByIdAndUpdate: async (model, data) => {
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

  // Search a document by Id and remove it.
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

export default Repository;
