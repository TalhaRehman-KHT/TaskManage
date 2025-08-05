import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logout from '../Logout/Logout.jsx';

export default function NavBar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem("user");
    //     setUser(null);
    //     // optionally redirect to login page
    // };
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:4000/api/v1/logout', {}, {
                withCredentials: true,
            });

            localStorage.removeItem("user");
            setUser(null);
            window.location.href = '/login'; // or use `navigate('/login')` if using `useNavigate`
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
            {/* Logo */}
            <div>
                <img src="/src/assets/favLogo.png" alt="Logo" className="h-10 w-10" />
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
                <Link to="/users" className="text-gray-700 hover:text-blue-500">Users</Link>

                {/* {!user ? (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
                        <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
                    </>
                ) : (
                    <button
                        className="text-gray-700 hover:text-red-500"
                        onClick={handleLogout}
                    >
                        <Logout />
                    </button>
                )} */}
                {!user ? (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
                        <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
                    </>
                ) : (
                    <Logout />
                )}

            </div>

            {/* Avatar/Profile */}
            <div>
                {user ? (
                    // <img
                    //     src={user.avatar || 'https://i.pravatar.cc/40'}
                    //     alt="User"
                    //     className="rounded-full h-10 w-10 object-cover"
                    // />
                    <img
                        src={user?.avatar || 'https://i.pravatar.cc/40'}
                        alt="User Avatar"
                        className="rounded-full h-10 w-10 object-cover"
                    />

                ) : (
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="Default User"
                        className="rounded-full h-10 w-10 object-cover"
                    />
                )}
            </div>
        </nav>
    );
}
