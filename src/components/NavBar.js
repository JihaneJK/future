import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../api/api';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [notifCount, setNotifCount] = useState(0);

  // Scroll en haut a chaque changement de page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLastScrollY(0);
  }, [location.pathname]);

  // Polling notifications non lues
  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const data = await notificationAPI.getUnreadCount();
        setNotifCount(data?.count || 0);
      } catch (e) {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Masquer en bas, montrer en haut
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // En train de descend - on cache
      } else {
        // En train de monter - on montre
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  // Liens principaux
  const mainLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/schools', label: 'Écoles' },
    { path: '/jobs', label: 'Offres' }
  ];

  // Liens secondaires - AVEC CV Builder
  const secondaryLinks = [
    { path: '/search', label: 'Recherche' },
    { path: '/quiz', label: 'Ton Avenir' },
    { path: '/advisor', label: 'Advisor IA' },
    { path: '/cv-builder', label: 'CV Builder' },
    { path: '/map', label: 'Carte' }
  ];

  // Fonction pour scroller en haut
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: '#1a1a2e',
      boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
    }}>
      {/* Premiere ligne: Logo + Links principaux + Auth */}
      <div className="container flex-between" style={{ height: 64 }}>
        {/* Logo - Toujours visible */}
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="flex"
          style={{ gap: 10 }}
        >
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6C63FF, #00B894)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18
          }}>
            🔗
          </div>
          <span style={{
            fontWeight: 900,
            fontSize: 20,
            color: '#fff'
          }}>
            Futur<span style={{ color: '#6C63FF' }}>Link</span>
          </span>
        </Link>

        {/* Liens principaux - VISIBLE DES LE DEBUT */}
        <div className="flex hide-mobile" style={{ gap: 8 }}>
          {mainLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={scrollToTop}
              style={{
                padding: '8px 20px',
                borderRadius: 20,
                background: isActive(link.path) ? 'rgba(108,99,255,0.2)' : 'transparent',
                color: isActive(link.path) ? '#6C63FF' : '#fff',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Boutons Auth */}
        <div className="flex" style={{ gap: 12 }}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={scrollToTop} style={{ position: 'relative', textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}>
                  Dashboard
                  {notifCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      background: '#FF6B6B',
                      color: '#fff',
                      borderRadius: 50,
                      width: 18,
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {notifCount}
                    </span>
                  )}
                </button>
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid #FF6B6B',
                  color: '#FF6B6B',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={scrollToTop}>
                <button style={{
                  background: 'transparent',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 13
                }}>
                  Connexion
                </button>
              </Link>
              <Link to="/register" onClick={scrollToTop}>
                <button style={{
                  background: '#6C63FF',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: 20,
                  fontWeight: 600,
                  fontSize: 13
                }}>
                  S'inscrire
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Deuxieme ligne: Links secondaires - AVEC CV Builder */}
      <div className="container flex" style={{ height: 44, background: 'rgba(0,0,0,0.2)' }}>
        <div className="flex" style={{ gap: 4, marginLeft: 'auto', marginRight: 'auto' }}>
          {secondaryLinks.map(link => (
            <Link 
              key={link.path} 
              to={link.path}
              onClick={scrollToTop}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                color: isActive(link.path) ? '#6C63FF' : 'rgba(255,255,255,0.7)',
                fontWeight: 500,
                fontSize: 13,
                transition: 'all 0.2s'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;