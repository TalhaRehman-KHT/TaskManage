// src/components/Logout.jsx
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/api/v1/logout', {}, {
                withCredentials: true,
            });

            localStorage.removeItem("user");
            toast.success("Logged out successfully");
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
            toast.error("Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-500"
        >
            Logout
        </button>
    );
}
