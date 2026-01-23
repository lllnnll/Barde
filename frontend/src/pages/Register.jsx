import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassSurface from '../components/GlassSurfaceProps';

const Register = () => {
  const [name, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur d\'inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <GlassSurface width={400} height="auto" className="p-6">
        <div className="w-full flex flex-col gap-4">
          <h2 className="text-white text-2xl text-center">Inscription</h2>
          {error && <p className="error text-red-400">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Pseudo"
              value={name}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="p-2 rounded bg-white/20 text-white placeholder-white/60"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 rounded bg-white/20 text-white placeholder-white/60"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 rounded bg-white/20 text-white placeholder-white/60"
            />
            <button type="submit" className="p-2 rounded bg-white/30 text-white hover:bg-white/40 transition-colors">
              S'inscrire
            </button>
          </form>
          <p className="text-white/80 text-center">
            Déjà un compte ? <Link to="/login" className="text-white hover:underline">Se connecter</Link>
          </p>
        </div>
      </GlassSurface>
    </div>
  );
};

export default Register;
