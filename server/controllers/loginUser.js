import { pool } from "../config/dbConnection.js";
import { comparePassword, generateToken } from "../utils/passwordUtils.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = generateToken(user.id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // res.status(200).json({
        //     message: "Login successful",
        //     user: {
        //         id: user.id,
        //         username: user.username,
        //         email: user.email,
        //         role: user.role,
        //         avatar: user.profile_photo,
        //     }
        // });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.profile_photo
                    ? `data:image/png;base64,${user.profile_photo.toString('base64')}`
                    : null,
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
};
