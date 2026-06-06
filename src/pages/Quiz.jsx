import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Couleurs
const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  amber: "#FDCB6E",
  amberLight: "#FFFBEE",
  red: "#FF6B6B",
  redLight: "#FFF0F0",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

// Questions du quiz
const questions = [
  {
    id: 1,
    question: "Quelle matière préférez-vous?",
    icon: "📚",
    options: [
      { id: 'math', label: 'Mathématiques', icon: "🔢", category: 'science' },
      { id: 'litterature', label: ' Littérature/Français', icon: "📖", category: 'literature' },
      { id: 'science', label: 'Sciences naturelles', icon: "🧬", category: 'health' },
      { id: 'art', label: 'Arts/Dessin', icon: "🎨", category: 'art' },
      { id: 'eco', label: 'Économie/Gestion', icon: "💰", category: 'business' }
    ]
  },
  {
    id: 2,
    question: "Qu'est-ce qui vous motive le plus?",
    icon: "💪",
    options: [
      { id: 'tech', label: 'Créer avec la technologie', icon: "💻", category: 'tech' },
      { id: 'help', label: 'Aider les autres', icon: "🤝", category: 'health' },
      { id: 'create', label: 'Créer quelque chose de nouveau', icon: "✨", category: 'art' },
      { id: 'lead', label: 'Diriger et prendre des décisions', icon: "👑", category: 'business' },
      { id: 'analyze', label: 'Analyser des problèmes complexes', icon: "🔍", category: 'science' }
    ]
  },
  {
    id: 3,
    question: "Quel type de travail préférez-vous?",
    icon: "🏢",
    options: [
      { id: 'office', label: 'Bureau/Entreprise', icon: "🏢", category: 'business' },
      { id: 'lab', label: 'Laboratoire/Recherche', icon: "🔬", category: 'science' },
      { id: ' fieldwork', label: 'Travail sur le terrain', icon: "🌍", category: 'health' },
      { id: 'studio', label: 'Studio/Création', icon: "🎬", category: 'art' },
      { id: 'tech', label: 'Tech/Digital', icon: "📱", category: 'tech' }
    ]
  },
  {
    id: 4,
    question: "Comment préférez-vous résoudre un problème?",
    icon: "🧩",
    options: [
      { id: 'logic', label: 'Avec logique et données', icon: "📊", category: 'science' },
      { id: 'creative', label: 'Avec créativité', icon: "💡", category: 'art' },
      { id: 'team', label: 'En équipe', icon: "👥", category: 'business' },
      { id: 'hands', label: 'Par la pratique', icon: "🔧", category: 'tech' },
      { id: ' empathy', label: 'En écoutant les gens', icon: "💕", category: 'health' }
    ]
  },
  {
    id: 5,
    question: "Quel domaine vous passionne le plus?",
    icon: "🎯",
    options: [
      { id: 'computer', label: 'Informatique/AI', icon: "🤖", category: 'tech' },
      { id: 'medicine', label: 'Médecine/Santé', icon: "⚕️", category: 'health' },
      { id: 'business', label: 'Business/Entrepreneuriat', icon: "💼", category: 'business' },
      { id: 'design', label: 'Design/Architecture', icon: "🏛️", category: 'art' },
      { id: 'engineering', label: 'Ingénierie/Industrie', icon: "⚙️", category: 'science' }
    ]
  },
  {
    id: 6,
    question: "Quelle compétence est votre force?",
    icon: "⭐",
    options: [
      { id: 'math_skill', label: 'Calcul/Math', icon: "➗", category: 'science' },
      { id: 'communication', label: 'Communication', icon: "🗣️", category: 'business' },
      { id: 'creative_skill', label: 'Créativité', icon: "🎨", category: 'art' },
      { id: 'coding', label: 'Programmation', icon: "💻", category: 'tech' },
      { id: 'caring', label: 'Prendre soin des autres', icon: "❤️", category: 'health' }
    ]
  },
  {
    id: 7,
    question: "Quel salary attendez-vous?",
    icon: "💰",
    options: [
      { id: 'high', label: '15000+ DH/mois', icon: "💎", category: 'business' },
      { id: 'medium', label: '8000-15000 DH/mois', icon: "💵", category: 'tech' },
      { id: 'any', label: 'Je commence, salary secondaire', icon: "🌱", category: 'any' },
      { id: 'passion', label: 'La passion primera', icon: "🔥", category: 'art' },
      { id: 'public', label: ' secteur public m\'intéresse', icon: "🏛️", category: 'health' }
    ]
  },
  {
    id: 8,
    question: "Où voyez-vous travailler?",
    icon: "🌍",
    options: [
      { id: 'marrakech', label: 'Casablanca/Rabat', icon: "🏙️", category: 'business' },
      { id: 'abroad', label: 'À l\'étranger', icon: "✈️", category: 'tech' },
      { id: 'anywhere', label: 'Partout au Maroc', icon: "🗺️", category: 'any' },
      { id: 'international', label: 'ONG international', icon: "🌐", category: 'health' },
      { id: 'startup', label: 'Startup tech', icon: "🚀", category: 'tech' }
    ]
  }
];

