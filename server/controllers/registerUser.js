import { pool } from '../config/dbConnection.js';
import { hashPassword, generateToken } from '../utils/passwordUtils.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Handle file uploads (optional)
        const profilePicFile = req.files?.profilePic?.[0];
        const cvFile = req.files?.cvFile?.[0];
        const profile_photo = profilePicFile?.buffer || null;
        const cv_file = cvFile?.buffer || null;

        // Insert new user
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password, role, profile_photo, cv_file)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, username, email, role`,
            [username, email, hashedPassword, role || 'user', profile_photo, cv_file]
        );

        // Generate JWT token
        const token = generateToken(newUser.rows[0].id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.rows[0].id,
                username: newUser.rows[0].username,
                email: newUser.rows[0].email,
                role: newUser.rows[0].role,
                profilePhotoUploaded: !!profile_photo,
                cvFileUploaded: !!cv_file,
                profilePhotoSize: profile_photo ? profile_photo.length : 0,
                cvFileSize: cv_file ? cv_file.length : 0,
            },
        });

    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
