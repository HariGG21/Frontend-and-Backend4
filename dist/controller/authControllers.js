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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user")); // Make sure this path is correct
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Validate input fields
    if (!name || !email || !password) {
        res.status(400).json({ message: 'Name, email, and password are required' });
        return; // Early return to stop further execution
    }
    try {
        const existingUser = yield user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return; // Early return
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create a new user
        const newUser = new user_1.default({ username: name, email, password: hashedPassword });
        yield newUser.save();
        // Generate a token
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with the token and user data
        res.status(201).json({ token, user: newUser });
    }
    catch (err) {
        console.error(err); // Log the error for debugging
        if (err instanceof Error) {
            res.status(500).json({ message: 'Error registering user', error: err.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred during registration' });
        }
    }
});
exports.registerUser = registerUser;
// Log in a user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Validate input fields
    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return; // Early return
    }
    try {
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return; // Early return
        }
        // Compare the password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return; // Early return
        }
        // Generate a token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Respond with the token and user data
        res.status(200).json({ token, user });
    }
    catch (err) {
        console.error(err); // Log the error for debugging
        if (err instanceof Error) {
            res.status(500).json({ message: 'Error logging in', error: err.message });
        }
        else {
            res.status(500).json({ message: 'Unknown error occurred during login' });
        }
    }
});
exports.loginUser = loginUser;