// Résultats par catégorie
const careerPaths = {
  tech: {
    title: "🏭 Ingénierie & Technologie",
    description: "Vous êtes fait pour les métiers de la technologie!",
    schools: [
      { name: "ENSA Fès", level: "BAC+2", city: "Fès", type: "Ingénierie" },
      { name: "ENSA Tanger", level: "BAC+2", city: "Tanger", type: "Ingénierie" },
      { name: "ESITH", level: "BAC+2", city: "Casablanca", type: "Tech" },
      { name: "EMI", level: "BAC+5", city: "Rabat", type: "Ingénieur" },
      { name: "ENSIAS", level: "BAC+5", city: "Rabat", type: "IA/Data" }
    ],
    jobs: ["Développeur Full Stack", "Data Scientist", "Ingénieur DevOps", "Architecte IT", "CTO"],
    color: "#6C63FF",
    icon: "💻"
  },
  business: {
    title: "💼 Business & Management",
    description: "Vous avez l'âme d'un leader!",
    schools: [
      { name: "ENCG Casablanca", level: "BAC+2", city: "Casablanca", type: "Commerce" },
      { name: "ISCAE", level: "BAC+3", city: "Casablanca", type: "Management" },
      { name: "HEM", level: "BAC+3", city: "Rabat", type: "Business" },
      { name: "ESCA", level: "BAC+5", city: "Casablanca", type: "Finance" },
      { name: "ENCG Rabat", level: "BAC+2", city: "Rabat", type: "Commerce" }
    ],
    jobs: ["Chef d'entreprise", "Consultant", "Director Marketing", "Banquier", "entrepreneur"],
    color: "#FDCB6E",
    icon: "💼"
  },
  science: {
    title: "🔬 Sciences & Ingénierie",
    description: "Vous êtes fait pour les sciences exactes!",
    schools: [
      { name: "ENSA Fès", level: "BAC+2", city: "Fès", type: "Génie" },
      { name: "EST Salé", level: "BAC+2", city: "Salé", type: "Tech" },
      { name: "FST Fès", level: "BAC+2", city: "Fès", type: "Sciences" },
      { name: "Prépa ENSAM", level: "Prépa", city: "Fès", type: "Ingénierie" },
      { name: "INSEA", level: "BAC+3", city: "Rabat", type: "Statistiques" }
    ],
    jobs: ["Ingénieur", "Chercheur", "Architecte", "Chef de projet", "Directeur technique"],
    color: "#00B894",
    icon: "🔬"
  },
  health: {
    title: "⚕️ Santé & Médical",
    description: "Vous êtes fait pour aider les autres!",
    schools: [
      { name: "Faculté de Médecine", level: "BAC+6", city: "Rabat", type: "Médecine" },
      { name: "Faculté de Médecine", level: "BAC+6", city: "Casablanca", type: "Médecine" },
      { name: "ENCG Tanger", level: "BAC+2", city: "Tanger", type: "Santé" },
      { name: "ISIST", level: "BAC+3", city: "Casablanca", type: "Paramédical" },
      { name: "IFCS", level: "BAC+1", city: "Rabat", type: "Infirmier" }
    ],
    jobs: ["Médecin", "Pharmacien", "Infirmier", "Kinésithérapeute", "Chercheur médical"],
    color: "#FF6B6B",
    icon: "⚕️"
  },
  art: {
    title: "🎨 Arts & Création",
    description: "Vous êtes un créatif né!",
    schools: [
      { name: "ESAV", level: "BAC+3", city: "Marrakech", type: "Arts visuels" },
      { name: "EHAC", level: "BAC+3", city: "Casablanca", type: "Arts appliqués" },
      { name: "ISAD", level: "BAC+3", city: "Rabat", type: "Design" },
      { name: "ENS Architecture", level: "BAC+5", city: "Rabat", type: "Architecture" },
      { name: "ESM", level: "BAC+3", city: "Marrakech", type: "Musique" }
    ],
    jobs: ["Designer", "Architecte", "Directeur artistique", "Photographe", "Créateur mode"],
    color: "#E84393",
    icon: "🎨"
  },
  literature: {
    title: "📚 Lettres & Sciences Humaines",
    description: "Vous préférez les sciences humaines!",
    schools: [
      { name: "FSJES", level: "BAC+2", city: "Casablanca", type: "Droit" },
      { name: "FSJEST", level: "BAC+2", city: "Tanger", type: "Droit" },
      { name: "ISITIC", level: "BAC+3", city: "Rabat", type: "Info" },
      { name: "FLSH", level: "BAC+3", city: "Rabat", type: "Lettres" },
      { name: "ENCG Marrakech", level: "BAC+2", city: "Marrakech", type: "Commerce" }
    ],
    jobs: ["Avocat", "Enseignant", "Journaliste", "Diplomate", "Chercheur"],
    color: "#0984E3",
    icon: "📚"
  }
};

