import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Couleurs
const C = {
  primary: "#6C63FF",
  primaryLight: "#EDE9FE",
  green: "#00B894",
  greenLight: "#E8FAF5",
  red: "#FF6B6B",
  redLight: "#FFF0F0",
  amber: "#FDCB6E",
  white: "#fff",
  dark: "#1a1a2e",
  gray: "#f8f9ff",
  muted: "#888"
};

const cvSections = [
  { id: 'personal', label: 'Informations personnelles', icon: '👤' },
  { id: 'education', label: 'Formation', icon: '🎓' },
  { id: 'experience', label: 'Expérience', icon: '💼' },
  { id: 'skills', label: 'Compétences', icon: '⚡' },
  { id: 'languages', label: 'Langues', icon: '🌍' },
  { id: 'projects', label: 'Projets', icon: '🚀' }
];

export default function CVBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cvRef = useRef(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [cvData, setCVData] = useState({
    personal: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      linkedin: '',
      github: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    languages: [],
    projects: []
  });

  // Ajouter Formation
  const addEducation = () => {
    setCVData({
      ...cvData,
      education: [...cvData.education, { id: Date.now(), school: '', degree: '', year_start: '', year_end: '' }]
    });
  };

  // Supprimer Formation
  const removeEducation = (id) => {
    setCVData({ ...cvData, education: cvData.education.filter(e => e.id !== id) });
  };

  // Ajouter Expérience
  const addExperience = () => {
    setCVData({
      ...cvData,
      experience: [...cvData.experience, { id: Date.now(), company: '', position: '', year_start: '', year_end: '', description: '' }]
    });
  };

  // Supprimer Expérience
  const removeExperience = (id) => {
    setCVData({ ...cvData, experience: cvData.experience.filter(e => e.id !== id) });
  };

  //Ajouter Compétence
  const addSkill = (skill) => {
    if (skill && !cvData.skills.includes(skill)) {
      setCVData({ ...cvData, skills: [...cvData.skills, skill] });
    }
  };

  // Supprimer Compétence
  const removeSkill = (skill) => {
    setCVData({ ...cvData, skills: cvData.skills.filter(s => s !== skill) });
  };

  // Sauvegarder CV
  const saveCV = () => {
    localStorage.setItem('myCV', JSON.stringify(cvData));
    alert('CV sauvegardé! ✅');
  };

  // Exporter PDF
  const exportPDF = async () => {
    try {
      // Dynamically import html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = cvRef.current;
      const opt = {
        margin: 10,
        filename: `${cvData.personal.first_name || 'Mon'}_CV.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      alert('PDF téléchargé! 📄');
    } catch (error) {
      console.error('Erreur PDF:', error);
      alert('Erreur lors de la création du PDF. Veuillez réessayer.');
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 64 }}>📄</div>
        <p style={{ color: C.muted }}>Veuillez vous connecter pour créer votre CV</p>
        <button onClick={() => navigate('/login')} style={{ padding: '12px 24px', borderRadius: 50, border: 'none', background: C.primary, color: C.white, fontWeight: 700, cursor: 'pointer' }}>
          Se connecter
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.gray, paddingTop: 64 }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '20px 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: C.white, fontWeight: 900, fontSize: 24 }}>📄 Constructeur de CV</h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={saveCV} style={{ padding: '10px 20px', borderRadius: 50, border: 'none', background: 'rgba(255,255,255,0.2)', color: C.white, fontWeight: 700, cursor: 'pointer' }}>
              💾 Sauvegarder
            </button>
            <button onClick={exportPDF} style={{ padding: '10px 20px', borderRadius: 50, border: 'none', background: C.green, color: C.white, fontWeight: 700, cursor: 'pointer' }}>
              📥 Exporter PDF
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 1.5rem', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div style={{ background: C.white, borderRadius: 18, padding: 16, height: 'fit-content', position: 'sticky', top: 80 }}>
          {cvSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: activeSection === section.id ? C.primaryLight : 'transparent',
                color: activeSection === section.id ? C.primary : C.dark,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 4,
                textAlign: 'left'
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div style={{ background: C.white, borderRadius: 18, padding: 24 }}>
          {/* INFORMATIONS PERSONNELLES */}
          {activeSection === 'personal' && (
            <>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>👤 Informations personnelles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <input value={cvData.personal.first_name} onChange={(e) => setCVData({ ...cvData, personal: { ...cvData.personal, first_name: e.target.value } })} style={{ padding: '12px', borderRadius: 10, border: '1px solid #eee' }} placeholder="Prénom *" />
                <input value={cvData.personal.last_name} onChange={(e) => setCVData({ ...cvData, personal: { ...cvData.personal, last_name: e.target.value } })} style={{ padding: '12px', borderRadius: 10, border: '1px solid #eee' }} placeholder="Nom *" />
              </div>
              <div style={{ marginTop: 12 }}>
                <input value={cvData.personal.email} onChange={(e) => setCVData({ ...cvData, personal: { ...cvData.personal, email: e.target.value } })} style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee' }} placeholder="Email *" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                <input value={cvData.personal.phone} onChange={(e) => setCVData({ ...cvData, personal: { ...cvData.personal, phone: e.target.value } })} style={{ padding: '12px', borderRadius: 10, border: '1px solid #eee' }} placeholder="Téléphone" />
                <input value={cvData.personal.city} onChange={(e) => setCVData({ ...cvData, personal: { ...cvData.personal, city: e.target.value } })} style={{ padding: '12px', borderRadius: 10, border: '1px solid #eee' }} placeholder="Ville" />
              </div>
              <div style={{ marginTop: 12 }}>
                <input value={cvData.personal.summary} onChange={(e) => setCVData({ ...cvData, personal: { ...cvData.personal, summary: e.target.value } })} style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee', minHeight: 80 }} placeholder="Résumé professionnel" />
              </div>
            </>
          )}

          {/* FORMATION */}
          {activeSection === 'education' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 800, fontSize: 18 }}>🎓 Formation</h3>
                <button onClick={addEducation} style={{ padding: '8px 16px', borderRadius: 50, border: 'none', background: C.primary, color: C.white, fontWeight: 700 }}>+ Ajouter</button>
              </div>
              {cvData.education.map(edu => (
                <div key={edu.id} style={{ background: C.gray, padding: 16, borderRadius: 12, marginBottom: 12, position: 'relative' }}>
                  <button onClick={() => removeEducation(edu.id)} style={{ position: 'absolute', top: 8, right: 8, background: C.redLight, color: C.red, border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>✕</button>
                  <input value={edu.school} onChange={(e) => setCVData({ ...cvData, education: cvData.education.map(x => x.id === edu.id ? { ...x, school: e.target.value } : x) })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }} placeholder="Établissement" />
                  <input value={edu.degree} onChange={(e) => setCVData({ ...cvData, education: cvData.education.map(x => x.id === edu.id ? { ...x, degree: e.target.value } : x) })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }} placeholder="Diplôme" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input value={edu.year_start} onChange={(e) => setCVData({ ...cvData, education: cvData.education.map(x => x.id === edu.id ? { ...x, year_start: e.target.value } : x) })} style={{ padding: '10px', borderRadius: 8, border: '1px solid #eee' }} placeholder="Année début" />
                    <input value={edu.year_end} onChange={(e) => setCVData({ ...cvData, education: cvData.education.map(x => x.id === edu.id ? { ...x, year_end: e.target.value } : x) })} style={{ padding: '10px', borderRadius: 8, border: '1px solid #eee' }} placeholder="Année fin" />
                  </div>
                </div>
              ))}
            </>
          )}

          {/* EXPÉRIENCE */}
          {activeSection === 'experience' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontWeight: 800, fontSize: 18 }}>💼 Expérience</h3>
                <button onClick={addExperience} style={{ padding: '8px 16px', borderRadius: 50, border: 'none', background: C.primary, color: C.white, fontWeight: 700 }}>+ Ajouter</button>
              </div>
              {cvData.experience.map(exp => (
                <div key={exp.id} style={{ background: C.gray, padding: 16, borderRadius: 12, marginBottom: 12, position: 'relative' }}>
                  <button onClick={() => removeExperience(exp.id)} style={{ position: 'absolute', top: 8, right: 8, background: C.redLight, color: C.red, border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer' }}>✕</button>
                  <input value={exp.company} onChange={(e) => setCVData({ ...cvData, experience: cvData.experience.map(x => x.id === exp.id ? { ...x, company: e.target.value } : x) })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }} placeholder="Entreprise" />
                  <input value={exp.position} onChange={(e) => setCVData({ ...cvData, experience: cvData.experience.map(x => x.id === exp.id ? { ...x, position: e.target.value } : x) })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #eee', marginBottom: 8 }} placeholder="Poste" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <input value={exp.year_start} onChange={(e) => setCVData({ ...cvData, experience: cvData.experience.map(x => x.id === exp.id ? { ...x, year_start: e.target.value } : x) })} style={{ padding: '10px', borderRadius: 8, border: '1px solid #eee' }} placeholder="Année début" />
                    <input value={exp.year_end} onChange={(e) => setCVData({ ...cvData, experience: cvData.experience.map(x => x.id === exp.id ? { ...x, year_end: e.target.value } : x) })} style={{ padding: '10px', borderRadius: 8, border: '1px solid #eee' }} placeholder="Année fin" />
                  </div>
                  <textarea value={exp.description} onChange={(e) => setCVData({ ...cvData, experience: cvData.experience.map(x => x.id === exp.id ? { ...x, description: e.target.value } : x) })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #eee', minHeight: 60 }} placeholder="Description" />
                </div>
              ))}
            </>
          )}

          {/* COMPÉTENCES */}
          {activeSection === 'skills' && (
            <>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>⚡ Compétences</h3>
              <input 
                id="newSkill"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill(e.target.value);
                    e.target.value = '';
                  }
                }}
                style={{ width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #eee', marginBottom: 16 }}
                placeholder="Tapez une compétence et appuyez sur Entrée..."
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cvData.skills.map(skill => (
                  <span key={skill} onClick={() => removeSkill(skill)} style={{ background: C.primaryLight, color: C.primary, padding: '8px 16px', borderRadius: 50, fontWeight: 600, cursor: 'pointer' }}>
                    {skill} ✕
                  </span>
                ))}
              </div>
            </>
          )}

          {/* LANGUES */}
          {activeSection === 'languages' && (
            <>
                            <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>🌍 Langues</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Français', 'Anglais', 'Espagnol', 'Arabe', 'Allemand'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      if (cvData.languages.includes(lang)) {
                        setCVData({ ...cvData, languages: cvData.languages.filter(l => l !== lang) });
                      } else {
                        setCVData({ ...cvData, languages: [...cvData.languages, lang] });
                      }
                    }}
                    style={{
                      background: cvData.languages.includes(lang) ? C.primaryLight : C.gray,
                      color: cvData.languages.includes(lang) ? C.primary : C.dark,
                      padding: '10px 16px',
                      borderRadius: 50,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    {cvData.languages.includes(lang) ? '✓ ' : '+ '}{lang}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* PROJETS */}
          {activeSection === 'projects' && (
            <>
              <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 20 }}>🚀 Projets</h3>
              <button onClick={() => setCVData({ ...cvData, projects: [...cvData.projects, ''] })} style={{ padding: '8px 16px', borderRadius: 50, border: 'none', background: C.primary, color: C.white, fontWeight: 700, marginBottom: 16 }}>
                + Ajouter un projet
              </button>
              {cvData.projects.map((project, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input value={project} onChange={(e) => { const updated = [...cvData.projects]; updated[index] = e.target.value; setCVData({ ...cvData, projects: updated }); }} style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #eee' }} placeholder="Nom du projet" />
                  <button onClick={() => setCVData({ ...cvData, projects: cvData.projects.filter((_, i) => i !== index) })} style={{ background: C.redLight, color: C.red, border: 'none', borderRadius: 8, padding: '0 12px', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* APERÇU DU CV (pour export PDF) */}
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center' }}>
        <div ref={cvRef} style={{ width: '210mm', minHeight: '297mm', background: C.white, padding: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
          {/* En-tête */}
          <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24, borderBottom: `2px solid ${C.primary}` }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: C.dark, marginBottom: 8 }}>
              {cvData.personal.first_name} {cvData.personal.last_name}
            </h1>
            <p style={{ color: C.muted, marginBottom: 8 }}>{cvData.personal.email} • {cvData.personal.phone} • {cvData.personal.city}</p>
            {cvData.personal.summary && <p style={{ color: C.dark, marginTop: 12 }}>{cvData.personal.summary}</p>}
          </div>

          {/*FORMATION*/}
          {cvData.education.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>🎓 Formation</h2>
              {cvData.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{edu.school}</div>
                  <div style={{ color: C.muted, fontSize: 13 }}>{edu.degree} ({edu.year_start} - {edu.year_end})</div>
                </div>
              ))}
            </div>
          )}

          {/* Expérience */}
          {cvData.experience.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>💼 Expérience</h2>
              {cvData.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{exp.position} chez {exp.company}</div>
                  <div style={{ color: C.muted, fontSize: 13 }}>{exp.year_start} - {exp.year_end}</div>
                  {exp.description && <p style={{ fontSize: 12, marginTop: 4 }}>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Compétences */}
          {cvData.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>⚡ Compétences</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cvData.skills.map(skill => (
                  <span key={skill} style={{ background: C.gray, padding: '4px 12px', borderRadius: 50, fontSize: 12 }}>{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {cvData.languages.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: C.primary, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>🌍 Langues</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cvData.languages.map(lang => (
                  <span key={lang} style={{ background: C.primaryLight, color: C.primary, padding: '4px 12px', borderRadius: 50, fontSize: 12 }}>{lang}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}