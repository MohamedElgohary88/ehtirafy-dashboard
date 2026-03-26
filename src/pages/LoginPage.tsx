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
  Grid,
  useTheme,
  useMediaQuery
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const targetEmail = 'sultan@example.com';
    const targetPassword = '88888888';

    if (email.trim() !== targetEmail || password !== targetPassword) {
      setError(t('auth.loginFailed'));
      setLoading(false);
      return;
    }

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
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Grid container sx={{ flexGrow: 1 }}>
        {/* Left Side - Branding */}
        <Grid 
          item 
          xs={12} 
          md={5} 
          lg={6}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            background: theme => theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, #2a1e10 0%, #1a120a 100%)' 
              : 'linear-gradient(135deg, #fdf8eb 0%, #e0c888 100%)',
            borderRight: theme => `1px solid ${theme.palette.divider}`,
            color: theme => theme.palette.mode === 'dark' ? '#fff' : '#453215',
          }}
        >
          {/* Decorative shapes */}
          <Box sx={{
            position: 'absolute', top: '10%', right: '10%', width: 300, height: 300,
            borderRadius: '50%', background: 'rgba(212, 163, 115, 0.15)', filter: 'blur(60px)'
          }} />
          <Box sx={{
            position: 'absolute', bottom: '15%', left: '10%', width: 250, height: 250,
            borderRadius: '50%', background: 'rgba(215, 185, 142, 0.2)', filter: 'blur(50px)'
          }} />

          <Box sx={{ zIndex: 1, textAlign: 'center', p: 4, animation: 'ehtFadeRise 0.8s ease' }}>
            <img src="/logo.png" alt="Logo" style={{ height: 180, objectFit: 'contain', marginBottom: 24 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              {t('common.appName')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 450, mx: 'auto', fontWeight: 500 }}>
               لوحة التحكم وإدارة العمليات لمنصة التصوير والمناسبات الرائدة
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Login Form */}
        <Grid 
          item 
          xs={12} 
          md={7} 
          lg={6} 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: theme => theme.palette.background.default
          }}
        >
          <Container maxWidth="sm" sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
            {isMobile && (
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img src="/logo.png" alt="Logo" style={{ height: 100, objectFit: 'contain', marginBottom: 16 }} />
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {t('common.appName')}
                </Typography>
              </Box>
            )}

            <Card 
              elevation={isMobile ? 0 : 4} 
              sx={{ 
                width: '100%', 
                overflow: 'hidden', 
                borderRadius: 4,
                border: theme => isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
                boxShadow: theme => isMobile ? 'none' : theme.shadows[8],
                background: theme => theme.palette.background.paper,
                animation: 'ehtFadeRise 0.6s ease 0.2s both',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 5 } }}>
                <Stack spacing={4}>
                  <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
                      {t('auth.title')}
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                      {t('auth.subtitle')}
                    </Typography>
                  </Box>

                  {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        label={t('auth.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        fullWidth
                        required
                        autoComplete="email"
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 2 } }}
                      />
                      <TextField
                        label={t('auth.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        fullWidth
                        required
                        autoComplete="current-password"
                        variant="outlined"
                        InputProps={{ sx: { borderRadius: 2 } }}
                      />

                      <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        disabled={loading}
                        sx={{ 
                          py: 1.5, 
                          borderRadius: 2, 
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          textTransform: 'none',
                          boxShadow: '0 4px 14px 0 rgba(183, 138, 42, 0.39)',
                        }}
                      >
                        {loading ? <CircularProgress size={26} color="inherit" /> : t('auth.loginButton')}
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};
