const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide a title!"],
      unique: [true, "Title must be unique!"],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, " Please provide a description"],
      maxlength: [
        100,
        "A blog description must have less or equal to 100 characters",
      ],
      lowercase: true,
    },
    tags: {
        type: String,
        required: [true, "please provide tag!"],
        lowercase: true, 
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Blog must have an author"],
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
      default: 0,
    },
    body: {
      type: String,
      required: [true, "Blog must have a body"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "first_name last_name email",
  });
  next();
});
blogSchema.pre("save", function (next) {
  this.reading_time = Math.ceil(this.body.split(" ").length / 200);
  next();
});
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;