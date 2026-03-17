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
  Divider,
  Paper,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { PaymentProof } from '../types';

export const PendingPaymentsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: payments, loading, error } = useData(() => apiService.getPendingPayments());
  const [selectedPayment, setSelectedPayment] = useState<PaymentProof | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

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
      await apiService.approvePayment(selectedPayment.id);
      handleCloseDialog();
    }
  };

  const handleRejectPayment = async () => {
    if (selectedPayment) {
      await apiService.rejectPayment(selectedPayment.id, rejectionReason);
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

  const pendingPayments = payments?.filter(p => p.status === 'pending') || [];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('payments.title')}
      </Typography>

      {pendingPayments.length === 0 ? (
        <Alert severity="success">
          {t('payments.allVerified')}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {pendingPayments.map((payment) => (
            <Grid item xs={12} md={6} lg={4} key={payment.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '2px solid',
                  borderColor: 'warning.main',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
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
                    sx={{ objectFit: 'contain', p: 1, bgcolor: 'grey.100' }}
                  />
                )}

                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header with Status */}
                  <Box sx={{ mb: 2, pb: 2, borderBottom: '1px solid ', borderColor: 'divider' }}>
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
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.customer')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.customerName}
                    </Typography>
                  </Box>

                  {/* Freelancer Details */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('payments.freelancer')}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {payment.freelancerName}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Sender Details */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      {t('payments.senderDetails')}
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'grey.50' }}>
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
                <CardActions sx={{ gap: 1, pt: 0 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleViewDetails(payment, 'approve')}
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
            >
              {t('payments.approvePayment')}
            </Button>
          ) : (
            <Button
              onClick={handleRejectPayment}
              variant="contained"
              color="error"
              disabled={!rejectionReason.trim()}
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
