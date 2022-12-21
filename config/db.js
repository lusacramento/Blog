import mongoose from "mongoose";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;
const uriMongoDb = `${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
  .connect(uriMongoDb)
  .then(() => {
    console.log(`Conected in ${uriMongoDb} with success!`);
  })
  .catch((err) => {
    console.error(`Error connecting in ${uriMongoDb}! ${err}`);
  });
