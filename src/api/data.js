// ========================================
// GRANDE LISTE DES ÉCOLES AU MAROC
// ========================================
export const schoolsData = [
  // BAC+2 - ENSA
  { id: 1, name: 'ENSA Fès', city: 'Fès', type: 'Public', level: 'bac2', rating: 92, tuition: '2500 DH', duration: '2 ans', slug: 'ensa-fes', description: 'École Nationale des Sciences Appliquées', programs: ['Génie Informatique', 'Génie Civile', 'Génie Mécanique'], website: 'https://www.ensa-fes.ac.ma' },
  { id: 2, name: 'ENSA Tanger', city: 'Tanger', type: 'Public', level: 'bac2', rating: 88, tuition: '2500 DH', duration: '2 ans', slug: 'ensa-tanger', description: 'École Nationale des Sciences Appliquées', programs: ['Génie Info', 'Génie Réseau'], website: 'https://www.ensa-tanger.ac.ma' },
  { id: 3, name: 'ENSA Marrakech', city: 'Marrakech', type: 'Public', level: 'bac2', rating: 85, tuition: '2500 DH', duration: '2 ans', slug: 'ensa-marrakech', description: 'École Nationale des Sciences Appliquées', programs: ['Génie Golf', 'Tourisme'], website: 'https://www.ensa-marrakech.ac.ma' },
  { id: 4, name: 'ENSA Oujda', city: 'Oujda', type: 'Public', level: 'bac2', rating: 82, tuition: '2500 DH', duration: '2 ans', slug: 'ensa-oujda', description: 'École Nationale des Sciences Appliquées', programs: ['Génie Info'], website: 'https://www.ensa-oujda.ac.ma' },
  { id: 5, name: 'ENSA Kénitra', city: 'Kénitra', type: 'Public', level: 'bac2', rating: 80, tuition: '2500 DH', duration: '2 ans', slug: 'ensa-kenitra', description: 'École Nationale des Sciences Appliquées', programs: ['Génie Mécanique'], website: 'https://www.ensa-kenitra.ac.ma' },
  { id: 6, name: 'ENSA Safi', city: 'Safi', type: 'Public', level: 'bac2', rating: 78, tuition: '2500 DH', duration: '2 ans', slug: 'ensa-safi', description: 'École Nationale des Sciences Appliquées', programs: ['Génie Chimie'], website: 'https://www.ensa-safi.ac.ma' },
  
  // BAC+2 - ENCG
  { id: 7, name: 'ENCG Casablanca', city: 'Casablanca', type: 'Public', level: 'bac2', rating: 89, tuition: '3500 DH', duration: '2 ans', slug: 'encg-casablanca', description: 'École Nationale de Commerce et Gestion', programs: ['Gestion', 'Finance', 'Marketing'], website: 'https://www.encg-casablanca.ac.ma' },
  { id: 8, name: 'ENCG Rabat', city: 'Rabat', type: 'Public', level: 'bac2', rating: 87, tuition: '3000 DH', duration: '2 ans', slug: 'encg-rabat', description: 'École Nationale de Commerce et Gestion', programs: ['Commerce', 'Gestion'], website: 'https://www.encg-rabat.ac.ma' },
  { id: 9, name: 'ENCG Tanger', city: 'Tanger', type: 'Public', level: 'bac2', rating: 85, tuition: '3000 DH', duration: '2 ans', slug: 'encg-tanger', description: 'École Nationale de Commerce et Gestion', programs: ['Commerce International'], website: 'https://www.encg-tanger.ac.ma' },
  { id: 10, name: 'ENCG Marrakech', city: 'Marrakech', type: 'Public', level: 'bac2', rating: 84, tuition: '3000 DH', duration: '2 ans', slug: 'encg-marrakech', description: 'École Nationale de Commerce et Gestion', programs: ['Tourisme'], website: 'https://www.encg-marrakech.ac.ma' },
  { id: 11, name: 'ENCG Fès', city: 'Fès', type: 'Public', level: 'bac2', rating: 83, tuition: '2800 DH', duration: '2 ans', slug: 'encg-fes', description: 'École Nationale de Commerce et Gestion', programs: ['Finance'], website: 'https://www.encg-fes.ac.ma' },
  { id: 12, name: 'ENCG Settat', city: 'Settat', type: 'Public', level: 'bac2', rating: 79, tuition: '2800 DH', duration: '2 ans', slug: 'encg-settat', description: 'École Nationale de Commerce et Gestion', programs: ['Gestion'], website: 'https://www.encg-settat.ac.ma' },
  
  // BAC+2 - EST
  { id: 13, name: 'EST Salé', city: 'Salé', type: 'Public', level: 'bac2', rating: 78, tuition: '2000 DH', duration: '2 ans', slug: 'est-sale', description: 'École Supérieure de Technologie', programs: ['Info', 'Gestion'], website: 'https://www.est-sal.ma' },
  { id: 14, name: 'EST Meknès', city: 'Meknès', type: 'Public', level: 'bac2', rating: 76, tuition: '2000 DH', duration: '2 ans', slug: 'est-meknes', description: 'École Supérieure de Technologie', programs: ['Info'], website: 'https://www.est-meknes.ma' },
  { id: 15, name: 'EST Béni Mellal', city: 'Béni Mellal', type: 'Public', level: 'bac2', rating: 74, tuition: '2000 DH', duration: '2 ans', slug: 'est-benimellal', description: 'École Supérieure de Technologie', programs: ['Info'], website: 'https://www.est-bm.ma' },
  
  // BAC+2 - Privé
  { id: 16, name: 'ISITIC', city: 'Rabat', type: 'Privé', level: 'bac2', rating: 85, tuition: '2800 DH', duration: '2 ans', slug: 'isitic', description: 'Institut Supérieur de Technologie', programs: ['Réseau', 'Dev'], website: 'https://www.isitic.ma' },
  { id: 17, name: 'ISMA', city: 'Casablanca', type: 'Privé', level: 'bac2', rating: 80, tuition: '2500 DH', duration: '2 ans', slug: 'isma', description: 'Institut Supérieur', programs: ['Gestion'], website: 'https://www.isma.ma' },
  
  // BAC+3
  { id: 18, name: 'INSEA', city: 'Rabat', type: 'Public', level: 'bac3', rating: 90, tuition: '2000 DH', duration: '3 ans', slug: 'insea', description: 'Institut National de Statistique', programs: ['Statistique', 'Data Science'], website: 'https://www.insea.ac.ma' },
  { id: 19, name: 'ENSIAS', city: 'Rabat', type: 'Public', level: 'bac3', rating: 92, tuition: '2500 DH', duration: '3 ans', slug: 'ensias', description: 'École Nationale Supérieure', programs: ['IA', 'CyberSécurité'], website: 'https://www.ensias.ma' },
  { id: 20, name: 'ISIT', city: 'Rabat', type: 'Public', level: 'bac3', rating: 86, tuition: '2500 DH', duration: '3 ans', slug: 'isit', description: 'Institut Supérieur', programs: ['Info'], website: 'https://www.isit.ma' },
  { id: 21, name: 'INPT', city: 'Rabat', type: 'Public', level: 'bac3', rating: 88, tuition: '2500 DH', duration: '3 ans', slug: 'inpt', description: 'Institut National des Postes', programs: ['Télécom'], website: 'https://www.inpt.ac.ma' },
  { id: 22, name: 'HEM', city: 'Casablanca', type: 'Privé', level: 'bac3', rating: 88, tuition: '4500 DH', duration: '3 ans', slug: 'hem', description: 'Institut des Hautes Études', programs: ['Commerce', 'Management'], website: 'https://www.hem.ac.ma' },
  { id: 23, name: 'ESCA', city: 'Casablanca', type: 'Privé', level: 'bac3', rating: 86, tuition: '4200 DH', duration: '3 ans', slug: 'esca', description: 'École Supérieure de Commerce', programs: ['Commerce'], website: 'https://www.esca.ma' },
  { id: 24, name: 'ISCAE', city: 'Casablanca', type: 'Privé', level: 'bac3', rating: 84, tuition: '4000 DH', duration: '3 ans', slug: 'iscae', description: 'Institut Supérieur de Commerce', programs: ['Gestion'], website: 'https://www.iscae.ma' },
  
  // BAC+5
  { id: 25, name: 'EMI', city: 'Rabat', type: 'Public', level: 'bac5', rating: 95, tuition: '1500 DH', duration: '5 ans', slug: 'emi', description: 'École Mohammadia Ingénieurs', programs: ['Génie', 'Architecture'], website: 'https://www.emi.ac.ma' },
  { id: 26, name: 'ENSAM', city: 'Meknès', type: 'Public', level: 'bac5', rating: 90, tuition: '1000 DH', duration: '5 ans', slug: 'ensam', description: 'Arts et Métiers', programs: ['Mécanique', 'Industrie'], website: 'https://www.ensam-meknes.ma' },
  { id: 27, name: 'Ecole Normale Supérieure', city: 'Fès', type: 'Public', level: 'bac5', rating: 92, tuition: '1000 DH', duration: '5 ans', slug: 'ens-fes', description: 'ENS Fès', programs: ['Recherche'], website: 'https://www.ens-fes.ac.ma' },
  
  // PRÉPA
  { id: 28, name: 'Prépa ENSAM Fès', city: 'Fès', type: 'Public', level: 'prepa', rating: 90, tuition: '1000 DH', duration: '2 ans', slug: 'prepa-ensam-fes', description: 'Classes Préparatoires', programs: ['Math-Physique'], website: 'https://www.ensam-meknes.ma/prepa' },
  { id: 29, name: 'Prépa ENSAM Meknès', city: 'Meknès', type: 'Public', level: 'prepa', rating: 87, tuition: '1000 DH', duration: '2 ans', slug: 'prepa-ensam-meknes', description: 'Classes Préparatoires', programs: ['Math-Physique'], website: 'https://www.ensam-meknes.ma' },
  { id: 30, name: 'Prépa Louis', city: 'Casablanca', type: 'Public', level: 'prepa', rating: 85, tuition: '1000 DH', duration: '2 ans', slug: 'prepa-louis', description: 'CPGE', programs: ['Maths'], website: 'https://www.lycee-louis-maestre.ac.ma' }
];

