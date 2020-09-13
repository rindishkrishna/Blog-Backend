const mongoose = require("mongoose");
const util = require("../lib/commonFunctions");
const User = require("./User");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  dislikes: {
    type: Number,
    default: 0,
  },
  dislikedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  slug: {
    type: String,
    default: util.slugify(""),
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
  },
  status: {
    type: String,
    enum: ["posted", "pending"],
    default: "posted",
  },
});
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
