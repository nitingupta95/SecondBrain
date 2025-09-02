import mongoose from "mongoose";

const Schema = mongoose.Schema;

 
const Userinfo = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model("User", Userinfo);
 
const ContentInfo = new Schema({
  id: { type: Number, required: true },
  type: {
    type: String,
    enum: ["document", "tweet", "youtube", "link"],  
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value),
      message: "Invalid URL format",
    },
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // tags: {
  //   type: [String],
  //   default: [],
  // },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  
});

export const ContentModel = mongoose.model("Content", ContentInfo);

 
const LinkInfo = new Schema(
  {
    hash: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  },
  { collection: "links" }  
);

export const LinkModel = mongoose.model("Link", LinkInfo);
