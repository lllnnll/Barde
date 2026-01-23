import { Link, useNavigate } from 'react-router-dom';
// @ts-ignore
import { useAuth } from '../context/AuthContext';
import GlassSurface from './GlassSurfaceProps';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="fixed inset-x-0 top-0 flex justify-center pt-4 pointer-events-none z-50">
            <GlassSurface width="90%" height="3rem" className="max-w-[1200px] pointer-events-auto">
                <div className="w-full flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-white text-xl font-bold hover:opacity-80 transition-opacity">
                            Barde
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/contact" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-white/90 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm text-sm border border-white/10">
                                    {user.name || user.username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/80 hover:bg-red-500 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm font-medium shadow-lg shadow-red-500/20"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-white/80 hover:text-white px-4 py-2 transition-colors text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg backdrop-blur-sm transition-colors text-sm font-medium border border-white/10 shadow-lg"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </GlassSurface>
        </header>
    );
}