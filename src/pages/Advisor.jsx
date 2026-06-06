import React, { useState, useEffect, useRef } from 'react';

const Advisor = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Bonjour ! Je suis votre Advisor IA 🤖\n\nJe peux vous aider à :\n\n• Trouver la formation idéale\n• Comprendre vos points forts\n• Choisir une carrière\n\nDites-moi en plus sur vous !' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setInput('');
    setLoading(true);

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      role: 'user', 
      content: userMessage 
    }]);

    try {
      // Simuler une réponse IA (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = [
        "C'est intéressant ! Pour mieux vous conseigner, j'aurais besoin de connaître votre niveau d'études actuel.",
        "Très bien ! Avez-vous des préférences concernant la ville où vous souhaitez étudier ?",
        'Je vous recommande de regarder les formations en Développement Web. Voici quelques suggestions populaires :\n\n• ENSA Fès - Génie Informatique\n• ISITIC Rabat - Développement Full Stack\n• EST Salé - Technologies Web',
        'Selon votre profil, vous correspondent bien aux métiers de la tech. Le salaire moyen au Maroc pour un développeur junior starts à 5000 DH/mois.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: randomResponse 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        role: 'assistant', 
        content: 'Désolé, j\'ai eu un problème. Pouvez-vous reformuler ?' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 24 }}>🤖 AI Advisor</h1>
        
        <div className="card" style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: 18,
                  background: msg.role === 'user' ? '#6C63FF' : '#f8f9ff',
                  color: msg.role === 'user' ? '#fff' : '#333',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.role === 'assistant' && <span style={{ marginRight: 8 }}>🤖</span>}
                {msg.content}
              </div>
            ))}
            
            {loading && (
              <div style={{ 
                alignSelf: 'flex-start', 
                padding: '12px 16px', 
                borderRadius: 18, 
                background: '#f8f9ff' 
              }}>
                <span style={{ marginRight: 8 }}>🤖</span>
                Laisse-moi réfléchir...
                <span className="loading-dots">...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: 16, borderTop: '1px solid #eee' }}>
            <div className="flex" style={{ gap: 12 }}>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="input" 
                placeholder="Tapez votre message..."
                disabled={loading}
              />
              <button 
                onClick={handleSend} 
                className="btn btn-primary"
                disabled={loading || !input.trim()}
              >
                {loading ? '...' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisor;