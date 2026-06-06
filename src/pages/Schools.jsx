import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schoolsData } from '../api/data';
import { useAuth } from '../context/AuthContext';

const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888",
  red: "#FF6B6B"
};

export default function Schools() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Filtrage
  const filteredSchools = schoolsData.filter(s => {
    const matchTab = activeTab === 'all' || s.level === activeTab;
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    s.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = !cityFilter || s.city === cityFilter;
    const matchType = !typeFilter || s.type === typeFilter;
    return matchTab && matchSearch && matchCity && matchType;
  });

  const tabs = [
    { id: 'all', label: 'Tous', icon: '🏫' },
    { id: 'bac2', label: 'BAC+2', icon: '🎓' },
    { id: 'bac3', label: 'BAC+3', icon: '🏛️' },
    { id: 'bac5', label: 'BAC+5', icon: '🌟' },
    { id: 'prepa', label: 'Prépa', icon: '📐' }
  ];

  const cities = [...new Set(schoolsData.map(s => s.city))];
  const types = [...new Set(schoolsData.map(s => s.type))];

  // Sauvegarder une école
  const saveSchool = (slug) => {
    const saved = JSON.parse(localStorage.getItem('savedSchools') || '[]');
    if (!saved.includes(slug)) {
      saved.push(slug);
      localStorage.setItem('savedSchools', JSON.stringify(saved));
      alert('École sauvegardée! 💾');
    } else {
      alert('Déjà sauvegardée!');
    }
  };

  // Vérifier si sauvegardée
  const isSaved = (slug) => {
    const saved = JSON.parse(localStorage.getItem('savedSchools') || '[]');
    return saved.includes(slug);
  };

  // Postuler à une école
  const applyToSchool = (school) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const application = {
      id: Date.now(),
      schoolId: school.id,
      schoolName: school.name,
      schoolCity: school.city,
      schoolSlug: school.slug,
      studentId: user.id || 'guest',
      studentName: user.first_name + ' ' + user.last_name,
      studentEmail: user.email,
      studentPhone: user.phone || '',
      date: new Date().toISOString(),
      status: 'pending'
    };

    const apps = JSON.parse(localStorage.getItem('myApplications') || '[]');
    apps.push(application);
    localStorage.setItem('myApplications', JSON.stringify(apps));

    alert(`Candidature envoyée à ${school.name}! 📨\n\nL'école vous contactera bientôt.`);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '40px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 28, marginBottom: 8 }}>🏫 Écoles Post-Diplôme</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Découvrez les {schoolsData.length} écoles au Maroc</p>
          
          {/* Search */}
          <div style={{ marginTop: 20 }}>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Rechercher une école..."
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: 50,
                border: 'none',
                fontSize: 15,
                background: 'rgba(255,255,255,0.95)'
              }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <select onChange={(e) => setCityFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <option value="" style={{ color: '#000' }}>Toutes les villes</option>
              {cities.map(c => <option key={c} value={c} style={{ color: '#000' }}>{c}</option>)}
            </select>
            <select onChange={(e) => setTypeFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <option value="" style={{ color: '#000' }}>Tous les types</option>
              {types.map(t => <option key={t} value={t} style={{ color: '#000' }}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 50,
                border: 'none',
                background: activeTab === tab.id ? C.primary : C.white,
                color: activeTab === tab.id ? C.white : C.dark,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Result count */}
        <p style={{ color: C.muted, marginBottom: 16 }}>
          {filteredSchools.length} école(s) trouvée(s)
        </p>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Chargement...</div>
        ) : (
          /* Schools Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filteredSchools.map(school => (
              <div 
                key={school.id} 
                style={{ background: C.white, padding: 20, borderRadius: 18, position: 'relative' }}
              >
                {/* Bouton sauvegarder */}
                <button 
                  onClick={() => saveSchool(school.slug)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: isSaved(school.slug) ? C.primaryLight : C.gray,
                    border: 'none',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isSaved(school.slug) ? '💾' : '🔖'}
                </button>

                <div style={{ width: 46, height: 46, borderRadius: 12, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>
                  🏫
                </div>
                
                <span style={{ background: C.primaryLight, color: C.primary, padding: '4px 10px', borderRadius: 50, fontSize: 11, fontWeight: 700 }}>
                  {school.rating}%
                </span>
                
                <h3 style={{ fontWeight: 800, fontSize: 15, marginTop: 8, marginBottom: 4 }}>{school.name}</h3>
                <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📍 {school.city} • {school.type}</p>
                <p style={{ fontSize: 13, color: C.dark, marginBottom: 12 }}>{school.description}</p>
                
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ background: C.gray, padding: '4px 10px', borderRadius: 50, fontSize: 11 }}>⏱️ {school.duration}</span>
                  <span style={{ background: C.gray, padding: '4px 10px', borderRadius: 50, fontSize: 11 }}>💰 {school.tuition}</span>
                </div>

                {/* Lien site web */}
                {school.website && (
                  <a 
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: C.primary,
                      fontWeight: 600,
                      fontSize: 13,
                      marginBottom: 12
                    }}
                  >
                    🌐 Site web →
                  </a>
                )}
                
                {/* Bouton Postuler */}
                <button 
                  onClick={() => applyToSchool(school)}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: 10, 
                    border: 'none', 
                    background: C.primary, 
                    color: C.white, 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    marginBottom: 8
                  }}
                >
                  📨 Postuler
                </button>
                
                {/* Voir détails */}
                <Link to={`/schools/${school.slug}`} style={{ textDecoration: 'none' }}>
                  <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: `1px solid ${C.primary}`, background: 'transparent', color: C.primary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                    Voir détails →
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}