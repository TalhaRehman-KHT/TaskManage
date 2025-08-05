
// 
export const logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only use secure cookies in production
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message,
        });
    }
};


// 