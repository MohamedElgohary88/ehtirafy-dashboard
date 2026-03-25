import React, { useState } from 'react';
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
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
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
        await reload();
        handleCloseDialog();
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
        await reload();
        handleCloseDialog();
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

  const allServices = services || [];

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

      {allServices.length === 0 ? (
        <Alert severity="info">
          {t('services.title')}: 0
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {allServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  animation: 'ehtFadeRise 520ms ease both',
                  animationDelay: `${index * 90}ms`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 6,
                  },
                }}
              >
                {service.images && service.images.length > 0 && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.images[0]}
                    alt={service.serviceName}
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      (e.target as any).src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
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
