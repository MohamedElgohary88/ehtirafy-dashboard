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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useData } from '../hooks';
import { apiService } from '../services/api';
import type { Freelancer } from '../types';
import { PageLoadingState } from '../components/PageLoadingState';

export const FreelancersPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: freelancers, loading, error } = useData(() => apiService.getFreelancers());
  const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredFreelancers = useMemo(() => {
    if (!freelancers) return [];
    return freelancers.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            f.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || f.accountStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [freelancers, searchQuery, statusFilter]);

  const handleViewDetails = (freelancer: Freelancer) => {
    setSelectedFreelancer(freelancer);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFreelancer(null);
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
              {t('freelancers.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('freelancers.subtitle')}
            </Typography>
          </Box>
          <Chip label={`${freelancers?.length || 0} ${t('nav.freelancers')}`} color="primary" />
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
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
          startAdornment={
            <InputAdornment position="start">
              <FilterIcon color="action" fontSize="small" />
            </InputAdornment>
          }
        >
          <MenuItem value="all">{t('common.all', 'All Status')}</MenuItem>
          <MenuItem value="approved">{t('common.approved')}</MenuItem>
          <MenuItem value="pending">{t('common.pending')}</MenuItem>
          <MenuItem value="suspended">{t('common.suspended')}</MenuItem>
        </Select>
      </Paper>

      <TableContainer component={Paper} sx={{ p: 0.5, animation: 'ehtFadeRise 560ms ease both' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('freelancers.portfolio')}</TableCell>
              <TableCell>{t('customers.email')}</TableCell>
              <TableCell align="center">{t('freelancers.rating')}</TableCell>
              <TableCell align="center">{t('freelancers.totalProjects')}</TableCell>
              <TableCell>{t('freelancers.accountStatus')}</TableCell>
              <TableCell align="center">{t('customers.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFreelancers && filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer) => (
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
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
          <Button onClick={handleCloseDialog}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
