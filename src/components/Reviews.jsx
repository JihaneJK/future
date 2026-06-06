import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAuth } from '../context/AuthContext';

// Context pour les toast
const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: '#1a1a2e',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease'
          }}>
            <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
            <span style={{ fontSize: 14 }}>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', marginLeft: 8 }}>✕</button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  return context || { addToast: () => {} };
};

// Composant Reviews principal
const Reviews = ({ type, itemId, reviews: initialReviews }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  // Charger les avis depuis localStorage
  useEffect(() => {
    const savedKey = `reviews_${type}_${itemId}`;
    const saved = localStorage.getItem(savedKey);
    if (saved) {
      setReviews(JSON.parse(saved));
    } else if (initialReviews) {
      setReviews(initialReviews);
    }
  }, [type, itemId, initialReviews]);

  // Sauvegarder dans localStorage
  const saveReviews = (newReviews) => {
    const saveKey = `reviews_${type}_${itemId}`;
    localStorage.setItem(saveKey, JSON.stringify(newReviews));
  };

  const submitReview = () => {
    if (!newReview.comment.trim()) return;
    
    setLoading(true);
    
    const review = {
      id: Date.now(),
      user: user?.first_name || 'Anonyme',
      avatar: (user?.first_name?.[0] || 'A').toUpperCase(),
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      helpful: 0,
      type: type
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    saveReviews(updatedReviews);
    
    setNewReview({ rating: 5, comment: '' });
    setShowForm(false);
    setLoading(false);
    addToast('Avis publié avec succès!', 'success');
  };

  const markHelpful = (reviewId) => {
    const updated = reviews.map(r => 
      r.id === reviewId ? { ...r, helpful: (r.helpful || 0) + 1 } : r
    );
    setReviews(updated);
    saveReviews(updated);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
  }));

  return (
    <div style={{ marginTop: 20 }}>
      {/* Summary */}
      <div className="flex-between" style={{ marginBottom: 24 }}>
        <div className="flex" style={{ gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#6C63FF' }}>{averageRating || '-'}</div>
            <div className="flex" style={{ gap: 2, justifyContent: 'center', marginBottom: 4 }}>
              {[1,2,3,4,5].map(star => (
                <span key={star} style={{ color: star <= Math.round(averageRating || 0) ? '#FDCB6E' : '#ddd', fontSize: 14 }}>★</span>
              ))}
            </div>
            <p className="text-muted" style={{ fontSize: 12 }}>{reviews.length} avis</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ratingDistribution.map(({ star, percent }) => (
              <div key={star} className="flex" style={{ gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, width: 16 }}>{star}</span>
                <span style={{ color: '#FDCB6E' }}>★</span>
                <div style={{ width: 80, height: 6, background: '#eee', borderRadius: 50 }}>
                  <div style={{ width: `${percent}%`, height: '100%', borderRadius: 50, background: '#6C63FF' }} />
                </div>
                <span className="text-muted" style={{ fontSize: 11 }}>{percent}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          {showForm ? 'Annuler' : '📝 Écrire un avis'}
        </button>
      </div>

      {/* Formulaire d'avis */}
      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 16 }}>Votre avis</h3>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Note</label>
            <div className="flex" style={{ gap: 8 }}>
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  style={{
                    fontSize: 28,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: star <= newReview.rating ? '#FDCB6E' : '#ddd',
                    transition: 'transform 0.2s'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Votre commentaire</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="input"
              rows={4}
              placeholder="Partagez votre expérience..."
            />
          </div>
          
          <button 
            onClick={submitReview} 
            className="btn btn-primary"
            disabled={loading || !newReview.comment.trim()}
          >
            {loading ? 'Publication...' : 'Publier mon avis'}
          </button>
        </div>
      )}

      {/* Liste des avis */}
      <div>
        {reviews.length === 0 ? (
          <div className="text-center" style={{ padding: 40 }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>💬</p>
            <p className="text-muted">Aucun avis pour le moment</p>
            <p className="text-muted" style={{ fontSize: 13 }}>Soyez le premier à donner votre avis!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} style={{ padding: '20px 0', borderBottom: '1px solid #eee' }}>
              <div className="flex-between" style={{ marginBottom: 8 }}>
                <div className="flex" style={{ gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: '#6C63FF',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {review.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{review.user}</div>
                    <div className="flex" style={{ gap: 4 }}>
                      {[1,2,3,4,5].map(star => (
                        <span key={star} style={{ color: star <= review.rating ? '#FDCB6E' : '#ddd', fontSize: 12 }}>★</span>
                      ))}
                      <span className="text-muted" style={{ fontSize: 11, marginLeft: 8 }}>{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p style={{ lineHeight: 1.6, marginBottom: 12 }}>{review.comment}</p>
              
              <button 
                onClick={() => markHelpful(review.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                👍 Utile ({review.helpful || 0})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;