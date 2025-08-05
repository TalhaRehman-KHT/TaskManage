import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user', // default role
    });

    const [profilePic, setProfilePic] = useState(null);
    const [cvFile, setCvFile] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            return;
        }

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', formData.role);
        if (profilePic) data.append('profilePic', profilePic);
        if (cvFile) data.append('cvFile', cvFile);

        try {
            const res = await axios.post('http://localhost:4000/api/v1/register', data);
            toast.success("Registered successfully!");

            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate('/dashboard');
            console.log(res.data);
        } catch (error) {
            toast.error("Registration failed");
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />

                {/* File uploads */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePic(e.target.files[0])}
                />
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCvFile(e.target.files[0])}
                />

                {/* Role radio buttons */}
                <div className="flex gap-4">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={formData.role === 'user'}
                            onChange={handleChange}
                        />
                        User
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="admin"
                            checked={formData.role === 'admin'}
                            onChange={handleChange}
                        />
                        Admin
                    </label>
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}
