import { pool } from '../config/dbConnection.js'

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email, role FROM users");

        res.status(200).json({
            success: true,
            users: result.rows
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({ message: "Server error fetching users" });
    }
};
