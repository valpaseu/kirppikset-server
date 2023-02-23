import { MongoClient } from "mongodb";
import config from "../config.json" assert { type: "json" };
const uri = config.ATLAS_URI;
const db_name = config.DB_NAME;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

export const connectToServer = async (callback) => {
  await client
    .connect()
    .then(async () => {
      await client.db(db_name).command({ ping: 1 });
      _db = client
      console.log("Connected successfully to server");
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDb = (q) => _db.db(q)
