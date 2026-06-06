import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Reviews from '../components/Reviews';
import { jobAPI } from '../api/api';

const JobDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  // Associe chaque offre à son recruteur (simule les données du backend)
  const recruitersMap = {
    'dev-react-techco': { id: 1, name: 'TechCo RH', company: 'TechCo', avatar: 'TC', email: 'rh@techco.ma' },
    'data-scientist': { id: 2, name: 'DataCorp Recrutement', company: 'DataCorp', avatar: 'DC', email: 'recrutement@datacorp.ma' },
    'devops': { id: 3, name: 'CloudTech HR', company: 'CloudTech', avatar: 'CT', email: 'hr@cloudtech.ma' },
  };

  const jobData = {
    'dev-react-techco': {
      id: 1,
      title: 'Développeur React.js',
      company: 'TechCo',
      companyLogo: '🏢',
      city: 'Casablanca',
      type: 'Stage',
      salary: '3000 DH',
      duration: '6 mois',
      startDate: '01 Mars 2025',
      views: 156,
      applications: 12,
      recruiterId: 1,
      description: 'Nous cherchons un développeur stage motivé pour rejoindre notre équipe tech.',
      missions: [
        'Développer de nouvelles fonctionnalités',
        'Collaborer avec l\'équipe design',
        'Participer aux code reviews',
        'Maintenir la documentation technique'
      ],
      requirements: ['Maîtrise de React.js', 'JavaScript ES6+', 'CSS/SCSS', 'Git'],
      benefits: ['Gratification de stage', 'Tickets restaurant', 'Télétravail possible', 'Possibilité d\'embauche'],
      reviewsList: [
        { id: 1, user: 'Youssef B.', avatar: 'Y', rating: 5, comment: 'Excellent stage!', date: '10 Jan 2025', helpful: 8 },
        { id: 2, user: 'Nadia A.', avatar: 'N', rating: 4, comment: 'Bonne expérience.', date: '5 Déc 2024', helpful: 5 }
      ]
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setJob(jobData[slug] || jobData['dev-react-techco']);
      setLoading(false);
    }, 300);
  }, [slug]); // eslint-disable-line

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('myApplications') || '[]');
    if (applications.includes(job?.id)) {
      setApplied(true);
    }
  }, [job]);

  const handleApply = async () => {
    if (applied || applying) return;
    setApplying(true);
    try {
      const result = await jobAPI.apply(job.id);
      if (result.success) {
        const apps = JSON.parse(localStorage.getItem('myApplications') || '[]');
        apps.push({ id: Date.now(), jobId: job.id, status: 'pending', date: new Date().toISOString() });
        localStorage.setItem('myApplications', JSON.stringify(apps));
        setApplied(true);
      } else {
        alert('❌ ' + (result.message || 'Erreur lors de la candidature'));
      }
    } catch (err) {
      if (err.response?.status === 409) {
        alert('⚠️ Vous avez déjà postulé à cette offre.');
        setApplied(true);
      } else {
        const msg = err.response?.data?.message || err.message || 'Erreur inconnue';
        alert('❌ ' + msg);
      }
    } finally {
      setApplying(false);
    }
  };

  const handleContactRecruiter = () => {
    const recruiter = job ? recruitersMap[Object.keys(recruitersMap).find(k => recruitersMap[k].id === job.recruiterId)] : null;
    if (recruiter) {
      // Stocke le recruteur ciblé pour que Chat.jsx puisse l'ouvrir
      localStorage.setItem('contactRecruiter', JSON.stringify(recruiter));
    }
    navigate('/chat');
  };

  const getBadgeColor = (type) => {
    switch(type) {
      case 'Stage': return 'badge-amber';
      case 'CDI': return 'badge-green';
      case 'CDD': return 'badge-primary';
      case 'Alternance': return 'badge-amber';
      default: return 'badge-primary';
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ padding: '100px 20px' }}>Chargement...</div>;
  }

  if (!job) {
    return (
      <div className="flex-center" style={{ padding: '100px 20px', flexDirection: 'column', gap: 16 }}>
        <p>Offre non trouvée</p>
        <Link to="/jobs" className="btn btn-primary">Retour aux offres</Link>
      </div>
    );
  }

  const recruiter = recruitersMap[Object.keys(recruitersMap).find(k => recruitersMap[k].id === job.recruiterId)];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '80px 20px' }}>
      <div className="container">
        <Link to="/jobs" style={{ color: '#6C63FF' }}>← Retour aux offres</Link>

        <div className="grid grid-2" style={{ gap: 24, marginTop: 16 }}>
          {/* Main Content */}
          <div>
            <div className="card" style={{ padding: 28 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <span className={`badge ${getBadgeColor(job.type)}`}>{job.type}</span>
                <span style={{ fontWeight: 700, color: '#00B894' }}>💰 {job.salary}</span>
              </div>

              <h1 style={{ fontWeight: 900, fontSize: 24, marginBottom: 8 }}>{job.title}</h1>
              <p style={{ marginBottom: 20 }}>🏢 {job.company} • 📍 {job.city}</p>

              <p style={{ lineHeight: 1.7, marginBottom: 20 }}>{job.description}</p>

              <div className="flex" style={{ gap: 4, marginBottom: 20, background: '#f8f9ff', borderRadius: 12, padding: 4 }}>
                <button onClick={() => setActiveTab('info')} style={{ flex: 1, padding: '10px', borderRadius: 8, background: activeTab === 'info' ? '#6C63FF' : 'transparent', color: activeTab === 'info' ? '#fff' : '#888', fontWeight: 600 }}>📋 Détails</button>
                <button onClick={() => setActiveTab('reviews')} style={{ flex: 1, padding: '10px', borderRadius: 8, background: activeTab === 'reviews' ? '#6C63FF' : 'transparent', color: activeTab === 'reviews' ? '#fff' : '#888', fontWeight: 600 }}>💬 Avis</button>
              </div>

              {activeTab === 'info' && (
                <>
                  <h3 style={{ fontWeight: 800, marginBottom: 12 }}>📋 Missions</h3>
                  <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
                    {job.missions.map((m, i) => (
                      <li key={i} style={{ marginBottom: 8, color: '#555' }}>{m}</li>
                    ))}
                  </ul>

                  <h3 style={{ fontWeight: 800, marginBottom: 12 }}>✅ Prérequis</h3>
                  <ul style={{ marginBottom: 20, paddingLeft: 20 }}>
                    {job.requirements.map((r, i) => (
                      <li key={i} style={{ marginBottom: 8, color: '#555' }}>{r}</li>
                    ))}
                  </ul>

                  <h3 style={{ fontWeight: 800, marginBottom: 12 }}>✨ Avantages</h3>
                  <div className="grid grid-2" style={{ gap: 8, marginBottom: 20 }}>
                    {job.benefits.map((b, i) => (
                      <div key={i} className="flex" style={{ gap: 8 }}>
                        <span style={{ color: '#00B894' }}>✓</span>
                        <span style={{ fontSize: 14 }}>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex" style={{ gap: 20 }}>
                    <div><span className="text-muted">📅 Début:</span> <strong>{job.startDate}</strong></div>
                    <div><span className="text-muted">⏱️ Durée:</span> <strong>{job.duration}</strong></div>
                  </div>
                </>
              )}

              {activeTab === 'reviews' && <Reviews type="job" itemId={job.id} reviews={job.reviewsList} />}

              <div style={{ marginTop: 24 }}>
                {applied ? (
                  <button className="btn btn-primary" style={{ width: '100%', background: '#00B894' }}>
                    ✓ Candidature envoyée!
                  </button>
                ) : (
                  <button onClick={handleApply} disabled={applying} className="btn btn-primary" style={{ width: '100%', opacity: applying ? 0.6 : 1, cursor: applying ? 'not-allowed' : 'pointer' }}>
                    {applying ? '📨 Envoi...' : 'Postuler maintenant'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, marginBottom: 16 }}>🏢 {job.company}</h3>
              <div className="flex" style={{ gap: 12, marginBottom: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: '#6C63FF15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {job.companyLogo}
                </div>
                <div>
                  <div style={{ fontWeight: 800 }}>{job.company}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>{job.city} · Tech</div>
                </div>
              </div>
              <button className="btn btn-outline" style={{ width: '100%' }}>Voir le profil</button>
            </div>

            {/* Contacter le recruteur */}
            {recruiter && (
              <div className="card" style={{ padding: 24, marginBottom: 20, border: '1px solid #6C63FF20' }}>
                <h3 style={{ fontWeight: 800, marginBottom: 12 }}>💬 Contacter le recruteur</h3>
                <div className="flex" style={{ gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: '#6C63FF', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 16
                  }}>
                    {recruiter.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{recruiter.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{recruiter.company}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{recruiter.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleContactRecruiter}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10,
                    border: 'none', background: '#6C63FF', color: '#fff',
                    fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  💬 Envoyer un message
                </button>
              </div>
            )}

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📊 Statistiques</h3>
              <div className="grid grid-2" style={{ gap: 12 }}>
                <div className="text-center" style={{ padding: 12, background: '#f8f9ff', borderRadius: 12 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#6C63FF' }}>{job.views}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Vues</div>
                </div>
                <div className="text-center" style={{ padding: 12, background: '#f8f9ff', borderRadius: 12 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#00B894' }}>{job.applications}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Candidatures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;