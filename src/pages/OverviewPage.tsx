import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Alert, Chip } from '@mui/material';
import { TrendingUp, TaskAlt, AssignmentTurnedIn, Groups, CameraAlt, CalendarMonth, StarRate } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import { PageLoadingState } from '../components/PageLoadingState';

export const OverviewPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: stats, loading, error } = useData(() => apiService.getDashboardStats());

  if (loading) {
    return (
      <Container maxWidth="xl">
        <PageLoadingState variant="stats" />
      </Container>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')}: {error}</Alert>;
  }

  interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    accent: string;
  }

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, accent }) => (
    <Card
      sx={{
        height: '100%',
        animation: 'ehtFadeRise 520ms ease both',
        background: theme => theme.palette.mode === 'dark'
          ? 'linear-gradient(145deg, rgba(42,30,16,0.96), rgba(26,18,10,0.95))'
          : 'linear-gradient(145deg, rgba(255,254,249,0.96), rgba(252,245,229,0.98))',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: 7,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            display: 'grid',
            placeItems: 'center',
            color: '#2b220d',
            background: accent,
          }}
        >
          {icon}
        </Box>
      </CardContent>
    </Card>
  );

  const statsCards = [
    {
      title: t('overview.totalCustomers'),
      value: stats?.totalCustomers || 0,
      icon: <Groups />,
      accent: 'linear-gradient(145deg, #f7db95, #ddb15a)',
    },
    {
      title: t('overview.totalFreelancers'),
      value: stats?.totalFreelancers || 0,
      icon: <CameraAlt />,
      accent: 'linear-gradient(145deg, #f3d38a, #cb9a42)',
    },
    {
      title: t('overview.activeContracts'),
      value: stats?.activeContracts || 0,
      icon: <AssignmentTurnedIn />,
      accent: 'linear-gradient(145deg, #f8df9f, #d3a552)',
    },
    {
      title: t('overview.pendingPayments'),
      value: stats?.pendingPayments || 0,
      icon: <TaskAlt />,
      accent: 'linear-gradient(145deg, #f3ce78, #b9892a)',
    },
    {
      title: t('overview.totalRevenue'),
      value: `SAR ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <TrendingUp />,
      accent: 'linear-gradient(145deg, #f5d17f, #b58424)',
    },
    {
      title: t('overview.totalBookings'),
      value: stats?.totalBookings || 0,
      icon: <CalendarMonth />,
      accent: 'linear-gradient(145deg, #f2da9e, #c79b44)',
    },
    {
      title: t('overview.completedProjects'),
      value: stats?.completedProjects || 0,
      icon: <AssignmentTurnedIn />,
      accent: 'linear-gradient(145deg, #efd084, #b9892a)',
    },
    {
      title: t('overview.averageRating'),
      value: `${stats?.averageRating || 0} / 5`,
      icon: <StarRate />,
      accent: 'linear-gradient(145deg, #f9e3ad, #d4a64f)',
    },
  ];

  return (
    <Container maxWidth="xl">
      <Card
        sx={{
          mb: 3,
          overflow: 'hidden',
          animation: 'ehtFadeRise 420ms ease both',
          background: theme => theme.palette.mode === 'dark'
            ? 'linear-gradient(130deg, rgba(73,53,18,0.94), rgba(152,113,35,0.84))'
            : 'linear-gradient(130deg, rgba(233,199,124,0.98), rgba(184,136,43,0.93))',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  mb: 1,
                  color: theme => theme.palette.mode === 'dark' ? '#fff4dd' : '#2d2008',
                }}
              >
                {t('overview.title')}
              </Typography>
              <Typography
                sx={{
                  color: theme => theme.palette.mode === 'dark' ? 'rgba(255,244,221,0.9)' : 'rgba(34,24,6,0.88)',
                  fontWeight: 500,
                }}
              >
                {t('overview.heroSubtitle')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
              <Chip
                icon={<TrendingUp />}
                label={t('overview.growth')}
                sx={{
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,244,221,0.18)' : 'rgba(45,32,8,0.12)',
                  color: theme => theme.palette.mode === 'dark' ? '#fff4dd' : '#2d2008',
                  fontWeight: 700,
                }}
              />
              <Chip
                icon={<TaskAlt />}
                label={t('overview.systemStable')}
                sx={{
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,244,221,0.18)' : 'rgba(45,32,8,0.12)',
                  color: theme => theme.palette.mode === 'dark' ? '#fff4dd' : '#2d2008',
                  fontWeight: 700,
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {statsCards.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <StatCard title={item.title} value={item.value} icon={item.icon} accent={item.accent} />
          </Grid>
        ))}

        <Grid item xs={12} md={6} lg={4}>
          <Card
            sx={{
              height: '100%',
              animation: 'ehtFadeRise 640ms ease both',
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(126, 93, 30, 0.33)' : 'rgba(183,138,42,0.18)',
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontWeight: 700 }}>
                {t('overview.recentActivity')}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.primary' }}>
                {t('overview.lastUpdated')}: {new Date().toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {t('overview.approvalRate')}: {stats?.approvalRate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
