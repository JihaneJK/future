import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results] = useState([
    { type: 'school', name: 'ENSA Fès', subtitle: 'École d\'ingénierie • Fès', match: 92 },
    { type: 'school', name: 'ENCG Casablanca', subtitle: 'École de commerce • Casablanca', match: 89 },
    { type: 'job', name: 'Développeur React.js', subtitle: 'TechCo • Casablanca', match: 85 },
    { type: 'job', name: 'Stage Marketing', subtitle: 'MediaPro • Rabat', match: 78 }
  ]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '80px 20px' }}>
      <div className="container">
        <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 24 }}>🔍 Recherche Avancée</h1>

        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div className="grid grid-3" style={{ gap: 12 }}>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="input" placeholder="Rechercher..." />
            <select className="select">
              <option value="">Tous les niveaux</option>
              <option value="bac2">BAC+2</option>
              <option value="bac3">BAC+3</option>
              <option value="bac5">BAC+5</option>
            </select>
            <select className="select">
              <option value="">Toutes les villes</option>
              <option value="casablanca">Casablanca</option>
              <option value="rabat">Rabat</option>
              <option value="fes">Fès</option>
            </select>
          </div>
        </div>

        <p className="text-muted mb-2">{results.length} résultats trouvés</p>

        <div className="grid">
          {results.map((result, i) => (
            <Link key={i} to={result.type === 'school' ? '/schools/1' : '/jobs/1'} className="card" style={{ padding: 20 }}>
              <div className="flex-between">
                <div className="flex" style={{ gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: result.type === 'school' ? '#6C63FF15' : '#00B89415', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {result.type === 'school' ? '🏫' : '💼'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 4 }}>{result.name}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>{result.subtitle}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#6C63FF' }}>{result.match}%</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>Match</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;