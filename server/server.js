import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import route from './router/router.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { dbConnection } from './config/dbConnection.js';

// ENV setup
dotenv.config();
// dotenv.config({ path: './config/config.env' });

// Create Express app
const app = express();

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL, // your React app URL   use env method 
    credentials: true // to allow sending cookies
}));


// DatabaseConnection Call
dbConnection();

// Use router for all API v1 routes
app.use('/api/v1', route);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server is listening at http://localhost:${PORT}`);
});
