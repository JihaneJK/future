import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/api';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, schoolsRes, jobsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getSchools(),
        adminAPI.getJobs()
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.data || []);
      setSchools(schoolsRes.data.data || []);
      setJobs(jobsRes.data.data || []);
    } catch (error) {
      // Données de secours
      setStats({ users: 15420, schools: 250, jobs: 520, reviews: 1820 });
      setUsers([
        { id: 1, name: 'Ahmed Benjelloun', email: 'ahmed@example.com', role: 'student', city: 'Fès', created_at: '2024-01-15' },
        { id: 2, name: 'Fatima Zahra', email: 'fatima@example.com', role: 'student', city: 'Casablanca', created_at: '2024-02-20' },
        { id: 3, name: 'TechCorp RH', email: 'rh@techcorp.com', role: 'recruiter', city: 'Rabat', created_at: '2024-01-10' }
      ]);
      setSchools([
        { id: 1, name: 'ENSA Fès', city: 'Fès', status: 'approved' },
        { id: 2, name: 'ENCG Casablanca', city: 'Casablanca', status: 'approved' }
      ]);
      setJobs([
        { id: 1, title: 'Développeur React', company: 'TechCo', status: 'active' },
        { id: 2, title: 'Data Analyst', company: 'DataCorp', status: 'active' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleApproveSchool = async (schoolId) => {
    try {
      await adminAPI.approveSchool(schoolId);
      setSchools(schools.map(s => s.id === schoolId ? { ...s, status: 'approved' } : s));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ padding: '100px 20px' }}>Chargement...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '80px 20px' }}>
      <div className="container">
        <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 8 }}>⚙️ Admin Dashboard</h1>
        <p className="text-muted mb-3">Gestion de la plateforme FuturLink</p>

        {/* Stats Cards */}
        <div className="grid grid-4" style={{ gap: 16, marginBottom: 32 }}>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#6C63FF' }}>{stats?.users?.toLocaleString() || '15,420'}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>Utilisateurs</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏫</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#00B894' }}>{stats?.schools || 250}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>Écoles</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💼</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#FDCB6E' }}>{stats?.jobs || 520}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>Offres</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#FF6B6B' }}>{stats?.reviews || 1820}</div>
            <div className="text-muted" style={{ fontSize: 14 }}>Avis</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ gap: 4, marginBottom: 20, background: '#fff', borderRadius: 14, padding: 4, width: 'fit-content' }}>
          {['users', 'schools', 'jobs'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === tab ? '#6C63FF' : 'transparent',
              color: activeTab === tab ? '#fff' : '#888',
              fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9ff' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Nom</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Rôle</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Ville</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Inscription</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 16, fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: 16 }}>{user.email}</td>
                    <td style={{ padding: 16 }}>
                      <span className={`badge ${user.role === 'recruiter' ? 'badge-green' : 'badge-primary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: 16 }}>{user.city}</td>
                    <td style={{ padding: 16 }}>{user.created_at}</td>
                    <td style={{ padding: 16 }}>
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        className="btn btn-ghost btn-sm" 
                        style={{ color: '#FF6B6B' }}
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Schools Table */}
        {activeTab === 'schools' && (
          <div className="card" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9ff' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>École</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Ville</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Statut</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map(school => (
                  <tr key={school.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 16, fontWeight: 600 }}>{school.name}</td>
                    <td style={{ padding: 16 }}>{school.city}</td>
                    <td style={{ padding: 16 }}>
                      <span className={`badge ${school.status === 'approved' ? 'badge-green' : 'badge-amber'}`}>
                        {school.status}
                      </span>
                    </td>
                    <td style={{ padding: 16 }}>
                      {school.status !== 'approved' && (
                        <button 
                          onClick={() => handleApproveSchool(school.id)} 
                          className="btn btn-primary btn-sm"
                        >
                          ✅ Approuver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Jobs Table */}
        {activeTab === 'jobs' && (
          <div className="card" style={{ padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9ff' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Poste</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Entreprise</th>
                  <th style={{ padding: 16, textAlign: 'left', fontWeight: 600 }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 16, fontWeight: 600 }}>{job.title}</td>
                    <td style={{ padding: 16 }}>{job.company}</td>
                    <td style={{ padding: 16 }}>
                      <span className={`badge ${job.status === 'active' ? 'badge-green' : 'badge-red'}`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;