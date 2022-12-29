import mongoose from "mongoose";

const {
  IS_PRODUCTION,
  DB_HOST_DEV,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
} = process.env;
let uriMongoDb;
if (IS_PRODUCTION == "true") {
  uriMongoDb = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  console.log("Starting data base in production mode");
} else {
  uriMongoDb = `mongodb://${DB_HOST_DEV}:${DB_PORT}/${DB_NAME}`;
  console.log("Starting data base in development mode");
}

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
