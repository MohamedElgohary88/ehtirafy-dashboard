import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './layouts/Layout';
import './i18n/config';

const OverviewPage = lazy(() => import('./pages/OverviewPage').then(module => ({ default: module.OverviewPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(module => ({ default: module.CustomersPage })));
const FreelancersPage = lazy(() => import('./pages/FreelancersPage').then(module => ({ default: module.FreelancersPage })));
const ServiceApprovalPage = lazy(() => import('./pages/ServiceApprovalPage').then(module => ({ default: module.ServiceApprovalPage })));
const PendingPaymentsPage = lazy(() => import('./pages/PendingPaymentsPage').then(module => ({ default: module.PendingPaymentsPage })));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
