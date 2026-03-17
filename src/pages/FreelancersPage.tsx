import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { Freelancer } from '../types';

export const FreelancersPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: freelancers, loading, error } = useData(() => apiService.getFreelancers());
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewDetails = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFreelancer(null);
  };

  const handleApprove = async () => {
    if (selectedFreelancer) {
      await apiService.approveFreelancer(selectedFreelancer.id);
      handleCloseDialog();
    }
  };

  const handleSuspend = async () => {
    if (selectedFreelancer) {
      await apiService.suspendFreelancer(selectedFreelancer.id);
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

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('freelancers.title')}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>{t('freelancers.portfolio')}</TableCell>
              <TableCell>{t('customers.email')}</TableCell>
              <TableCell align="center">{t('freelancers.rating')}</TableCell>
              <TableCell align="center">{t('freelancers.totalProjects')}</TableCell>
              <TableCell>{t('freelancers.accountStatus')}</TableCell>
              <TableCell align="center">{t('customers.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {freelancers && freelancers.length > 0 ? (
              freelancers.map((freelancer) => (
                <TableRow key={freelancer.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{freelancer.name}</TableCell>
                  <TableCell>{freelancer.email}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Rating value={freelancer.rating} readOnly precision={0.5} />
                      <Typography sx={{ ml: 1 }}>({freelancer.rating})</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">{freelancer.totalProjects}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`common.${freelancer.accountStatus}`)}
                      color={getStatusColor(freelancer.accountStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      size="small"
                      onClick={() => handleViewDetails(freelancer)}
                    >
                      {t('customers.viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography>{t('common.loading')}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('customers.viewDetails')}</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedFreelancer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.name')}
                </Typography>
                <Typography>{selectedFreelancer.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.email')}
                </Typography>
                <Typography>{selectedFreelancer.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('freelancers.rating')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={selectedFreelancer.rating} readOnly />
                  <Typography sx={{ ml: 1 }}>{selectedFreelancer.rating}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('freelancers.totalProjects')}
                </Typography>
                <Typography>{selectedFreelancer.totalProjects}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('freelancers.accountStatus')}
                </Typography>
                <Chip
                  label={t(`common.${selectedFreelancer.accountStatus}`)}
                  color={getStatusColor(selectedFreelancer.accountStatus)}
                  sx={{ mt: 1 }}
                />
              </Box>
              {selectedFreelancer.bankDetails && (
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('freelancers.bankDetails')}
                  </Typography>
                  <Typography variant="body2">
                    Account: {selectedFreelancer.bankDetails.accountNumber}
                  </Typography>
                  <Typography variant="body2">{t('common.bank')}: {selectedFreelancer.bankDetails.bankName}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          {selectedFreelancer?.accountStatus !== 'approved' && (
            <Button onClick={handleApprove} variant="contained" color="success">
              {t('freelancers.approve')}
            </Button>
          )}
          {selectedFreelancer?.accountStatus !== 'suspended' && (
            <Button onClick={handleSuspend} variant="contained" color="error">
              {t('freelancers.suspend')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};
