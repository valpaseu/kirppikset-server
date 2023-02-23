import express from "express";
const app = express();
import cors from "cors";
import config from "./config.json" assert { type: "json" };
import router from "./routes/record.js";
import { connectToServer } from "./db/conn.js";

const port = config.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  connectToServer((err) => {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