// ========================================
// LISTE DES OFFRES D'EMPLOI
// ========================================
export const jobsData = [
  // CDI
  { id: 1, title: 'Développeur Full Stack React.js', company: 'TechCo Morocco', city: 'Casablanca', type: 'CDI', salary: '10000-15000 DH', skills: ['React', 'Node.js', 'MongoDB'], views: 234, description: 'Nous cherchons un développeur Full Stack expérimenté.' },
  { id: 2, title: 'Data Scientist', company: 'DataCorp', city: 'Rabat', type: 'CDI', salary: '12000-18000 DH', skills: ['Python', 'ML', 'SQL'], views: 189, description: 'Join our data team!' },
  { id: 3, title: 'Ingénieur DevOps', company: 'CloudTech', city: 'Casablanca', type: 'CDI', salary: '11000-16000 DH', skills: ['AWS', 'Docker', 'K8s'], views: 156, description: 'Expert DevOps recherché.' },
  { id: 4, title: 'Chef de Projet IT', company: 'Altenso', city: 'Rabat', type: 'CDI', salary: '13000-18000 DH', skills: ['Agile', 'JIRA', 'Management'], views: 145, description: 'Chef de projet confirmé.' },
  { id: 5, title: 'UX Designer', company: 'DesignLab', city: 'Casablanca', type: 'CDI', salary: '8000-12000 DH', skills: ['Figma', 'UI/UX'], views: 178, description: 'Designer UX Needed.' },
  { id: 6, title: 'Développeur Mobile', company: 'AppMaker', city: 'Marrakech', type: 'CDI', salary: '9000-14000 DH', skills: ['React Native', 'Flutter'], views: 167, description: 'Développeur mobile senior.' },
  { id: 7, title: 'Architecte Solutions', company: 'BigCorp', city: 'Casablanca', type: 'CDI', salary: '18000-25000 DH', skills: ['Architecture', 'Cloud'], views: 98, description: 'Architecte solutions confirmé.' },
  { id: 8, title: 'Responsable Marketing Digital', company: 'MediaPro', city: 'Casablanca', type: 'CDI', salary: '9000-13000 DH', skills: ['SEO', 'Ads', 'Analytics'], views: 134, description: 'Marketing digital manager.' },
  { id: 9, title: 'Comptable', company: 'ExpertCompta', city: 'Rabat', type: 'CDI', salary: '6000-9000 DH', skills: ['Comptabilité', 'Sage'], views: 89, description: 'Comptable expérimentés.' },
  { id: 10, title: 'Commercial', company: 'BusinessPlus', city: 'Casablanca', type: 'CDI', salary: '7000-12000 DH', skills: ['Vente', 'Prospection'], views: 156, description: 'Commercial ambitieux.' },
  { id: 11, title: 'Développeur Python', company: 'AI Start', city: 'Casablanca', type: 'CDI', salary: '10000-15000 DH', skills: ['Python', 'Django', 'ML'], views: 145, description: 'Développeur Python AI.' },
  { id: 12, title: 'Ingénieur Réseau', company: 'NetSecure', city: 'Tanger', type: 'CDI', salary: '9000-14000 DH', skills: ['Cisco', 'Firewall', 'VPN'], views: 112, description: 'Ingénieur réseau senior.' },
  { id: 13, title: 'Chef de Produit', company: 'InnovCorp', city: 'Rabat', type: 'CDI', salary: '10000-15000 DH', skills: ['Product', 'Agile'], views: 98, description: 'Chef de produit digital.' },
  { id: 14, title: 'Développeur Java', company: 'BankTech', city: 'Casablanca', type: 'CDI', salary: '10000-15000 DH', skills: ['Java', 'Spring', 'SQL'], views: 123, description: 'Développeur Java Entreprise.' },
  { id: 15, title: 'HR Manager', company: 'RHPro', city: 'Casablanca', type: 'CDI', salary: '10000-15000 DH', skills: ['Recrutement', 'Gestion'], views: 87, description: 'Responsable RH.' },

  // Stage
  { id: 16, title: 'Stagiaire Développeur React', company: 'StartupX', city: 'Casablanca', type: 'Stage', salary: '3000 DH', skills: ['React', 'JavaScript'], views: 234, description: 'Stage de 6 mois.' },
  { id: 17, title: 'Stagiaire Data Analyst', company: 'DataMine', city: 'Rabat', type: 'Stage', salary: '2500 DH', skills: ['Python', 'Excel'], views: 189, description: 'Stage data analysis.' },
  { id: 18, title: 'Stagiaire Marketing', company: 'AdAgency', city: 'Casablanca', type: 'Stage', salary: '2000 DH', skills: ['Marketing', 'Social Media'], views: 167, description: 'Stage marketing digital.' },
  { id: 19, title: 'Stagiaire UX Design', company: 'CreativeHub', city: 'Marrakech', type: 'Stage', salary: '2500 DH', skills: ['Figma','Design'], views: 145, description: 'Stage UX design.' },
  { id: 20, title: 'Stagiaire Développeur Mobile', company: 'AppStudio', city: 'Tanger', type: 'Stage', salary: '3000 DH', skills: ['Flutter', 'Dart'], views: 123, description: 'Stage développement mobile.' },
  { id: 21, title: 'Stagiaire SEO', company: 'WebAgency', city: 'Casablanca', type: 'Stage', salary: '2000 DH', skills: ['SEO', 'Content'], views: 98, description: 'Stage SEO.' },
  { id: 22, title: 'Stagiaire Assistant RH', company: 'RHPartners', city: 'Casablanca', type: 'Stage', salary: '2000 DH', skills: ['RH', 'Recrutement'], views: 87, description: 'Stage RH.' },
  { id: 23, title: 'Stagiaire Commercial', company: 'SellMore', city: 'Rabat', type: 'Stage', salary: '2500 DH', skills: ['Vente', 'B2B'], views: 76, description: 'Stage commercial.' },
  { id: 24, title: 'Stagiaire Cybersécurité', company: 'SecureNet', city: 'Tanger', type: 'Stage', salary: '3500 DH', skills: ['Cyber', 'Réseau'], views: 112, description: 'Stage cybersécurité.' },
  { id: 25, title: 'Stagiaire Développeur Java', company: 'BankCorp', city: 'Casablanca', type: 'Stage', salary: '3000 DH', skills: ['Java', 'Spring'], views: 98, description: 'Stage Java.' },

  // CDD
  { id: 26, title: 'Professeur de Maths', company: 'PrivateSchool', city: 'Casablanca', type: 'CDD', salary: '6000-8000 DH', skills: ['Maths', 'Pédagogie'], views: 134, description: 'Enseignant mathématiques.' },
  { id: 27, title: 'Assistant administratif', company: 'AdminCorp', city: 'Rabat', type: 'CDD', salary: '4000-5500 DH', skills: ['Bureautique', 'Gestion'], views: 98, description: 'Assistant admin.' },
  { id: 28, title: 'Graphiste', company: 'CreativeStudio', city: 'Casablanca', type: 'CDD', salary: '5000-7000 DH', skills: ['Photoshop', 'Illustrator'], views: 145, description: 'Graphiste créatif.' },
  { id: 29, title: 'Assistant juridique', company: 'LawFirm', city: 'Casablanca', type: 'CDD', salary: '4500-6000 DH', skills: ['Droit', 'Rédaction'], views: 87, description: 'Assistant juridique.' },
  { id: 30, title: 'Community Manager', company: 'SocialCorp', city: 'Casablanca', type: 'CDD', salary: '5000-8000 DH', skills: ['Social Media', 'Community'], views: 156, description: 'Gestion communauté.' },

  // Alternance
  { id: 31, title: 'Alternant Développeur', company: 'TechAcademy', city: 'Casablanca', type: 'Alternance', salary: '3000 DH', skills: ['Dev', 'React'], views: 189, description: 'Alternance développement.' },
  { id: 32, title: 'Alternant Marketing', company: 'DigitalAgency', city: 'Rabat', type: 'Alternance', salary: '2500 DH', skills: ['Marketing', 'Digital'], views: 167, description: 'Alternance marketing.' },
  { id: 33, title: 'Alternant Gestion', company: 'FinancePlus', city: 'Casablanca', type: 'Alternance', salary: '2800 DH', skills: ['Compta', 'Gestion'], views: 123, description: 'Alternance gestion.' },
  { id: 34, title: 'Alternant Designer', company: 'ArtStudio', city: 'Marrakech', type: 'Alternance', salary: '2500 DH', skills: ['Design', 'Figma'], views: 134, description: 'Alternance design.' },
  { id: 35, title: 'Alternant Data', company: 'AICompany', city: 'Tanger', type: 'Alternance', salary: '3500 DH', skills: ['Python', 'ML'], views: 156, description: 'Alternance data science.' },
  { id: 36, title: 'Alternant Réseau', company: 'NetCorp', city: 'Casablanca', type: 'Alternance', salary: '3000 DH', skills: ['Réseau', 'Cisco'], views: 98, description: 'Alternance réseau.' },
  { id: 37, title: 'Alternant Comptable', company: 'ExpertCompta', city: 'Rabat', type: 'Alternance', salary: '2800 DH', skills: ['Comptabilité', 'Sage'], views: 87, description: 'Alternance comptable.' },
  { id: 38, title: 'Alternant Chef de Projet', company: 'ProjectPro', city: 'Casablanca', type: 'Alternance', salary: '3500 DH', skills: ['PM', 'Agile'], views: 112, description: 'Alternance chef de projet.' },
  { id: 39, title: 'Alternant RH', company: 'RHExpert', city: 'Casablanca', type: 'Alternance', salary: '2500 DH', skills: ['RH', 'Recrutement'], views: 98, description: 'Alternance RH.' },
  { id: 40, title: 'Alternant Webmaster', company: 'WebPro', city: 'Marrakech', type: 'Alternance', salary: '3000 DH', skills: ['WordPress', 'SEO'], views: 123, description: 'Alternance webmaster.' }
];

