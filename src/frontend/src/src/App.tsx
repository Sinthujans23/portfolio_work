import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './routes/Home';
import Projects from './routes/Projects';
import ProjectDetail from './routes/ProjectDetail';
import About from './routes/About';
import Contact from './routes/Contact';
import AdminLogin from './routes/Admin/Login';
import AdminDashboard from './routes/Admin/Dashboard';
import AdminProjectManager from './routes/Admin/ProjectManager';
import AdminAboutEditor from './routes/Admin/AboutEditor';
import AuthGuard from './utils/authGuard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AuthGuard>
                <AdminDashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <AuthGuard>
                <AdminProjectManager />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/about"
            element={
              <AuthGuard>
                <AdminAboutEditor />
              </AuthGuard>
            }
          />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
