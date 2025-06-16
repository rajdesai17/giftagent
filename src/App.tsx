import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import OAuthCallback from './pages/oauth-callback';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <History />
                  </Layout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;