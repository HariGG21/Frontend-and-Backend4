"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controller/authControllers"); // Adjust the path as necessary
const router = (0, express_1.Router)();
// Route for user registration
router.post('/register', authControllers_1.registerUser);
// Route for user login
router.post('/login', authControllers_1.loginUser);
exports.default = router;
