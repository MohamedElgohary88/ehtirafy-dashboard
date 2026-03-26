import React, { useState, useMemo } from 'react';
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
  Alert,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';
import { Visibility as VisibilityIcon, Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { Customer } from '../types';
import { PageLoadingState } from '../components/PageLoadingState';

export const CustomersPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: customers, loading, error } = useData(() => apiService.getCustomers());
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [customers, searchQuery]);

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
      <Container maxWidth="xl">
        <PageLoadingState variant="table" />
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
              {t('customers.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('customers.subtitle')}
            </Typography>
          </Box>
          <Chip label={`${customers?.length || 0} ${t('nav.customers')}`} color="primary" />
        </Stack>
      </Paper>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', animation: 'ehtFadeRise 480ms ease both' }}>
        <TextField
          size="small"
          placeholder={t('common.search', 'Search by name or email...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ p: 0.5, animation: 'ehtFadeRise 560ms ease both' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('customers.name')}</TableCell>
              <TableCell>{t('customers.email')}</TableCell>
              <TableCell>{t('customers.phone')}</TableCell>
              <TableCell align="center">{t('customers.totalBookings')}</TableCell>
              <TableCell align="right">{t('customers.totalSpent')}</TableCell>
              <TableCell align="center">{t('customers.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers && filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell align="center">{customer.totalBookings}</TableCell>
                  <TableCell align="right">
                    SAR {customer.totalSpent.toLocaleString()}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
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
