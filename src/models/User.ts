import { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    index: {
      sparse: true,
      unique: true
    }
  },
  picture: {
    type: String,
    required: true,
  },
});

export default model("User", userSchema);
