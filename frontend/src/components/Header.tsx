import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="w-full p-4 fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold hover:opacity-80 transition-opacity">
                    Barde
                </Link>
                
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="text-white/90 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                {user.name || user.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-colors"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-colors"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}