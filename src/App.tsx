import { lazy, Suspense, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './layouts/Layout';
import { LoginPage } from './pages/LoginPage';
import type { LoginResult } from './services/api';
import './i18n/config';

const OverviewPage = lazy(() => import('./pages/OverviewPage').then(module => ({ default: module.OverviewPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(module => ({ default: module.CustomersPage })));
const FreelancersPage = lazy(() => import('./pages/FreelancersPage').then(module => ({ default: module.FreelancersPage })));
const ServiceApprovalPage = lazy(() => import('./pages/ServiceApprovalPage').then(module => ({ default: module.ServiceApprovalPage })));
const PendingPaymentsPage = lazy(() => import('./pages/PendingPaymentsPage').then(module => ({ default: module.PendingPaymentsPage })));
const ContractsPage = lazy(() => import('./pages/ContractsPage').then(module => ({ default: module.ContractsPage })));

function App() {
  const routerBase = import.meta.env.BASE_URL === '/'
    ? '/'
    : import.meta.env.BASE_URL.replace(/\/$/, '');
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') || '');

  const isAuthenticated = useMemo(() => Boolean(authToken), [authToken]);

  const handleLoginSuccess = (result: LoginResult) => {
    localStorage.setItem('token', result.token);
    localStorage.setItem('auth_user', JSON.stringify(result.user));
    setAuthToken(result.token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    setAuthToken('');
  };

  return (
    <ThemeProvider>
      <Router basename={routerBase}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/" replace />
                : <LoginPage onLoginSuccess={handleLoginSuccess} />
            }
          />

          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Layout onLogout={handleLogout}>
                  <Suspense
                    fallback={
                      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
                        <CircularProgress />
                      </Box>
                    }
                  >
                    <Routes>
                      <Route path="/" element={<OverviewPage />} />
                      <Route path="/customers" element={<CustomersPage />} />
                      <Route path="/freelancers" element={<FreelancersPage />} />
                      <Route path="/services" element={<ServiceApprovalPage />} />
                      <Route path="/payments" element={<PendingPaymentsPage />} />
                      <Route path="/contracts" element={<ContractsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