// ========================================
// DONNÉES UTILISATEURS
// ========================================
export const usersData = [
  // Étudiants
  { id: 1, first_name: 'Ahmed', last_name: 'Benjelloun', email: 'ahmed@example.com', role: 'student', phone: '0612345678', city: 'Casablanca', niveau: 'BAC+2', ville: 'Casablanca', domaine: 'Tech', bio: 'Étudiant en sciences, passioné par la programmation', avatar: 'AB' },
  { id: 2, first_name: 'Fatima', last_name: 'Zahra', email: 'fatima@example.com', role: 'student', phone: '0623456789', city: 'Rabat', niveau: 'BAC+3', ville: 'Rabat', domaine: 'Business', bio: 'Étudiante en commerce, motivée', avatar: 'FZ' },
  { id: 3, first_name: 'Youssef', last_name: 'Moussa', email: 'youssef@example.com', role: 'student', phone: '0634567890', city: 'Fès', niveau: 'BAC', ville: 'Fès', domaine: 'Santé', bio: 'Futur médecin', avatar: 'YM' },
  { id: 4, first_name: 'Nadia', last_name: 'Amrani', email: 'nadia@example.com', role: 'student', phone: '0645678901', city: 'Marrakech', niveau: 'BAC+2', ville: 'Marrakech', domaine: 'Design', bio: 'Créative et innovante', avatar: 'NA' },
  { id: 5, first_name: 'Karim', last_name: 'Rifai', email: 'karim@example.com', role: 'student', phone: '0656789012', city: 'Tanger', niveau: 'BAC+3', ville: 'Tanger', domaine: 'Tech', bio: 'Développeur web', avatar: 'KR' },
  { id: 6, first_name: 'Sara', last_name: 'Alaoui', email: 'sara@example.com', role: 'student', phone: '0667890123', city: 'Casablanca', niveau: 'BAC+5', ville: 'Casablanca', domaine: 'Santé', bio: 'Future médecin', avatar: 'SA' },
  { id: 7, first_name: 'Omar', last_name: 'Haddad', email: 'omar@example.com', role: 'student', phone: '0678901234', city: 'Rabat', niveau: 'BAC+2', ville: 'Rabat', domaine: 'Business', bio: 'Étudiant ambitieux', avatar: 'OH' },
  { id: 8, first_name: 'Lina', last_name: 'Bennis', email: 'lina@example.com', role: 'student', phone: '0689012345', city: 'Marrakech', niveau: 'BAC', ville: 'Marrakech', domaine: 'Art', bio: 'Artiste', avatar: 'LB' },

  // Recruteurs
  { id: 101, first_name: 'TechCo', last_name: 'RH', email: 'rh@techco.ma', role: 'recruiter', company: 'TechCo Morocco', phone: '0522123456', city: 'Casablanca', bio: 'Entreprise de technologie', avatar: 'TC', website: 'https://techco.ma' },
  { id: 102, first_name: 'DataCorp', last_name: 'Recrutement', email: 'recrutement@datacorp.ma', role: 'recruiter', company: 'DataCorp', phone: '0522345678', city: 'Rabat', bio: 'Société de données', avatar: 'DC', website: 'https://datacorp.ma' },
  { id: 103, first_name: 'CloudTech', last_name: 'HR', email: 'hr@cloudtech.ma', role: 'recruiter', company: 'CloudTech', phone: '0522567890', city: 'Casablanca', bio: 'Services cloud', avatar: 'CT', website: 'https://cloudtech.ma' },
  { id: 104, first_name: 'InnovCorp', last_name: 'Recrutement', email: 'recrut@innov.ma', role: 'recruiter', company: 'InnovCorp', phone: '0522789012', city: 'Rabat', bio: 'Innovation', avatar: 'IC', website: 'https://innovcorp.ma' },
  { id: 105, first_name: 'MediaPro', last_name: 'RH', email: 'rh@mediapro.ma', role: 'recruiter', company: 'MediaPro', phone: '0522901234', city: 'Casablanca', bio: 'Agence media', avatar: 'MP', website: 'https://mediapro.ma' },
  { id: 106, first_name: 'StartupX', last_name: 'Recrutement', email: 'join@startupx.ma', role: 'recruiter', company: 'StartupX', phone: '0522123456', city: 'Casablanca', bio: 'Startup tech', avatar: 'SX', website: 'https://startupx.ma' },
  { id: 107, first_name: 'BankTech', last_name: 'RH', email: 'rh@banktech.ma', role: 'recruiter', company: 'BankTech', phone: '0522345678', city: 'Casablanca', bio: 'FinTech', avatar: 'BT', website: 'https://banktech.ma' },
  { id: 108, first_name: 'AICompany', last_name: 'Recrutement', email: 'recrut@aicompany.ma', role: 'recruiter', company: 'AI Company', phone: '0522567890', city: 'Tanger', bio: 'Intelligence Artificielle', avatar: 'AI', website: 'https://aicompany.ma' }
];

