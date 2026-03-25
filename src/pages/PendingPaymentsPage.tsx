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
  Divider,
  Paper,
  Stack,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { PaymentProof } from '../types';
import { PageLoadingState } from '../components/PageLoadingState';

export const PendingPaymentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: payments, loading, error, reload } = useData(() => apiService.getPendingPayments());
  const [selectedPayment, setSelectedPayment] = useState<PaymentProof | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleViewDetails = (payment: PaymentProof, actionType: 'approve' | 'reject') => {
    setSelectedPayment(payment);
    setAction(actionType);
    setRejectionReason('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPayment(null);
    setAction(null);
    setRejectionReason('');
  };

  const handleApprovePayment = async () => {
    if (selectedPayment) {
      setProcessing(true);
      try {
        await apiService.approvePayment(selectedPayment.id);
        await reload();
        handleCloseDialog();
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleRejectPayment = async () => {
    if (selectedPayment) {
      setProcessing(true);
      try {
        await apiService.rejectPayment(selectedPayment.id, rejectionReason);
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

  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];

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
              {t('payments.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('payments.subtitle')}
            </Typography>
          </Box>
          <Chip label={`${pendingPayments.length} ${t('payments.pending')}`} color="primary" />
        </Stack>
      </Paper>

      {pendingPayments.length === 0 ? (
        <Alert severity="success">
          {t('payments.allVerified')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {pendingPayments.map((payment, index) => (
            <Grid item xs={12} md={6} lg={4} key={payment.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'warning.main',
                  overflow: 'hidden',
                  animation: 'ehtFadeRise 520ms ease both',
                  animationDelay: `${index * 90}ms`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                {/* Receipt Image */}
                {payment.receiptImage && (
                  <CardMedia
                    component="img"
                    height="250"
                    image={payment.receiptImage}
                    alt="Payment Receipt"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                      (e.target as any).src = 'https://via.placeholder.com/300x250?text=Receipt+Not+Available';
                    }}
                    sx={{
                      objectFit: 'contain',
                      p: 1.5,
                      bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.26)' : 'rgba(255,255,255,0.72)',
                    }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  {/* Header with Status */}
                  <Box sx={{ mb: 2.25, pb: 2.25, borderBottom: '1px solid ', borderColor: 'divider' }}>
                    <Chip
                      label={t(`common.${payment.status}`)}
                      color="warning"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                      {payment.amount} {payment.currency}
                    </Typography>
                  </Box>

                  {/* Customer Details */}
                  <Box sx={{ mb: 2.25 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.customer')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.customerName}
                    </Typography>
                  </Box>

                  {/* Freelancer Details */}
                  <Box sx={{ mb: 2.25 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.freelancer')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.freelancerName}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Sender Details */}
                  <Box sx={{ mb: 2.25 }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      {t('payments.senderDetails')}
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.75,
                        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.84)',
                      }}
                    >
                      <Typography variant="body2">
                        <strong>{t('customers.name')}:</strong> {payment.senderName}
                      </Typography>
                      <Typography variant="body2">
                        <strong>{t('payments.transferDate')}:</strong>{' '}
                        {new Date(payment.transferDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        <strong>{t('common.bank')}:</strong> {payment.senderBank}
                      </Typography>
                    </Paper>
                  </Box>

                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    {t('common.createdAt')}: {new Date(payment.submittedAt).toLocaleDateString()}
                  </Typography>
                </CardContent>

                {/* Action Buttons */}
                <CardActions sx={{ gap: 1, pt: 0, px: 2.5, pb: 2.25 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleViewDetails(payment, 'approve')}
                    disabled={processing}
                    fullWidth
                  >
                    {t('payments.approvePayment')}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => handleViewDetails(payment, 'reject')}
                    disabled={processing}
                    fullWidth
                  >
                    {t('payments.rejectPayment')}
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
          {action === 'approve' ? t('payments.approvePayment') : t('payments.rejectPayment')}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedPayment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.customer')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedPayment.customerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.freelancer')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedPayment.freelancerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.amount')}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {selectedPayment.amount} {selectedPayment.currency}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.transferDate')}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(selectedPayment.transferDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Divider />

              <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                  {t('common.senderDetails')}:
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedPayment.senderName}
                </Typography>
                <Typography variant="body2">
                  <strong>{t('common.bank')}:</strong> {selectedPayment.senderBank}
                </Typography>
              </Box>

              {action === 'reject' && (
                <TextField
                  label={t('payments.rejectionReason')}
                  multiline
                  rows={4}
                  fullWidth
                  value={rejectionReason}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRejectionReason(e.target.value)}
                  placeholder={t('payments.rejectionPlaceholder') || ''}
                />
              )}

              {action === 'approve' && (
                <Alert severity="info">
                  {t('payments.approveHint')}
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          {action === 'approve' ? (
            <Button
              onClick={handleApprovePayment}
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              disabled={processing}
            >
              {t('payments.approvePayment')}
            </Button>
          ) : (
            <Button
              onClick={handleRejectPayment}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim() || processing}
              startIcon={<CancelIcon />}
            >
              {t('payments.rejectPayment')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};
