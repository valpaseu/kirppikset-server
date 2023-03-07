import express from "express";
const app = express();
import cors from "cors";
import config from "./config.json" assert { type: "json" };
import router from "./routes/usermanagment.js";
import { connectToServer } from "./db/conn.js";
import cookieParser from "cookie-parser";
import csurf from "csurf";
const csrfProtection = csurf({ cookie: true });

const port = config.PORT || 5000;

app.use(cors());
app.use(cookieParser());
app.use(csrfProtection);
app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  res.status(403).json({ message: 'Invalid CSRF token' });
});

app.listen(port, () => {
  connectToServer((err) => {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
