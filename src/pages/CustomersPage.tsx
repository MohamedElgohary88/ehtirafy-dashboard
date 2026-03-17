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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { Customer } from '../types';

export const CustomersPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: customers, loading, error } = useData(() => apiService.getCustomers());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCustomer(null);
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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('customers.title')}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>{t('customers.name')}</TableCell>
              <TableCell>{t('customers.email')}</TableCell>
              <TableCell>{t('customers.phone')}</TableCell>
              <TableCell align="center">{t('customers.totalBookings')}</TableCell>
              <TableCell align="right">{t('customers.totalSpent')}</TableCell>
              <TableCell>{t('customers.status')}</TableCell>
              <TableCell align="center">{t('customers.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell align="center">{customer.totalBookings}</TableCell>
                  <TableCell align="right">
                    SAR {customer.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`common.${customer.status}`)}
                      color={customer.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(customer)}
                      title={t('customers.viewDetails') || ''}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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
          {selectedCustomer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.name')}
                </Typography>
                <Typography>{selectedCustomer.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.email')}
                </Typography>
                <Typography>{selectedCustomer.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.phone')}
                </Typography>
                <Typography>{selectedCustomer.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.totalBookings')}
                </Typography>
                <Typography>{selectedCustomer.totalBookings}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('customers.totalSpent')}
                </Typography>
                <Typography>SAR {selectedCustomer.totalSpent.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {t('common.createdAt')}
                </Typography>
                <Typography>{new Date(selectedCustomer.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
