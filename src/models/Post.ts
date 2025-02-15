import { model, Schema, Types } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  by: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  likes: [
    {
      id: {
        type: Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      picture: {
        type: String,
        required: true,
      },
    },
  ],
  authorId: {
    type: Types.ObjectId,
    required: true,
  },
  author: {
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
  },
});

export default model("Post", postSchema);
