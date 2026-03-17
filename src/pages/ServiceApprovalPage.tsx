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
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { ServiceRequest } from '../types';

export const ServiceApprovalPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: services, loading, error } = useData(() => apiService.getPendingServices());
  const [selectedService, setSelectedService] = useState<ServiceRequest | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

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
      await apiService.approveService(selectedService.id);
      handleCloseDialog();
    }
  };

  const handleRejectService = async () => {
    if (selectedService) {
      await apiService.rejectService(selectedService.id, rejectionReason);
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{t('common.error')}: {error}</Alert>;
  }

  const pendingServices = services?.filter(s => s.status === 'pending') || [];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('services.title')}
      </Typography>

      {pendingServices.length === 0 ? (
        <Alert severity="info">
          {t('services.pending')}: 0
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {pendingServices.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
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
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={service.category}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {service.serviceName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
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
                <CardActions sx={{ gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleViewDetails(service, 'approve')}
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
                    fullWidth
                  >
                    {t('services.reject')}
                  </Button>
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
            >
              {t('services.accept')}
            </Button>
          ) : (
            <Button
              onClick={handleRejectService}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim()}
            >
              {t('services.reject')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};
