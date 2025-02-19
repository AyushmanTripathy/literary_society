import { model, Schema, Types } from "mongoose";

export const moods = [
  "Romantic",
  "Melancholic",
  "Cheerful",
  "Patriotic",
  "Orwellian",
];

export const categories = ["Poem", "Quote"];

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
    enum: {
      values: moods,
      message: "{VALUE} is not supported",
    },
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: categories,
      message: "{VALUE} is not supported",
    },
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
