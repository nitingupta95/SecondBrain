"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var cors_1 = __importDefault(require("cors"));
var crypto_1 = __importDefault(require("crypto"));
var db_1 = require("./db");
var JWT_SECRET = process.env.JWT_SECRET || "your_secure_secret";
var MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ng61315:xvR6Q3iyKZiz7tMN@cluster0.fantk.mongodb.net/SecondBrainn";
console.log("🔍 Connecting to:", MONGO_URI);
mongoose_1.default.connect(MONGO_URI)
    .then(function () { return console.log("✅ MongoDB connected"); })
    .catch(function (err) { return console.error("❌ Connection failed:", err.message); });
mongoose_1.default.connection.on('connected', function () { return console.log('Mongoose connected'); });
mongoose_1.default.connection.on('error', function (err) { return console.error('Mongoose connection error:', err); });
mongoose_1.default.connection.on('disconnected', function () { return console.log('Mongoose disconnected'); });
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
// ✅ Auth middleware
function auth(req, res, next) {
    var token = req.headers['token'];
    if (!token) {
        res.status(401).json({ message: "Token missing" });
        return;
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch (_a) {
        res.status(401).json({ message: "Invalid token" });
    }
}
// ✅ Signup
app.post('/api/v1/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, existingUser, hashedPassword, user, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, db_1.UserModel.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    res.status(400).json({ message: 'User already exists' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, db_1.UserModel.create({ name: name_1, email: email, password: hashedPassword })];
            case 3:
                user = _b.sent();
                token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
                res.status(201).json({ token: token, name: user.name });
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                console.error('Signup error:', err_1);
                res.status(500).json({ message: 'Server error during signup', error: err_1.message || err_1 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// ✅ Signin
app.post('/api/v1/signin', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _b, token, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, db_1.UserModel.findOne({ email: email })];
            case 1:
                user = _c.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                _b = !(_c.sent());
                _c.label = 3;
            case 3:
                if (_b) {
                    res.status(401).json({ message: 'Invalid credentials' });
                    return [2 /*return*/];
                }
                token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
                res.json({ token: token, name: user.name });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _c.sent();
                res.status(500).json({ message: 'Server error during signin', error: err_2.message || err_2 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// ✅ Get content
app.get('/api/v1/content', auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var content, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db_1.ContentModel.find({ userId: req.userId })];
            case 1:
                content = _a.sent();
                res.json({ content: content });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(500).json({ message: 'Failed to fetch content', error: err_3.message || err_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ Create content
app.post('/api/v1/content', auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, type, link, title, content, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, id = _a.id, type = _a.type, link = _a.link, title = _a.title;
                return [4 /*yield*/, db_1.ContentModel.create({ id: id, type: type, link: link, title: title, userId: req.userId })];
            case 1:
                content = _b.sent();
                res.status(201).json({ message: 'Content saved', content: content });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                res.status(500).json({ message: 'Failed to save content', error: err_4.message || err_4 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ Delete content
app.delete("/api/v1/content/:id", auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, content, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({ message: "Invalid numeric content ID" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.ContentModel.findOneAndDelete({ id: id, userId: req.userId })];
            case 1:
                content = _a.sent();
                if (!content) {
                    res.status(404).json({ message: "Content not found for the given ID" });
                    return [2 /*return*/];
                }
                res.status(200).json({ message: "Content with ID ".concat(id, " has been deleted successfully.") });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(500).json({ message: "Internal Server Error", error: (err_5 === null || err_5 === void 0 ? void 0 : err_5.message) || err_5 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// ✅ Share content
app.post("/api/v1/brain/share", auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var share, existingLink, hash, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                share = req.body.share;
                if (!share) return [3 /*break*/, 3];
                return [4 /*yield*/, db_1.LinkModel.findOne({ userId: req.userId })];
            case 1:
                existingLink = _a.sent();
                if (existingLink) {
                    res.json({ hash: existingLink.hash });
                    return [2 /*return*/];
                }
                hash = crypto_1.default.randomBytes(5).toString('hex');
                return [4 /*yield*/, db_1.LinkModel.create({ userId: req.userId, hash: hash })];
            case 2:
                _a.sent();
                res.json({ hash: hash });
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, db_1.LinkModel.deleteOne({ userId: req.userId })];
            case 4:
                _a.sent();
                res.json({ message: "Removed link" });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_6 = _a.sent();
                res.status(500).json({ message: "Internal Server Error", error: (err_6 === null || err_6 === void 0 ? void 0 : err_6.message) || err_6 });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// ✅ View shared content
app.get("/api/v1/brain/:shareLink", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hash, link, content, user, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                hash = req.params.shareLink;
                return [4 /*yield*/, db_1.LinkModel.findOne({ hash: hash })];
            case 1:
                link = _a.sent();
                if (!link) {
                    res.status(404).json({ message: "Invalid or expired share link" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.ContentModel.find({ userId: link.userId })];
            case 2:
                content = _a.sent();
                return [4 /*yield*/, db_1.UserModel.findById(link.userId)];
            case 3:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                    return [2 /*return*/];
                }
                res.json({ name: user.name, content: content });
                return [3 /*break*/, 5];
            case 4:
                err_7 = _a.sent();
                res.status(500).json({ message: "Internal Server Error", error: (err_7 === null || err_7 === void 0 ? void 0 : err_7.message) || err_7 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// ✅ Start server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () { return console.log("\uD83D\uDE80 Server running on port ".concat(PORT)); });
exports.default = app;