// ========================================
// DOMAINES/FILIÈRES
// ========================================
export const domains = [
  { id: 'tech', name: 'Technologies', icon: '💻', color: '#6C63FF' },
  { id: 'business', name: 'Commerce & Gestion', icon: '💼', color: '#FDCB6E' },
  { id: 'health', name: 'Santé', icon: '⚕️', color: '#FF6B6B' },
  { id: 'engineering', name: 'Ingénierie', icon: '⚙️', color: '#00B894' },
  { id: 'art', name: 'Arts & Design', icon: '🎨', color: '#E84393' },
  { id: 'law', name: 'Droit & Sciences', icon: '⚖️', color: '#0984E3' }
];

// ========================================
// VILLES AU MAROC
// ========================================
export const cities = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Meknès', 'Salé', 
  'Oujda', 'Kénitra', 'Safi', 'Béni Mellal', 'Témara', 'Essaouira', 
  'El Jadida', 'Nador', 'Ksar El Kébir', 'Taza', 'Sétif'
];

// ========================================
// FONCTIONS UTILITAIRES
// ========================================

// Récupérer une école par slug
export const getSchoolBySlug = (slug) => {
  return schoolsData.find(s => s.slug === slug);
};

// Récupérer une offre par ID
export const getJobById = (id) => {
  return jobsData.find(j => j.id === id);
};

// Récupérer un utilisateur par ID
export const getUserById = (id) => {
  return usersData.find(u => u.id === id);
};

// Filtrer les écoles par niveau
export const getSchoolsByLevel = (level) => {
  if (level === 'all') return schoolsData;
  return schoolsData.filter(s => s.level === level);
};

// Filtrer les écoles par ville
export const getSchoolsByCity = (city) => {
  if (!city) return schoolsData;
  return schoolsData.filter(s => s.city === city);
};

// Filtrer les jobs par type
export const getJobsByType = (type) => {
  if (type === 'Tous') return jobsData;
  return jobsData.filter(j => j.type === type);
};