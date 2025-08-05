export const getDashboard = async (req, res) => {
    try {
        // req.user is added in isAuthenticated middleware
        res.status(200).json({
            message: `Welcome to your dashboard, user ID: ${req.user.id}`
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ message: "Server error on dashboard" });
    }
};
