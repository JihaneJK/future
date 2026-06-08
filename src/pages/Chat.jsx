import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recruiterAPI, messageAPI, notificationAPI } from '../api/api';

const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  amber: "#FDCB6E",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

export default function Chat() {
  const { user } = useAuth();
  const location = useLocation();
  const [recruiters, setRecruiters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [conversationsMap, setConversationsMap] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const messagesEndRef = useRef(null);
  const [pageKey, setPageKey] = useState(0);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    setPageKey(prev => prev + 1);
  }, [location.pathname]);

  useEffect(() => {
    if (selectedUser) {
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo(0, 0);
      }, 10);
    }
  }, [selectedUser?.id]);

  const loadInitialData = async () => {
    if (!user) return;
    try {
      const [recruitersData, convs, notifsData, unreadData] = await Promise.all([
        recruiterAPI.getRecruiters().catch(() => []),
        messageAPI.getConversations().catch(() => []),
        notificationAPI.getAll().catch(() => []),
        notificationAPI.getUnreadCount().catch(() => ({ count: 0 }))
      ]);
      setNotifications(notifsData || []);
      setNotifCount(unreadData?.count || 0);

      const formatted = (recruitersData || []).map(r => ({
        id: r.id,
        name: r.name,
        company: r.company,
        city: r.city,
        avatar: r.avatar,
        role: 'recruiter',
        lastMessage: '',
        time: '',
        unread: false,
        online: false
      }));

      const msgsMap = {};
      (convs || []).forEach(c => {
        if (!c.user || c.user.id === user?.id) return;
        if (c.messages) {
          msgsMap[c.user.id] = c.messages;
        }
        const idx = formatted.findIndex(r => r.id === c.user.id);
        const entry = {
          lastMessage: c.last_message || '',
          time: c.last_time ? new Date(c.last_time).toLocaleDateString('fr-FR') : '',
          unread: c.unread || false
        };
        if (idx >= 0) {
          formatted[idx] = { ...formatted[idx], ...entry };
        } else {
          formatted.push({
            id: c.user.id,
            name: c.user.name,
            avatar: c.user.avatar,
            role: 'recruiter',
            ...entry,
            online: false
          });
        }
      });

      setConversationsMap(msgsMap);
      setRecruiters(formatted);

      const contactTarget = localStorage.getItem('contactRecruiter');
      if (contactTarget) {
        const target = JSON.parse(contactTarget);
        localStorage.removeItem('contactRecruiter');
        const existing = formatted.find(r => r.id === target.id);
        if (existing) {
          setSelectedUser(existing);
        } else {
          setSelectedUser(target);
          setRecruiters(prev => [target, ...prev]);
        }
      }
    } catch (err) {
      console.warn('Erreur chargement données:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    const interval = setInterval(async () => {
      try {
        const [convs, notifsData, unreadData] = await Promise.all([
          messageAPI.getConversations(),
          notificationAPI.getAll().catch(() => []),
          notificationAPI.getUnreadCount().catch(() => ({ count: 0 }))
        ]);

        setNotifications(notifsData || []);
        setNotifCount(unreadData?.count || 0);

        if (convs && convs.length > 0) {
          const msgsMap = {};
          convs.forEach(c => {
            if (!c.user || c.user.id === user?.id) return;
            if (c.messages) msgsMap[c.user.id] = c.messages;
          });
          setConversationsMap(msgsMap);
          setRecruiters(prev => {
            const updated = [...prev];
            convs.forEach(c => {
              const idx = updated.findIndex(r => r.id === c.user.id);
              if (idx >= 0) {
                updated[idx] = {
                  ...updated[idx],
                  lastMessage: c.last_message || updated[idx].lastMessage,
                  time: c.last_time ? new Date(c.last_time).toLocaleDateString('fr-FR') : updated[idx].time,
                  unread: c.unread || false
                };
              }
            });
            return updated;
          });
        }
      } catch (e) {}
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // Mettre à jour les messages quand la conversationsMap change
  useEffect(() => {
    if (!selectedUser) {
      setMessages([]);
      return;
    }
    if (selectedUser.id === user?.id) return;
    if (conversationsMap[selectedUser.id]) {
      const msgs = conversationsMap[selectedUser.id].map(m => ({
        id: m.id,
        from: m.sender_id,
        to: m.receiver_id,
        text: m.message || m.text,
        time: m.created_at
          ? new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          : '',
        date: m.created_at
      }));
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser?.id, conversationsMap]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      id: Date.now(),
      from: user?.id || 'guest',
      to: selectedUser.id,
      text: newMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    setRecruiters(prev => prev.map(c =>
      c.id === selectedUser.id
        ? { ...c, lastMessage: newMessage, time: 'Maintenant' }
        : c
    ));

    try {
      await messageAPI.sendMessage(selectedUser.id, newMessage);
    } catch (err) {
      console.warn('Erreur envoi message:', err);
    }
  };

  const handleSelectUser = (conv) => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    setSelectedUser(conv);
    messageAPI.markAsRead(conv.id).catch(() => {});
    setRecruiters(prev => prev.map(c =>
      c.id === conv.id ? { ...c, unread: false } : c
    ));
  };

  const startConversation = (u) => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);

    const existing = recruiters.find(c => c.id === u.id);
    if (existing) {
      setSelectedUser(existing);
    } else {
      setRecruiters(prev => [u, ...prev]);
      setSelectedUser(u);
    }
    setShowNewChat(false);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'recruiter': return C.primary;
      case 'school': return C.green;
      case 'student': return C.amber;
      default: return C.muted;
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'recruiter': return 'Recruteur';
      case 'school': return 'École';
      case 'student': return 'Étudiant';
      default: return 'Utilisateur';
    }
  };

  return (
    <div key={pageKey} style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: 'calc(100vh - 64px)' }}>
        <div style={{ background: C.white, borderRight: '1px solid #eee', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <h2 style={{ fontWeight: 900, fontSize: 18 }}>💬 Messages</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifs(!showNotifs)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 20,
                    position: 'relative'
                  }}
                >
                  🔔
                  {notifCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -6,
                      background: C.primary,
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
                      {notifCount}
                    </span>
                  )}
                </button>

                {showNotifs && (
                  <div style={{
                    position: 'absolute',
                    top: 36,
                    left: -280,
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
                      {notifCount > 0 && (
                        <button
                          onClick={async () => {
                            await notificationAPI.markAllRead();
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                            setNotifCount(0);
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
                              setNotifCount(prev => Math.max(0, prev - 1));
                            }
                            setShowNotifs(false);
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
                                {n.type === 'message' ? `Réponse de ${n.data?.sender_name || 'un recruteur'}` :
                                 n.type === 'application_accepted' ? 'Candidature acceptée 🎉' :
                                 n.type === 'application_rejected' ? 'Candidature refusée' :
                                 'Notification'}
                              </div>
                              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                                {n.type === 'message' ? (n.data?.preview || 'Nouvelle réponse reçue') :
                                 n.type === 'application_accepted' ? 'Félicitations ! Votre candidature a été acceptée.' :
                                 n.type === 'application_rejected' ? 'Votre candidature a été refusée.' :
                                 ''}
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
              <button
                onClick={() => setShowNewChat(true)}
                style={{
                  background: C.primary,
                  color: C.white,
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 18
                }}
              >
                +
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>Chargement...</div>
          ) : recruiters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: C.muted }}>
              <p>Aucun recruteur disponible</p>
              <p style={{ fontSize: 12, marginTop: 8 }}>Les recruteurs inscrits apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto' }}>
              {recruiters.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectUser(conv)}
                  style={{
                    padding: 14,
                    cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    background: selectedUser?.id === conv.id ? C.primaryLight : 'transparent',
                    borderLeft: conv.unread ? `4px solid ${C.primary}` : 'none'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: getRoleColor(conv.role),
                        color: C.white,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14
                      }}>
                        {conv.avatar}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: conv.unread ? 800 : 600, fontSize: 14 }}>
                          {conv.name}
                          {conv.company ? <span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>· {conv.company}</span> : null}
                        </span>
                        <span style={{ fontSize: 11, color: C.muted }}>{conv.time}</span>
                      </div>
                      <p style={{ fontSize: 12, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.lastMessage || 'Aucun message'}
                      </p>
                      <span style={{ fontSize: 10, color: getRoleColor(conv.role), fontWeight: 600 }}>
                        {getRoleLabel(conv.role)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', background: C.white, height: '100%', overflow: 'hidden' }}>
          {selectedUser ? (
            <>
              <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: getRoleColor(selectedUser.role),
                    color: C.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {selectedUser.avatar}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 16 }}>{selectedUser.name}</h3>
                  {selectedUser.company && (
                    <span style={{ fontSize: 12, color: C.muted }}>{selectedUser.company}</span>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: C.muted, padding: 40 }}>
                    <p>Aucun message</p>
                    <p style={{ fontSize: 12 }}>Envoyez votre premier message</p>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.from === (user?.id || 'guest');
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          padding: '12px 16px',
                          borderRadius: 18,
                          background: isMe ? C.primary : C.gray,
                          color: isMe ? C.white : C.dark
                        }}
                      >
                        <p style={{ marginBottom: 4, lineHeight: 1.5 }}>{msg.text}</p>
                        <span style={{ fontSize: 10, opacity: 0.7 }}>{msg.time}</span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ padding: 16, borderTop: '1px solid #eee', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Tapez votre message..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 25,
                      border: '1px solid #eee',
                      outline: 'none',
                      fontSize: 14
                    }}
                  />
                  <button
                    onClick={handleSend}
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
              <div style={{ fontSize: 64 }}>💬</div>
              <p style={{ color: C.muted }}>Sélectionnez une conversation</p>
              {recruiters.length === 0 && !loading && (
                <p style={{ fontSize: 13, color: C.muted, maxWidth: 300, textAlign: 'center' }}>
                  Aucun recruteur inscrit pour le moment. Les recruteurs apparaîtront automatiquement ici après leur inscription.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {showNewChat && (
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
          <div style={{ background: C.white, borderRadius: 18, padding: 24, width: '100%', maxWidth: 400, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 900 }}>💬 Nouvelle conversation</h3>
              <button onClick={() => setShowNewChat(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {recruiters.length === 0 ? (
                <p style={{ color: C.muted, textAlign: 'center', padding: 20 }}>
                  Aucun recruteur disponible. Les nouveaux recruteurs inscrits apparaîtront ici.
                </p>
              ) : (
                recruiters.map(u => (
                  <button
                    key={u.id}
                    onClick={() => startConversation(u)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 12, background: C.gray, border: 'none', borderRadius: 12, cursor: 'pointer', marginBottom: 8, textAlign: 'left' }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: getRoleColor(u.role), color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {u.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: getRoleColor(u.role) }}>{getRoleLabel(u.role)}{u.company ? ` · ${u.company}` : ''}</div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <button
              onClick={() => setShowNewChat(false)}
              style={{ width: '100%', padding: 12, background: 'transparent', border: '1px solid #eee', borderRadius: 12, cursor: 'pointer', marginTop: 8 }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
