
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'student',
    company: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      
      // Rediriger vers la bonne page selon le rôle
      if (formData.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || "Erreur d'inscription");
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
      <div className="card" style={{ padding: 44, width: '100%', maxWidth: 480 }}>
        <div className="text-center mb-3">
          <h2 style={{ fontWeight: 900, fontSize: 24 }}>Créer un compte</h2>
          <p className="text-muted">Rejoignez FuturLink</p>
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
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Prénom</label>
              <input 
                type="text" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                className="input" 
                placeholder="Ahmed" 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Nom</label>
              <input 
                type="text" 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange} 
                className="input" 
                placeholder="Benjelloun" 
                required 
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="input" 
              placeholder="ahmed@example.com" 
              required 
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Mot de passe</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="input" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Téléphone</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="input" 
                placeholder="06 XX XX XX XX" 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Ville</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                className="input" 
                placeholder="Fès" 
              />
            </div>
          </div>

          {/* CHAMP ENTREPRISE - SEULEMENT POUR RECRUTEUR */}
          {formData.role === 'recruiter' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Nom de l'entreprise *</label>
              <input 
                type="text" 
                name="company" 
                value={formData.company} 
                onChange={handleChange} 
                className="input" 
                placeholder="TechCo Morocco" 
                required 
              />
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 13 }}>Je suis...</label>
            <div className="flex" style={{ gap: 12 }}>
              <button 
                type="button"
                onClick={() => handleRoleChange('student')} 
                className={formData.role === 'student' ? 'btn btn-primary' : 'btn btn-outline'} 
                style={{ flex: 1 }}
              >
                🎓 Étudiant
              </button>
              <button 
                type="button"
                onClick={() => handleRoleChange('recruiter')} 
                className={formData.role === 'recruiter' ? 'btn btn-primary' : 'btn btn-outline'} 
                style={{ flex: 1 }}
              >
                🏢 Recruteur
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%' }}
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center mt-2" style={{ fontSize: 14, color: '#888' }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color: '#6C63FF', fontWeight: 700 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;