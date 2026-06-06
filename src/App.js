import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Loader from './components/Loader';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import SchoolDetail from './pages/SchoolDetail';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Search from './pages/Search';
import Quiz from './pages/Quiz';
import Advisor from './pages/Advisor';
import Map from './pages/Map';
import Chat from './pages/Chat';
import Recruiter from './pages/Recruiter';
import Admin from './pages/Admin';
import CVBuilder from './pages/CVBuilder';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <main style={{ flex: 1, paddingTop: 64 }}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes des écoles */}
          <Route path="/schools" element={<Schools />} />
          <Route path="/schools/:slug" element={<SchoolDetail />} />
          
          {/* Routes des offres d'emploi */}
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          
          {/* Recherche */}
          <Route path="/search" element={<Search />} />
          
          {/* Quiz d'orientation */}
          <Route path="/quiz" element={<Quiz />} />
          
          {/* AI Advisor */}
          <Route path="/advisor" element={<Advisor />} />
          
          {/* Carte du Maroc */}
          <Route path="/map" element={<Map />} />
          
          
          {/* Routes protégées */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/chat" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          } />
          
          {/* CV Builder - ROUTE PROTÉGÉE */}
          <Route path="/cv-builder" element={
            <PrivateRoute>
              <CVBuilder />
            </PrivateRoute>
          } />
          
          <Route path="/recruiter" element={
            <PrivateRoute roles={['recruiter', 'admin']}>
              <Recruiter />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute roles={['admin']}>
              <Admin />
            </PrivateRoute>
          } />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;