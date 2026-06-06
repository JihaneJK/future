import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('[Login] Login result:', JSON.stringify(result));
      console.log('[Login] user.role:', result?.user?.role);
      console.log('[Login] Navigating to:', from);
      console.log('[Login] location.state:', JSON.stringify(location.state));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #EDE9FE, #E8FAF5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '80px 20px' 
    }}>
      <div className="card" style={{ padding: 44, width: '100%', maxWidth: 440 }}>
        <div className="text-center mb-3">
          <div style={{ 
            width: 52, 
            height: 52, 
            borderRadius: 16, 
            background: 'linear-gradient(135deg, #6C63FF, #00B894)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: 24, 
            margin: '0 auto 16px' 
          }}>🔗</div>
          <h2 style={{ fontWeight: 900, fontSize: 24 }}>Bon retour !</h2>
          <p className="text-muted">Connectez-vous à FuturLink</p>
        </div>

        {error && (
          <div style={{ 
            background: '#FFF0F0', 
            color: '#FF6B6B', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="input" 
              placeholder="ahmed@example.com" 
              required 
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ 
                  position: 'absolute', 
                  right: 12, 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: 16 
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-2" style={{ fontSize: 14, color: '#888' }}>
          Pas de compte ?{' '}
          <Link to="/register" style={{ color: '#6C63FF', fontWeight: 700 }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;