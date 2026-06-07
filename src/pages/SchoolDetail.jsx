import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Reviews from '../components/Reviews';
import { schoolAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const SchoolDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [applying, setApplying] = useState(false);

  // Données locales
  const schoolData = {
    'ensa-fes': {
      id: 1,
      name: 'ENSA Fès',
      city: 'Fès',
      type: 'Public',
      rating: 92,
      reviews: 234,
      description: "L'École Nationale des Sciences Appliquées de Fès propose des formations d'excellence en ingénierie. Fondée en 1993, elle fait partie du réseau des ENSA au Maroc.",
      programs: [
        { name: 'Génie Informatique', duration: '2 ans', seats: 40, req: 'BAC+2 Sciences Math' },
        { name: 'Génie Civile', duration: '2 ans', seats: 35, req: 'BAC+2 Sciences Math' },
        { name: 'Génie Mécanique', duration: '2 ans', seats: 30, req: 'BAC+2 Sciences Math' }
      ],
      reviewsList: [
        { id: 1, user: 'Ayoub M.', avatar: 'A', rating: 5, comment: 'Excellente école! Les profs sont très qualifiés et les labs sont bien équipés.', date: '15 Jan 2025', helpful: 12 },
        { id: 2, user: 'Sarah K.', avatar: 'S', rating: 4, comment: 'Bon cadre de vie étudiant. Les locaux pourraient être améliorés.', date: '2 Déc 2024', helpful: 8 }
      ]
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setSchool(schoolData[slug] || schoolData['ensa-fes']);
      setLoading(false);
    }, 300);
  }, [slug]);

  const handleSave = () => {
    setSaved(!saved);
    // Sauvegarder dans localStorage
    const savedSchools = JSON.parse(localStorage.getItem('savedSchools') || '[]');
    if (!saved) {
      savedSchools.push(school?.id);
    } else {
      const index = savedSchools.indexOf(school?.id);
      if (index > -1) savedSchools.splice(index, 1);
    }
    localStorage.setItem('savedSchools', JSON.stringify(savedSchools));
  };

  const applyToSchool = async () => {
    if (!user) { navigate('/login'); return; }
    if (applying) return;
    setApplying(true);
    try {
      const res = await schoolAPI.apply(school.id);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Candidature envoyée !', text: `Votre candidature a été envoyée à ${school.name}. L'école vous contactera bientôt.`, confirmButtonColor: '#4CAF50' });
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur', text: res.error || 'Erreur lors de la candidature', confirmButtonColor: '#FF6B6B' });
      }
    } catch (err) {
      const status = err.response?.status;
      const errorMsg = err.response?.data?.error || 'Erreur lors de la candidature';
      if (status === 409) {
        Swal.fire({ icon: 'info', title: 'Déjà postulé', text: errorMsg, confirmButtonColor: '#6C63FF' });
      } else if (status === 404) {
        Swal.fire({ icon: 'error', title: 'École introuvable', text: errorMsg, confirmButtonColor: '#FF6B6B' });
      } else if (status === 401) {
        navigate('/login');
      } else {
        Swal.fire({ icon: 'error', title: 'Erreur', text: errorMsg, confirmButtonColor: '#FF6B6B' });
      }
    } finally {
      setApplying(false);
    }
  };

  // Vérifier si sauvegardé
  useEffect(() => {
    const savedSchools = JSON.parse(localStorage.getItem('savedSchools') || '[]');
    if (savedSchools.includes(school?.id)) {
      setSaved(true);
    }
  }, [school]);

  if (loading) {
    return <div className="flex-center" style={{ padding: '100px 20px' }}>Chargement...</div>;
  }

  if (!school) {
    return (
      <div className="flex-center" style={{ padding: '100px 20px', flexDirection: 'column', gap: 16 }}>
        <p>École non trouvée</p>
        <Link to="/schools" className="btn btn-primary">Retour aux écoles</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '80px 20px' }}>
      <div className="container">
        <Link to="/schools" style={{ color: '#6C63FF' }}>← Retour aux écoles</Link>
        
        <div className="grid grid-2" style={{ gap: 24, marginTop: 16 }}>
          {/* Main Content */}
          <div>
            <div className="card" style={{ padding: 28 }}>
              <div className="flex" style={{ gap: 16, marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#6C63FF15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  🏫
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontWeight: 900, fontSize: 24 }}>{school.name}</h1>
                  <p className="text-muted">📍 {school.city} • {school.type}</p>
                </div>
                <span className="badge badge-primary" style={{ fontSize: 18, padding: '8px 16px' }}>{school.rating}%</span>
              </div>
              
              <p style={{ lineHeight: 1.7, marginBottom: 20 }}>{school.description}</p>
              
              {/* Tabs */}
              <div className="flex" style={{ gap: 4, marginBottom: 20, background: '#f8f9ff', borderRadius: 12, padding: 4 }}>
                <button onClick={() => setActiveTab('info')} style={{ flex: 1, padding: '10px', borderRadius: 8, background: activeTab === 'info' ? '#6C63FF' : 'transparent', color: activeTab === 'info' ? '#fff' : '#888', fontWeight: 600 }}>📚 Filières</button>
                <button onClick={() => setActiveTab('reviews')} style={{ flex: 1, padding: '10px', borderRadius: 8, background: activeTab === 'reviews' ? '#6C63FF' : 'transparent', color: activeTab === 'reviews' ? '#fff' : '#888', fontWeight: 600 }}>⭐ Avis</button>
              </div>
              
              {activeTab === 'info' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {school.programs.map((prog, i) => (
                    <div key={i} className="flex-between" style={{ padding: '12px 16px', background: '#f8f9ff', borderRadius: 12 }}>
                      <div>
                        <span style={{ fontWeight: 600 }}>{prog.name}</span>
                        <span className="text-muted" style={{ fontSize: 11, marginLeft: 8 }}>• {prog.req}</span>
                      </div>
                      <span className="text-muted">{prog.duration} • {prog.seats} places</span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'reviews' && <Reviews type="school" itemId={school.id} reviews={school.reviewsList} />}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <button onClick={handleSave} className={saved ? "btn btn-primary" : "btn btn-outline"} style={{ width: '100%', marginBottom: 12 }}>
                {saved ? '❤️ Sauvegardé' : '🤍 Sauvegarder'}
              </button>
              <button onClick={applyToSchool} disabled={applying} className="btn btn-primary" style={{ width: '100%' }}>
                {applying ? '📨 Envoi...' : '📝 Postuler maintenant'}
              </button>
            </div>
            
            {/* Stats rapides */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📊 Statistiques</h3>
              <div className="grid grid-2" style={{ gap: 16 }}>
                <div className="text-center" style={{ padding: 12, background: '#f8f9ff', borderRadius: 12 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#6C63FF' }}>92%</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Satisfaction</div>
                </div>
                <div className="text-center" style={{ padding: 12, background: '#f8f9ff', borderRadius: 12 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#00B894' }}>85%</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Emplois</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDetail;