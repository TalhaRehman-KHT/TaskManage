import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Hash plain password
export const hashPassword = async (plainPassword) => {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
};

// Compare plain and hashed passwords
export const comparePassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Generate JWT token with expiry
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '1d',
    });
};

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'You must be logged in to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: ... }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Middleware to check if user is authorized (admin only)
export const isAuthorized = async (req, res, next) => {
    // You need user data from DB to check role
    const { id } = req.user;
    try {
        // Dynamically import your User model
        const { pool } = await import("../config/dbConnection.js");
        const result = await pool.query("SELECT role FROM users WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userRole = result.rows[0].role;
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        next();
    } catch (error) {
        console.error("Authorization Error:", error);
        res.status(500).json({ message: 'Server error while authorizing' });
    }
};
