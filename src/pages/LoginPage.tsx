import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { apiService, type LoginResult } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (result: LoginResult) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('sultan@example.com');
  const [password, setPassword] = useState('88888888');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await apiService.login(email.trim(), password);

      if (result.user.userType !== 'admin') {
        throw new Error(t('auth.adminOnly'));
      }

      onLoginSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
      <Card sx={{ width: '100%', overflow: 'hidden' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
                {t('auth.title')}
              </Typography>
              <Typography color="text.secondary">
                {t('auth.subtitle')}
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  fullWidth
                  required
                  autoComplete="email"
                />
                <TextField
                  label={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  fullWidth
                  required
                  autoComplete="current-password"
                />

                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : t('auth.loginButton')}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};
