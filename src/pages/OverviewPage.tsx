import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Alert, Chip } from '@mui/material';
import { TrendingUp, TaskAlt, AssignmentTurnedIn, Groups, CameraAlt, CalendarMonth, StarRate } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const chartData = [
    { name: t('common.jan', 'Jan'), revenue: 4000, bookings: 24 },
    { name: t('common.feb', 'Feb'), revenue: 3000, bookings: 13 },
    { name: t('common.mar', 'Mar'), revenue: 2000, bookings: 98 },
    { name: t('common.apr', 'Apr'), revenue: 2780, bookings: 39 },
    { name: t('common.may', 'May'), revenue: 1890, bookings: 48 },
    { name: t('common.jun', 'Jun'), revenue: 2390, bookings: 38 },
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
      </Grid>

      {/* Chart & Activity Section */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              height: 400,
              animation: 'ehtFadeRise 600ms ease both',
              background: theme => theme.palette.mode === 'dark' ? '#22190f' : '#fffdfa',
              p: 1
            }}
          >
            <CardContent sx={{ height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
                {t('overview.revenueTrend', 'Revenue Trend')}
              </Typography>
              <ResponsiveContainer width="100%" height="88%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b78a2a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#b78a2a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(183, 138, 42, 0.1)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c6921', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c6921', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    itemStyle={{ color: '#b78a2a', fontWeight: 'bold' }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [`SAR ${Number(value).toLocaleString()}`, t('overview.revenueTrend', 'Revenue')]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#b78a2a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              height: '100%',
              minHeight: 300,
              animation: 'ehtFadeRise 640ms ease both',
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(126, 93, 30, 0.33)' : 'rgba(183,138,42,0.18)',
            }}
          >
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary" gutterBottom sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                {t('overview.recentActivity')}
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)', borderRadius: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {t('overview.lastUpdated')}:
                </Typography>
                <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
                  {new Date().toLocaleDateString()}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600, mt: 2 }}>
                  {t('overview.approvalRate')}:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h3" sx={{ color: 'success.main', fontWeight: 800 }}>
                    {stats?.approvalRate || 92}%
                  </Typography>
                  <TrendingUp color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
