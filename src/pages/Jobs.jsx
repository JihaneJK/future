import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI } from '../api/api';
import Swal from 'sweetalert2';

const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

export default function Jobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await jobAPI.getAll();
        setJobs(data || []);
      } catch (err) {
        console.warn('Erreur chargement offres:', err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const parseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') return skills.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };

  const filteredJobs = jobs.filter(j => {
    const matchFilter = filter === 'Tous' || j.type === filter;
    const matchSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     (j.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCity = !cityFilter || j.city === cityFilter;
    return matchFilter && matchSearch && matchCity;
  });

  const jobTypes = ['Tous', 'CDI', 'Stage', 'CDD', 'Alternance'];
  const cities = [...new Set(jobs.map(j => j.city).filter(Boolean))];

  // Sauvegarder une offre
  const saveJob = (job) => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (!saved.find(j => j.id === job.id)) {
      saved.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(saved));
      Swal.fire({ icon: 'success', title: 'Offre sauvegardée !', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    } else {
      Swal.fire({ icon: 'info', title: 'Déjà sauvegardée !', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
    }
  };

  // Vérifier si sauvegardée
  const isSaved = (jobId) => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    return saved.find(j => j.id === jobId);
  };

  // Postuler à une offre
  const [applying, setApplying] = useState(false);
  const applyToJob = async (job) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (applying) return;
    setApplying(true);

    try {
      const result = await jobAPI.apply(job.id);
      console.log('Résultat candidature:', result);
      if (result.success) {
        const apps = JSON.parse(localStorage.getItem('myApplications') || '[]');
        apps.push({ id: Date.now(), jobId: job.id, status: 'pending', date: new Date().toISOString() });
        localStorage.setItem('myApplications', JSON.stringify(apps));
        Swal.fire({ icon: 'success', title: 'Candidature envoyée !', text: 'Le recruteur vous contactera.', confirmButtonColor: '#4CAF50' });
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur', text: result.message || 'Erreur lors de la candidature', confirmButtonColor: '#FF6B6B' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur inconnue';
      if (err.response?.status === 409) {
        Swal.fire({ icon: 'info', title: 'Déjà postulé', text: 'Vous avez déjà postulé à cette offre.', confirmButtonColor: '#6C63FF' });
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur', text: msg, confirmButtonColor: '#FF6B6B' });
      }
    } finally {
      setApplying(false);
    }
  };

  const getBadgeColor = (type) => {
    switch(type) {
      case 'CDI': return C.green;
      case 'Stage': return C.primary;
      case 'CDD': return C.primaryLight;
      case 'Alternance': return '#FDCB6E';
      default: return C.primary;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '40px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 28 }}>💼 Offres d'Emploi</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>{jobs.length} offres disponibles</p>
          
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Rechercher une offre..."
            style={{
              width: '100%',
              marginTop: 20,
              padding: '14px 20px',
              borderRadius: 50,
              border: 'none',
              fontSize: 15
            }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <select onChange={(e) => setCityFilter(e.target.value)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none' }}>
              <option value="">Toutes les villes</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
        {/* Type Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {jobTypes.map(type => (
            <button 
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '10px 20px',
                borderRadius: 50,
                border: 'none',
                background: filter === type ? C.primary : C.white,
                color: filter === type ? C.white : C.dark,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Chargement...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filteredJobs.map(job => (
              <div key={job.id} style={{ background: C.white, padding: 20, borderRadius: 18, position: 'relative' }}>
                {/* Bouton sauvegarder */}
                <button 
                  onClick={() => saveJob(job)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                                        background: isSaved(job.id) ? C.primaryLight : C.gray,
                    border: 'none',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    cursor: 'pointer',
                    fontSize: 16
                  }}
                >
                  {isSaved(job.id) ? '💾' : '🔖'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ 
                    background: getBadgeColor(job.type) + '20', 
                    color: getBadgeColor(job.type),
                    padding: '4px 12px', 
                    borderRadius: 50, 
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    {job.type}
                  </span>
                  <span style={{ fontWeight: 700, color: C.green }}>{job.salary}</span>
                </div>
                
                <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{job.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>🏢 {job.company} • 📍 {job.city}</p>
                <p style={{ fontSize: 14, color: C.dark, marginBottom: 12 }}>{job.description}</p>
                
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {parseSkills(job.skills).map((skill, i) => (
                    <span key={i} style={{ background: C.gray, padding: '4px 10px', borderRadius: 50, fontSize: 11 }}>{skill}</span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: C.muted, fontSize: 12, marginBottom: 12 }}>
                  <span>👁️ {job.views} vues</span>
                  <span>Posté aujourd'hui</span>
                </div>

                {/* Bouton Postuler */}
                <button 
                  onClick={() => applyToJob(job)}
                  disabled={applying}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    borderRadius: 10, 
                    border: 'none', 
                    background: applying ? '#ccc' : C.primary, 
                    color: C.white, 
                    fontWeight: 700, 
                    cursor: applying ? 'not-allowed' : 'pointer',
                    marginBottom: 8
                  }}
                >
                  {applying ? '📨 Envoi...' : '📨 Postuler'}
                </button>

                {/* Lien chat avec recruteur */}
                <button 
                  onClick={() => {
                    // Stocke le recruteur ciblé pour que Chat.jsx l'ouvre automatiquement
                    const recruiter = {
                      id: job.id,
                      name: job.company + ' RH',
                      company: job.company,
                      avatar: job.company.substring(0, 2).toUpperCase(),
                      role: 'recruiter'
                    };
                    localStorage.setItem('contactRecruiter', JSON.stringify(recruiter));
                    navigate('/chat');
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    borderRadius: 10, 
                    border: `1px solid ${C.green}`,
                    background: 'transparent', 
                    color: C.green, 
                    fontWeight: 600, 
                    cursor: 'pointer'
                  }}
                >
                  💬 Contacter le recruteur
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}