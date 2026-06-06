import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  red: "#FF6B6B",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    niveau: '',
    ville: '',
    domaine: '',
    bio: ''
  });

  // Charger les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        niveau: user.niveau || '',
        ville: user.ville || '',
        domaine: user.domaine || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Sauvegarder le profil
  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(formData));
    setEditMode(false);
    alert('Profil mis à jour! ✅');
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 64 }}>🔐</div>
        <p style={{ color: C.muted }}>Veuillez vous connecter</p>
        <button 
          onClick={() => navigate('/login')}
          style={{ padding: '12px 24px', borderRadius: 50, border: 'none', background: C.primary, color: C.white, fontWeight: 700, cursor: 'pointer' }}
        >
          Se connecter
        </button>
      </div>
    );
  }

  const isRecruiter = user?.role === 'recruiter';

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '32px 1.5rem' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: C.primary, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, margin: '0 auto 16px' }}>
            {formData.first_name?.[0]}{formData.last_name?.[0]}
          </div>
          <h1 style={{ color: C.white, fontWeight: 900, fontSize: 24 }}>{formData.first_name} {formData.last_name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>{formData.email}</p>
          <span style={{ background: isRecruiter ? C.green : C.primary, color: C.white, padding: '6px 16px', borderRadius: 50, fontWeight: 700, marginTop: 8, display: 'inline-block' }}>
            {isRecruiter ? '🏢 Recruteur' : '🎓 Étudiant'}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 1.5rem' }}>
        {/* Informations */}
        <div style={{ background: C.white, borderRadius: 18, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18 }}>📋 Informations</h3>
            <button 
              onClick={() => editMode ? saveProfile() : setEditMode(true)}
              style={{ background: editMode ? C.green : C.primary, color: C.white, border: 'none', borderRadius: 50, padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}
            >
              {editMode ? '💾 Sauvegarder' : '✏️ Modifier'}
            </button>
          </div>

          {/* Nom */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>Nom complet</label>
            {editMode ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <input 
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  style={{ padding: '12px', borderRadius: 10, border: '1px solid #eee', fontSize: 14 }}
                  placeholder="Prénom"
                />
                <input 
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  style={{ padding: '12px', borderRadius: 10, border: '1px solid #eee', fontSize: 14 }}
                  placeholder="Nom"
                />
              </div>
            ) : (
              <p style={{ fontWeight: 600, fontSize: 15 }}>{formData.first_name} {formData.last_name}</p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>Email</label>
            <p style={{ fontWeight: 600, fontSize: 15 }}>{formData.email}</p>
          </div>

          {/* Téléphone */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>Téléphone</label>
            {editMode ? (
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee', fontSize: 14 }}
                placeholder="06..."
              />
            ) : (
              <p style={{ fontWeight: 600, fontSize: 15 }}>{formData.phone || 'Non défini'}</p>
            )}
          </div>

          {/* Ville */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>Ville</label>
            {editMode ? (
              <input 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee', fontSize: 14 }}
                placeholder="Votre ville"
              />
            ) : (
              <p style={{ fontWeight: 600, fontSize: 15 }}>{formData.city || 'Non définie'}</p>
            )}
          </div>

          {/* Niveau ou Entreprise */}
          {!isRecruiter ? (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>Niveau d'études</label>
              {editMode ? (
                <select 
                  value={formData.niveau}
                  onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee', fontSize: 14 }}
                >
                  <option value="">Sélectionner</option>
                  <option value="BAC">BAC</option>
                  <option value="BAC+2">BAC+2</option>
                  <option value="BAC+3">BAC+3</option>
                  <option value="BAC+5">BAC+5</option>
                </select>
              ) : (
                <p style={{ fontWeight: 600, fontSize: 15 }}>{formData.niveau || 'Non défini'}</p>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>Entreprise</label>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{user.company || 'Non définie'}</p>
            </div>
          )}

          {/* Bio */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13, color: C.muted }}>
              {isRecruiter ? 'Description entreprise' : 'À propos de vous'}
            </label>
            {editMode ? (
              <textarea 
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee', fontSize: 14, minHeight: 80 }}
                placeholder="Présentez-vous..."
              />
            ) : (
              <p style={{ fontWeight: 600, fontSize: 15 }}>{formData.bio || 'Non défini'}</p>
            )}
          </div>
        </div>

        {/* Déconnexion */}
        <button 
          onClick={() => {
            logout();
            navigate('/');
          }}
          style={{ width: '100%', padding: 14, borderRadius: 10, border: `1px solid ${C.red}`, background: 'transparent', color: C.red, fontWeight: 700, cursor: 'pointer' }}
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}