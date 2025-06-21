"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
// User Schema
var Userinfo = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
exports.UserModel = mongoose_1.default.model("User", Userinfo);
// Content Schema
var ContentInfo = new Schema({
    id: { type: Number, required: true },
    type: {
        type: String,
        enum: ["document", "tweet", "youtube", "link"], // Restrict values to these options
        required: true,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: function (value) { return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value); },
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
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }, // Match model name for `ref`
});
exports.ContentModel = mongoose_1.default.model("Content", ContentInfo);
// Links Schema
var LinkInfo = new Schema({
    hash: { type: String, unique: true, required: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true }, // Match model name for `ref`
}, { collection: "links" } // Use lowercase singular name for consistency
);
exports.LinkModel = mongoose_1.default.model("Link", LinkInfo);
