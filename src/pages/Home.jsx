import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const stats = [
    { number: '250+', label: 'Écoles' },
    { number: '1200+', label: 'Formations' },
    { number: '500+', label: 'Offres' },
    { number: '15K+', label: 'Étudiants' }
  ];

  const features = [
    { icon: '🤖', title: 'AI Advisor', desc: 'IA qui analyse votre profil et recommande la meilleure orientation.', color: '#6C63FF' },
    { icon: '🏫', title: 'Écoles Post-Bac', desc: 'Toutes les grandes écoles marocaines classées par diplôme et filière.', color: '#00B894' },
    { icon: '💬', title: 'Chat Communauté', desc: 'Échangez avec d\'autres étudiants et des recruteurs.', color: '#FF6B6B' },
    { icon: '🏢', title: 'Offres Recruteurs', desc: 'Des centaines d\'offres de stages et d\'emplois.', color: '#FDCB6E' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #1a2744)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 20px 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.2), transparent)'
        }} />
        
        <div className="container" style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Left Content */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div className="flex" style={{
              background: 'rgba(108,99,255,0.15)',
              borderRadius: 50,
              padding: '8px 16px',
              marginBottom: 24,
              width: 'fit-content'
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6C63FF', marginRight: 8 }} />
              <span style={{ color: '#a89cff', fontSize: 13 }}>Propulsé par IA 🇲🇦</span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
              Votre avenir <span style={{ background: 'linear-gradient(90deg, #6C63FF, #00B894)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>académique & professionnel</span> commence ici
            </h1>
            
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
              FuturLink vous aide à trouver les meilleures écoles, formations et emplois au Maroc grâce à l'IA — de la terminale jusqu'au marché du travail.
            </p>
            
            <div className="flex" style={{ gap: 12 }}>
              {!user && (
                <Link to="/register">
                  <button className="btn btn-primary btn-lg">🚀 Commencer gratuitement</button>
                </Link>
              )}
              <Link to="/schools">
                <button style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 26px', borderRadius: 50, fontWeight: 600 }}>
                  Voir les écoles →
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex" style={{ gap: 32, marginTop: 40 }}>
              {stats.map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{stat.number}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Card */}
          <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 22,
              padding: 24,
              width: 310
            }}>
              <div className="flex" style={{ gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6C63FF, #00B894)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  🤖
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>AI Advisor</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Analyse en cours…</div>
                </div>
                <div style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: '#00B894', boxShadow: '0 0 8px #00B894' }} />
              </div>
              
              <div style={{ background: 'rgba(108,99,255,0.15)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 4 }}>Profil</div>
                <div style={{ color: '#fff', fontSize: 13 }}>Bac Sciences Math • Fès • Passionné de tech</div>
              </div>
              
              {[
                { label: 'Développeur Full Stack', percent: 92, color: '#6C63FF' },
                { label: 'Data Scientist', percent: 78, color: '#00B894' },
                { label: 'UX Designer', percent: 65, color: '#FF6B6B' }
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div className="flex-between" style={{ marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontSize: 12 }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 800, fontSize: 12 }}>{item.percent}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 50, height: 5 }}>
                    <div style={{ width: `${item.percent}%`, height: '100%', borderRadius: 50, background: item.color }} />
                  </div>
                </div>
              ))}
              
              <Link to={user ? "/dashboard" : "/register"}>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                  {user ? 'Voir mon rapport →' : 'Commencer maintenant →'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 20px', background: '#f8f9ff' }}>
        <div className="container">
          <div className="text-center mb-3">
            <span className="badge badge-primary">Fonctionnalités</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginTop: 12 }}>
              Une plateforme complète pour votre orientation
            </h2>
          </div>
          <div className="grid grid-4">
            {features.map((feature, i) => (
              <Link to="/schools" key={i} className="card" style={{ padding: 24 }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: `${feature.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 16 }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontWeight: 800, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: '#888', fontSize: 14 }}>{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 20px' }}>
        <div className="container text-center">
          <div style={{ background: 'linear-gradient(135deg, #EDE9FE, #E8FAF5)', borderRadius: 28, padding: '56px 44px' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🎓</div>
            <h2 style={{ fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 900, marginBottom: 14 }}>
              Prêt à choisir votre avenir ?
            </h2>
            <p style={{ color: '#888', fontSize: 15, marginBottom: 32 }}>
              +15 000 étudiants ont déjà trouvé leur formation idéale. Inscription gratuite.
            </p>
            <div className="flex" style={{ gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!user && (
                <Link to="/register">
                  <button className="btn btn-primary btn-lg">Créer mon compte</button>
                </Link>
              )}
              <Link to="/quiz">
                <button className="btn btn-outline btn-lg">Faire le Quiz IA</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;