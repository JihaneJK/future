import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { recruiterAPI, messageAPI, notificationAPI } from '../api/api';

const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  red: "#FF6B6B",
  redLight: "#FFF0F0",
  amber: "#FDCB6E",
  amberLight: "#FFFBEE",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

export default function Recruiter() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedConv, setSelectedConv] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConv?.messages]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Stage',
    city: '',
    salary: '',
    skills: ''
  });

  // Charger toutes les données au montage
  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData, convsData, notifsData, unreadData] = await Promise.all([
        recruiterAPI.getMyJobs(),
        recruiterAPI.getAllApplications().catch(() => []),
        messageAPI.getConversations().catch(() => []),
        notificationAPI.getAll().catch(() => []),
        notificationAPI.getUnreadCount().catch(() => ({ count: 0 }))
      ]);

      setJobs(jobsData || []);
      setApplications(appsData || []);
      setConversations(formatConversations(convsData || [], user));
      setNotifications(notifsData || []);
      setUnreadCount(unreadData?.count || 0);
    } catch (err) {
      console.warn('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // Polling notifications + conversations toutes les 10s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const [notifsData, unreadData, convsData] = await Promise.all([
          notificationAPI.getAll().catch(() => []),
          notificationAPI.getUnreadCount().catch(() => ({ count: 0 })),
          messageAPI.getConversations().catch(() => [])
        ]);
        setNotifications(notifsData || []);
        setUnreadCount(unreadData?.count || 0);
        if (convsData.length > 0) {
          setConversations(formatConversations(convsData, user));
        }
      } catch (e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const formatConversations = (convs, currentUser) => {
    return (convs || []).map(c => ({
      id: c.user.id,
      name: c.user.name,
      avatar: c.user.avatar,
      lastMessage: c.last_message || 'Aucun message',
      time: c.last_time ? new Date(c.last_time).toLocaleDateString('fr-FR') : '',
      unread: c.unread || false,
      messages: (c.messages || []).map(m => ({
        id: m.id,
        role: m.sender_id === currentUser?.id ? 'assistant' : 'user',
        content: m.message || m.text,
        time: m.created_at
          ? new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          : ''
      }))
    }));
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.active !== false).length,
    totalCandidates: applications.length,
    totalViews: jobs.reduce((a, j) => a + (j.views || 0), 0)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newJob = await recruiterAPI.createJob({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        city: formData.city,
        salary: formData.salary,
        skills: formData.skills,
        company: user?.company || ''
      });
      if (newJob.success !== false) {
        setJobs(prev => [newJob.job || newJob, ...prev]);
      } else {
        setJobs(prev => [newJob, ...prev]);
      }
      setShowForm(false);
      setFormData({ title: '', description: '', type: 'Stage', city: '', salary: '', skills: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de la création';
      alert('❌ ' + msg);
      console.warn('Erreur création annonce:', err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette annonce?')) return;
    try {
      await recruiterAPI.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.warn('Erreur suppression:', err);
    }
  };

  const toggleStatus = async (jobId, currentStatus) => {
    try {
      const updated = await recruiterAPI.updateJob(jobId, { active: !currentStatus });
      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
    } catch (err) {
      console.warn('Erreur mise à jour statut:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;

    const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConv.id) {
        return {
          ...c,
          messages: [...c.messages, { id: Date.now(), role: 'assistant', content: newMessage, time: currentTime }],
          lastMessage: newMessage,
          time: 'Maintenant'
        };
      }
      return c;
    }));
    setSelectedConv(prev => ({
      ...prev,
      messages: [...prev.messages, { id: Date.now(), role: 'assistant', content: newMessage, time: currentTime }],
      lastMessage: newMessage,
      time: 'Maintenant'
    }));
    setNewMessage('');

    try {
      await messageAPI.sendMessage(selectedConv.id, newMessage);
    } catch (err) {
      console.warn('Erreur envoi message:', err);
    }
  };

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      await recruiterAPI.updateApplicationStatus(applicationId, status);
      setApplications(prev => prev.map(a =>
        a.id === applicationId ? { ...a, status } : a
      ));
    } catch (err) {
      console.warn('Erreur mise à jour candidature:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '24px 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ color: C.white, fontWeight: 900, fontSize: 24 }}>🏢 Espace Recruteur</h1>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 22,
                      position: 'relative',
                      color: C.white
                    }}
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: -4,
                        right: -6,
                        background: C.red,
                        color: C.white,
                        borderRadius: 50,
                        width: 18,
                        height: 18,
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifs && (
                    <div style={{
                      position: 'absolute',
                      top: 36,
                      left: 0,
                      width: 340,
                      maxHeight: 400,
                      overflowY: 'auto',
                      background: C.white,
                      borderRadius: 14,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      zIndex: 3000,
                      padding: 8
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: '1px solid #eee' }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={async () => {
                              await notificationAPI.markAllRead();
                              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                              setUnreadCount(0);
                            }}
                            style={{ background: 'none', border: 'none', color: C.primary, fontSize: 12, cursor: 'pointer' }}
                          >
                            Tout marquer lu
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>
                          Aucune notification
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={async () => {
                              if (!n.read) {
                                await notificationAPI.markAsRead(n.id);
                                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                                setUnreadCount(prev => Math.max(0, prev - 1));
                              }
                              setShowNotifs(false);
                              if (n.type === 'message') setActiveTab('messages');
                              if (n.type === 'application') setActiveTab('candidates');
                            }}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 10,
                              cursor: 'pointer',
                              background: n.read ? 'transparent' : C.primaryLight,
                              borderBottom: '1px solid #f5f5f5'
                            }}
                          >
                            <div style={{ display: 'flex', gap: 10 }}>
                              <span style={{ fontSize: 18 }}>
                                {n.type?.startsWith('application') ? '📋' : n.type === 'message' ? '💬' : '🔔'}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: n.read ? 400 : 700, fontSize: 13, color: C.dark }}>
                                  {n.type === 'message' ? `Message de ${n.data?.sender_name || 'quelqu\'un'}` :
                                   n.type === 'application' ? 'Nouvelle candidature' :
                                   n.type === 'application_accepted' ? 'Candidature acceptée' :
                                   n.type === 'application_rejected' ? 'Candidature refusée' :
                                   'Notification'}
                                </div>
                                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                                  {n.type === 'message' ? (n.data?.preview || 'Nouveau message reçu') :
                                   n.type === 'application' ? `${n.data?.student_name || 'Un étudiant'} a postulé à ${n.data?.job_title || 'une offre'}` :
                                   n.data?.job_title || ''}
                                </div>
                                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                                  {n.created_at ? new Date(n.created_at).toLocaleString('fr-FR') : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 4 }}>Gérez vos offres et candidats</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: C.primary,
                color: C.white,
                border: 'none',
                borderRadius: 50,
                padding: '12px 24px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              + Publier une annonce
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: C.white, padding: 20, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.primary }}>{stats.totalJobs}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Total annonces</div>
          </div>
          <div style={{ background: C.white, padding: 20, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{stats.activeJobs}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Actives</div>
          </div>
          <div style={{ background: C.white, padding: 20, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.amber }}>{stats.totalCandidates}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Candidatures</div>
          </div>
          <div style={{ background: C.white, padding: 20, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>👁️</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: C.red }}>{stats.totalViews}</div>
            <div style={{ fontSize: 12, color: C.muted }}>Vues</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: C.white, borderRadius: 14, padding: 4, width: 'fit-content' }}>
          {[
            { id: 'jobs', label: '📋 Mes annonces' },
            { id: 'candidates', label: '👥 Candidatures' },
            { id: 'messages', label: '💬 Messages' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.id ? C.primary : 'transparent',
                color: activeTab === tab.id ? C.white : C.muted,
                fontWeight: 600,
                fontSize: 14
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'jobs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {jobs.length === 0 ? (
              <div style={{ background: C.white, padding: 40, borderRadius: 18, textAlign: 'center', gridColumn: '1 / -1' }}>
                <p style={{ color: C.muted }}>Aucune annonce pour le moment.</p>
                <button onClick={() => setShowForm(true)} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 50, border: 'none', background: C.primary, color: C.white, fontWeight: 600, cursor: 'pointer' }}>
                  + Publier une annonce
                </button>
              </div>
            ) : (
              jobs.map(job => {
                const isActive = job.active !== false;
                return (
                  <div key={job.id} style={{ background: C.white, padding: 20, borderRadius: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: C.dark }}>{job.title}</h3>
                      <span style={{
                        background: isActive ? C.greenLight : C.redLight,
                        color: isActive ? C.green : C.red,
                        padding: '4px 12px',
                        borderRadius: 50,
                        fontSize: 12,
                        fontWeight: 700
                      }}>
                        {isActive ? 'Active' : 'Fermée'}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
                      {job.type} • {job.city} • {job.salary}
                    </p>
                    <p style={{ fontSize: 14, color: C.dark, marginBottom: 16 }}>{job.description}</p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13 }}>
                      <span>👥 <strong>{job.applications_count || 0}</strong> candidats</span>
                      <span>👁️ <strong>{job.views || 0}</strong> vues</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => toggleStatus(job.id, isActive)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${C.primary}`, background: 'transparent', color: C.primary, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                        {isActive ? 'Fermer' : 'Rouvrir'}
                      </button>
                      <button onClick={() => handleDelete(job.id)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${C.red}`, background: 'transparent', color: C.red, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'candidates' && (
          <div style={{ background: C.white, padding: 24, borderRadius: 18 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>
              👥 Candidatures reçues
              {applications.length > 0 && (
                <span style={{ fontSize: 14, color: C.muted, fontWeight: 400, marginLeft: 8 }}>
                  ({applications.length} total)
                </span>
              )}
            </h3>

            {applications.length === 0 ? (
              <p style={{ color: C.muted, textAlign: 'center', padding: 40 }}>
                Aucune candidature pour le moment.
              </p>
            ) : (
              applications.map((app, i) => (
                <div key={app.id || i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: i < applications.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.primary }}>
                    {app.user?.first_name?.charAt(0)}{app.user?.last_name?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {app.user?.first_name} {app.user?.last_name}
                    </div>
                    <div style={{ fontSize: 13, color: C.muted }}>
                      {app.job_title || 'Offre'} • {app.created_at ? new Date(app.created_at).toLocaleDateString('fr-FR') : ''}
                    </div>
                    <div style={{ fontSize: 12, color: app.status === 'accepted' ? C.green : app.status === 'rejected' ? C.red : C.amber, fontWeight: 600, marginTop: 4 }}>
                      {app.status === 'accepted' ? '✓ Acceptée' : app.status === 'rejected' ? '✕ Refusée' : '⏳ En attente'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {app.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleApplicationStatus(app.id, 'accepted')}
                          style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: C.green, color: C.white, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          ✓ Accepter
                        </button>
                        <button
                          onClick={() => handleApplicationStatus(app.id, 'rejected')}
                          style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: C.red, color: C.white, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          ✕ Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, background: C.white, borderRadius: 18, overflow: 'hidden', height: 500 }}>
            <div style={{ borderRight: '1px solid #eee', overflowY: 'auto' }}>
              <div style={{ padding: 16, borderBottom: '1px solid #eee' }}>
                <h3 style={{ fontWeight: 800 }}>💬 Messages</h3>
              </div>
              {conversations.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: C.muted }}>
                  Aucune conversation
                </div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConv(conv)}
                    style={{
                      padding: 14,
                      cursor: 'pointer',
                      borderBottom: '1px solid #f5f5f5',
                      background: selectedConv?.id === conv.id ? C.primaryLight : 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: conv.unread ? C.primary : C.gray,
                        color: conv.unread ? C.white : C.muted,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                        flexShrink: 0
                      }}>
                        {conv.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: conv.unread ? 700 : 600, fontSize: 14 }}>{conv.name}</span>
                          <span style={{ fontSize: 11, color: C.muted }}>{conv.time}</span>
                        </div>
                        <p style={{ fontSize: 12, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {selectedConv ? (
                <>
                  <div style={{ padding: 16, borderBottom: '1px solid #eee', flexShrink: 0 }}>
                    <h3 style={{ fontWeight: 800 }}>{selectedConv.name}</h3>
                    <span style={{ fontSize: 12, color: C.green }}>● En ligne</span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                      {selectedConv.messages.length === 0 ? (
                      <div style={{ textAlign: 'center', color: C.muted, padding: 20 }}>
                        Aucun message. Envoyez votre premier message.
                      </div>
                    ) : (
                      selectedConv.messages.map(msg => (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            padding: '12px 16px',
                            borderRadius: 18,
                            background: msg.role === 'user' ? C.primary : C.gray,
                            color: msg.role === 'user' ? C.white : C.dark
                          }}
                        >
                          <p style={{ marginBottom: 4 }}>{msg.content}</p>
                          <span style={{ fontSize: 10, opacity: 0.7 }}>{msg.time}</span>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div style={{ padding: 16, borderTop: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Tapez votre message..."
                        rows={1}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: 25,
                          border: '1px solid #eee',
                          outline: 'none',
                          fontSize: 14,
                          resize: 'none',
                          fontFamily: 'inherit',
                          lineHeight: 1.4,
                          minHeight: 44
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        style={{
                          background: C.primary,
                          color: C.white,
                          border: 'none',
                          borderRadius: '50%',
                          width: 44,
                          height: 44,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                          opacity: newMessage.trim() ? 1 : 0.5,
                          flexShrink: 0
                        }}
                      >
                        ➤
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 48 }}>💬</div>
                  <p style={{ color: C.muted }}>Sélectionnez une conversation</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{ background: C.white, borderRadius: 18, padding: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 900 }}>📝 Publier une annonce</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Titre du poste *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #eee', fontSize: 14 }}
                  placeholder="Développeur React.js"
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #eee', fontSize: 14, minHeight: 100 }}
                  placeholder="Décrivez le poste, les missions, les qualités requises..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #eee', fontSize: 14 }}
                    required
                  >
                    <option value="Stage">Stage</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Alternance">Alternance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Ville *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #eee', fontSize: 14 }}
                    placeholder="Casablanca"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Salaire</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #eee', fontSize: 14 }}
                  placeholder="5000-10000 DH"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13 }}>Compétences (séparées par virgule)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #eee', fontSize: 14 }}
                  placeholder="React, JavaScript, CSS, Git"
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 50,
                    border: `1px solid ${C.primary}`,
                    background: 'transparent',
                    color: C.primary,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 50,
                    border: 'none',
                    background: C.primary,
                    color: C.white,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ✅ Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
