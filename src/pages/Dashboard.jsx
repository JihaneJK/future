import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { schoolsData } from '../api/data';

// Couleurs
const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  red: "#FF6B6B",
  redLight: "#FFF0F0",
  amber: "#FDCB6E",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('saved');
  const [savedSchools, setSavedSchools] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  console.log('[Dashboard] Rendered with user:', JSON.stringify(user));
  console.log('[Dashboard] user?.id:', user?.id);
  console.log('[Dashboard] user?.email:', user?.email);
  console.log('[Dashboard] user?.role:', user?.role);

  // Rediriger vers le bon dashboard selon le rôle
  useEffect(() => {
    if (user?.role === 'recruiter') {
      console.log('[Dashboard] Role recruiter detected → redirecting to /recruiter');
      navigate('/recruiter', { replace: true });
    } else if (user?.role === 'admin') {
      console.log('[Dashboard] Role admin detected → redirecting to /admin');
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  // Charger les données sauvegardées
  useEffect(() => {
    const schools = JSON.parse(localStorage.getItem('savedSchools') || '[]');
    setSavedSchools(schools.map(slug => schoolsData.find(s => s.slug === slug)).filter(Boolean));

    const jobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(jobs);

    const apps = JSON.parse(localStorage.getItem('myApplications') || '[]');
    setApplications(apps);
  }, []);

  // Supprimer une école sauvegardée
  const removeSchool = (slug) => {
    const updated = savedSchools.filter(s => s.slug !== slug);
    setSavedSchools(updated);
    localStorage.setItem('savedSchools', JSON.stringify(updated.map(s => s.slug)));
  };

  // Supprimer une offre sauvegardée
  const removeJob = (jobId) => {
    const updated = savedJobs.filter(j => j.id !== jobId);
    setSavedJobs(updated);
    localStorage.setItem('savedJobs', JSON.stringify(updated));
  };

  const tabs = [
    { id: 'saved', label: '💾 Sauvegardées', count: savedSchools.length + savedJobs.length },
    { id: 'applications', label: '📨 Candidatures', count: applications.length },
    { id: 'jobs', label: '💼 Offres', count: savedJobs.length }
  ];

  // Calculate progress
  const progress = user?.profile?.completed || 35;

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 64 }}>🔐</div>
        <p style={{ color: C.muted }}>Veuillez vous connecter pour accéder à votre dashboard</p>
        <Link to="/login" className="btn btn-primary">Se connecter</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '24px 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: C.primary, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div>
              <h1 style={{ color: C.white, fontWeight: 900, fontSize: 24 }}>
                Bonjour {user.first_name}! 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Profil complété</span>
              <span style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{progress}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 50, height: 8 }}>
              <div style={{ width: `${progress}%`, height: '100%', background: C.green, borderRadius: 50 }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 1.5rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: 50,
                border: 'none',
                background: activeTab === tab.id ? C.primary : C.white,
                color: activeTab === tab.id ? C.white : C.dark,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{ 
                  background: activeTab === tab.id ? C.white : C.primary, 
                  color: activeTab === tab.id ? C.primary : C.white,
                  padding: '2px 8px', 
                  borderRadius: 50, 
                  fontSize: 12 
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ÉCOLES SAUVEGARDÉES */}
        {activeTab === 'saved' && (
          <>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>💾 Écoles sauvegardées ({savedSchools.length})</h3>
            
            {savedSchools.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                <p style={{ color: C.muted, marginBottom: 16 }}>Aucune école sauvegardée</p>
                <Link to="/schools" className="btn btn-primary">Découvrir les écoles</Link>
              </div>
            ) : (
              <div className="grid grid-3">
                {savedSchools.map(school => (
                  <div key={school.slug} className="card" style={{ padding: 20, position: 'relative' }}>
                    <button 
                      onClick={() => removeSchool(school.slug)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: C.redLight,
                        color: C.red,
                        border: 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      ✕
                    </button>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 12 }}>
                      🏫
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{school.name}</h4>
                    <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>📍 {school.city} • {school.type}</p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <span style={{ background: C.gray, padding: '4px 10px', borderRadius: 50, fontSize: 11 }}>{school.duration}</span>
                      <span style={{ background: C.gray, padding: '4px 10px', borderRadius: 50, fontSize: 11 }}>{school.rating}%</span>
                    </div>
                    <Link to={`/schools/${school.slug}`} style={{ textDecoration: 'none' }}>
                      <button style={{ width: '100%', padding: '10px', borderRadius: 10, border: `1px solid ${C.primary}`, background: 'transparent', color: C.primary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                        Voir détails
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CANDIDATURES */}
        {activeTab === 'applications' && (
          <>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>📨 Mes candidatures ({applications.length})</h3>
            
            {applications.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <p style={{ color: C.muted, marginBottom: 16 }}>Aucune candidature</p>
                <Link to="/jobs" className="btn btn-primary">Postuler à des offres</Link>
              </div>
            ) : (
              <div className="grid grid-2">
                {applications.map((app, i) => (
                  <div key={i} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="badge badge-green">En attente</span>
                      <span style={{ fontSize: 12, color: C.muted }}>Il y a 2 jours</span>
                    </div>
                    <h4 style={{ fontWeight: 800, fontSize: 15 }}>{app.title || 'Développeur React'}</h4>
                    <p style={{ fontSize: 13, color: C.muted }}>🏢 {app.company || 'TechCo'} • 📍 {app.city || 'Casablanca'}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* OFFRES SAUVEGARDÉES */}
        {activeTab === 'jobs' && (
          <>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>💼 Offres sauvegardées ({savedJobs.length})</h3>
            
            {savedJobs.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>💼</div>
                <p style={{ color: C.muted, marginBottom: 16 }}>Aucune offre sauvegardée</p>
                <Link to="/jobs" className="btn btn-primary">Voir les offres</Link>
              </div>
            ) : (
              <div className="grid grid-2">
                {savedJobs.map(job => (
                  <div key={job.id} className="card" style={{ padding: 20, position: 'relative' }}>
                    <button 
                      onClick={() => removeJob(job.id)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: C.redLight,
                        color: C.red,
                        border: 'none',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        fontSize: 14
                      }}
                    >
                      ✕
                    </button>
                    <span className="badge badge-primary">{job.type}</span>
                    <h4 style={{ fontWeight: 800, fontSize: 15, marginTop: 8 }}>{job.title}</h4>
                    <p style={{ fontSize: 13, color: C.muted }}>🏢 {job.company} • 📍 {job.city}</p>
                    <span style={{ fontWeight: 700, color: C.green, marginTop: 8, display: 'block' }}>{job.salary}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}