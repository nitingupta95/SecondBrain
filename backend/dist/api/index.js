"use strict";
// api/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../src/index"));
var http_1 = require("http");
var server = (0, http_1.createServer)(index_1.default);
exports.default = server;
