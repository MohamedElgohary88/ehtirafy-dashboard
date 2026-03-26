import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Stack,
  InputAdornment
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon, Search as SearchIcon, ImageOutlined as ImageIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { ServiceRequest } from '../types';
import { PageLoadingState } from '../components/PageLoadingState';

export const ServiceApprovalPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: services, loading, error, reload } = useData(() => apiService.getPendingServices());
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allServices = useMemo(() => {
    if (!services) return [];
    if (!searchQuery) return services;
    const lowerQuery = searchQuery.toLowerCase();
    return services.filter(s => 
      s.serviceName.toLowerCase().includes(lowerQuery) || 
      s.freelancerName.toLowerCase().includes(lowerQuery)
    );
  }, [services, searchQuery]);

  const handleViewDetails = (service: ServiceRequest, actionType: 'approve' | 'reject') => {
    setSelectedService(service);
    setAction(actionType);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedService(null);
    setAction(null);
    setRejectionReason('');
  };

  const handleApproveService = async () => {
    if (selectedService) {
      setProcessing(true);
      try {
        await apiService.approveService(selectedService.id);
        toast.success(t('services.approveSuccess', 'Service approved successfully!'));
        await reload();
        handleCloseDialog();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t('common.error', 'An error occurred'));
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleRejectService = async () => {
    if (selectedService) {
      setProcessing(true);
      try {
        await apiService.rejectService(selectedService.id, rejectionReason);
        toast.success(t('services.rejectSuccess', 'Service rejected'));
        await reload();
        handleCloseDialog();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t('common.error', 'An error occurred'));
      } finally {
        setProcessing(false);
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <PageLoadingState variant="cards" />
      </Container>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')}: {error}</Alert>;
  }

  return (
    <Container maxWidth="xl">
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          animation: 'ehtFadeRise 420ms ease both',
          background: theme => theme.palette.mode === 'dark'
            ? 'linear-gradient(140deg, rgba(64,47,15,0.72), rgba(40,30,12,0.78))'
            : 'linear-gradient(140deg, rgba(243,224,173,0.72), rgba(255,249,235,0.86))',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {t('services.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('services.subtitle')}
            </Typography>
          </Box>
          <Chip label={`${allServices.length} ${t('services.title')}`} color="primary" />
        </Stack>
      </Paper>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', animation: 'ehtFadeRise 480ms ease both' }}>
        <TextField
          size="small"
          placeholder={t('common.search', 'Search by service or freelancer...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 350 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {allServices.length === 0 && !searchQuery ? (
        <Alert severity="info">
          {t('services.title')}: 0
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {allServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{ height: '100%' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: 2,
                  }}
                >
                {service.images && service.images.length > 0 && service.images[0] ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.images[0]}
                    alt={service.serviceName}
                    sx={{ objectFit: 'cover' }}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/logo.png';
                      target.style.objectFit = 'contain';
                      target.style.padding = '2rem';
                      target.style.backgroundColor = 'rgba(183,138,42,0.06)';
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 200,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: theme => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(145deg, rgba(30,22,12,1) 0%, rgba(20,14,8,1) 100%)'
                        : 'linear-gradient(145deg, #fbf7ee 0%, #f1e9d3 100%)',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(235, 202, 126, 0.08)' : 'rgba(183, 138, 42, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1.5
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 28, color: 'primary.main', opacity: 0.8 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {t('common.noImage', 'لا توجد صورة')}
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ mb: 2.25 }}>
                    <Chip
                      label={service.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={t(`common.${service.status}`)}
                      size="small"
                      color={service.status === 'pending' ? 'warning' : service.status === 'approved' ? 'success' : 'default'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {service.serviceName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2.25 }}>
                    {service.description}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('services.freelancer')}: {service.freelancerName}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main', mt: 1 }}>
                    SAR {service.price.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                    {t('common.createdAt')}: {new Date(service.submittedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ gap: 1, px: 2.5, pb: 2.25, pt: 0 }}>
                  {service.status === 'pending' ? (
                    <>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleViewDetails(service, 'approve')}
                        disabled={processing}
                        fullWidth
                      >
                        {t('services.accept')}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleViewDetails(service, 'reject')}
                        disabled={processing}
                        fullWidth
                      >
                        {t('services.reject')}
                      </Button>
                    </>
                  ) : (
                    <Button size="small" variant="outlined" fullWidth disabled>
                      {t(`common.${service.status}`)}
                    </Button>
                  )}
                </CardActions>
              </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {action === 'approve' ? t('services.accept') : t('services.reject')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedService && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('services.serviceName')}
                </Typography>
                <Typography>{selectedService.serviceName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('services.freelancer')}
                </Typography>
                <Typography>{selectedService.freelancerName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('services.price')}
                </Typography>
                <Typography>SAR {selectedService.price.toLocaleString()}</Typography>
              </Box>

              {action === 'reject' && (
                <TextField
                  label={t('payments.rejectionReason')}
                  multiline
                  rows={4}
                  fullWidth
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder={t('payments.rejectionReason') || ''}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          {action === 'approve' ? (
            <Button
              onClick={handleApproveService}
              variant="contained"
              color="success"
              disabled={processing}
            >
              {t('services.accept')}
            </Button>
          ) : (
            <Button
              onClick={handleRejectService}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim() || processing}
            >
              {t('services.reject')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};
