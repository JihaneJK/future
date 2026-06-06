import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const links = {
    schools: [
      { label: 'ENSA', path: '/schools?level=bac2' },
      { label: 'ENCG', path: '/schools?level=bac3' },
      { label: 'Écoles Privées', path: '/schools?type=private' }
    ],
    jobs: [
      { label: 'Offres Stage', path: '/jobs?type=stage' },
      { label: 'CDI', path: '/jobs?type=cdi' },
      { label: 'Alternance', path: '/jobs?type=alternance' }
    ],
    company: [
      { label: 'Accueil', path: '/' },
      { label: 'À propos', path: '/about' },
      { label: 'Contact', path: '/contact' }
    ]
  };

  return (
    <footer style={{ background: '#1a1a2e', padding: '48px 20px 24px' }}>
      <div className="container">
        <div className="grid grid-3" style={{ gap: 40, marginBottom: 32 }}>
          {/* Brand */}
          <div>
            <Link to="/" className="flex" style={{ gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6C63FF, #00B894)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                🔗
              </div>
              <span style={{ fontWeight: 900, fontSize: 20, color: '#fff' }}>
                FuturLink
              </span>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>
              Votre plateforme d'orientation académique et professionnelle au Maroc.
            </p>
          </div>

          {/* Écoles */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Écoles</h4>
            <div className="flex" style={{ flexDirection: 'column', gap: 8 }}>
              {links.schools.map((link, i) => (
                <Link key={i} to={link.path} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Offres */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: 16 }}>Offres</h4>
            <div className="flex" style={{ flexDirection: 'column', gap: 8 }}>
              {links.jobs.map((link, i) => (
                <Link key={i} to={link.path} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            © 2025 FuturLink — Fait avec ❤️ pour les étudiants Marocains 🇲🇦
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;