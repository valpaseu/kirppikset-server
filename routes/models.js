import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    unique: [true, "Password already exists"],
  },
  id: {
    type: String,
    required: [true, "Please enter an id"],
    unique: [true, "Id already exists"],
  },
  UserAttributes: [
    { Name: "email", Value: String },
    { Name: "sub", Value: String },
    { Name: "first_name", Value: String },
    { Name: "last_name", Value: String },
  ],
});