// Mélange des catégories pour le résultat final
const getResult = (answers) => {
  const scores = {};
  
  answers.forEach(answer => {
    if (answer?.category && answer.category !== 'any') {
      scores[answer.category] = (scores[answer.category] || 0) + 1;
    }
  });
  
  // Trouver la catégorie avec le plus de votes
  let maxScore = 0;
  let result = 'business';
  
  Object.entries(scores).forEach(([category, score]) => {
    if (score > maxScore) {
      maxScore = score;
      result = category;
    }
  });
  
  // Si égalité, préférer tech ou business
  if (maxScore === 0) {
    result = 'business';
  }
  
  return careerPaths[result] || careerPaths.business;
};

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = () => {
    if (!selectedOption) return;
    
    const newAnswers = [...answers, questions[currentQuestion].options.find(o => o.id === selectedOption)];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedOption(null);
  };

  const result = showResult ? getResult(answers) : null;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '32px 1.5rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: C.white, fontWeight: 900, fontSize: 28, marginBottom: 8 }}>📝 Quiz d'Orientation</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>Découvrez votre voie professionnelle en 8 questions</p>
          
          {/* Progress bar */}
          <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.2)', borderRadius: 50, height: 8, overflow: 'hidden' }}>
            <div style={{ 
              width: `${showResult ? 100 : progress}%`, 
              height: '100%', 
              background: C.primary, 
              borderRadius: 50,
              transition: 'width 0.5s ease'
            }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 8 }}>
            Question {currentQuestion + 1} sur {questions.length}
          </p>
        </div>
      </div>

      {/* Quiz Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 1.5rem' }}>
        {!showResult ? (
          <div style={{ background: C.white, borderRadius: 24, padding: 32 }}>
            {/* Question */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{questions[currentQuestion].icon}</div>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: C.dark }}>{questions[currentQuestion].question}</h2>
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gap: 12 }}>
              {questions[currentQuestion].options.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    borderRadius: 16,
                    border: `2px solid ${selectedOption === option.id ? C.primary : '#eee'}`,
                    background: selectedOption === option.id ? C.primaryLight : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 12, 
                    background: selectedOption === option.id ? C.primary : C.gray,
                    color: selectedOption === option.id ? C.white : C.muted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0
                  }}>
                    {option.icon}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 15, color: C.dark }}>{option.label}</span>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleAnswer}
              disabled={!selectedOption}
              style={{
                width: '100%',
                marginTop: 24,
                padding: 16,
                borderRadius: 50,
                border: 'none',
                background: selectedOption ? C.primary : C.gray,
                color: selectedOption ? C.white : C.muted,
                fontWeight: 700,
                fontSize: 16,
                cursor: selectedOption ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s'
              }}
            >
              {currentQuestion === questions.length - 1 ? '🎯 Voir mon résultat' : 'Question suivante →'}
            </button>
          </div>
        ) : (
          /* RESULTAT */
          <div style={{ background: C.white, borderRadius: 24, padding: 32 }}>
            {/* Header résultat */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                background: result.color + '20',
                color: result.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                margin: '0 auto 16px'
              }}>
                {result.icon}
              </div>
              <span style={{ 
                background: result.color + '20', 
                color: result.color,
                padding: '6px 16px', 
                borderRadius: 50,
                fontWeight: 700,
                fontSize: 14
              }}>
                Votre profil: {result.title}
              </span>
              <h2 style={{ fontWeight: 900, fontSize: 24, marginTop: 16 }}>{result.description}</h2>
            </div>

            {/* Écoles recommandées */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>🏫 Écoles recommandées</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {result.schools.map((school, i) => (
                  <Link 
                    key={i}
                    to="/schools"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 14,
                      background: C.gray,
                      borderRadius: 12,
                      textDecoration: 'none'
                    }}
                  >
                    <div style={{ 
                      width: 44, 
                      height: 44, 
                      borderRadius: 10,
                      background: result.color + '20',
                      color: result.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18
                    }}>
                      🏫
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{school.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{school.type} • {school.city}</div>
                    </div>
                    <span style={{ 
                      background: result.color, 
                      color: C.white,
                      padding: '4px 10px', 
                      borderRadius: 50,
                      fontSize: 11,
                      fontWeight: 700
                    }}>
                      {school.level}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Métiers recommandés */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 16 }}>💼 Métiers possibles</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.jobs.map((job, i) => (
                  <span 
                    key={i}
                    style={{
                      background: C.gray,
                      padding: '8px 14px',
                      borderRadius: 50,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.dark
                    }}
                  >
                    {job}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gap: 12 }}>
              <Link to="/schools" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 50,
                  border: 'none',
                  background: C.primary,
                  color: C.white,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer'
                }}>
                  🔍 Voir les écoles
                </button>
              </Link>
              <Link to="/jobs" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 50,
                  border: `1px solid ${C.primary}`,
                  background: 'transparent',
                  color: C.primary,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer'
                }}>
                  💼 Voir les offres d'emploi
                </button>
              </Link>
              <button 
                onClick={resetQuiz}
                style={{
                  width: '100%',
                  padding: 16,
                  borderRadius: 50,
                  border: 'none',
                  background: C.gray,
                  color: C.dark,
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer'
                }}
              >
                🔄 Recommencer le quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}