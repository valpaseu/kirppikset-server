import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getDb } from "../db/conn.js";
import config from "../config.json" assert { type: "json" };
import { uuid, isUuid } from "uuidv4";

let secretKey = config.JTW_KEY;

router.route("/signup").post(async (req, res) => {
  try {
    const db = getDb("authDB");

    // check if user already exists
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password and insert user into database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let id = uuid();

    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      id: id,
      UserAttributes: [
        { Name: "email", Value: req.body.email },
        { Name: "sub", Value: id },
        { Name: "first_name", Value: req.body.first_name },
        { Name: "last_name", Value: req.body.last_name },
      ],
    };
    await db.collection("users").insertOne(newUser);

    // generate JWT token and send response
    const token = jwt.sign({ email: req.body.email }, secretKey);
    return res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/login").post(async (req, res) => {
  try {
    // connect to MongoDB

    const db = getDb("authDB");

    // find user by email
    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // compare password with hashed password in database
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // generate JWT token and send response
    const token = jwt.sign({ email: req.body.email }, secretKey);
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
