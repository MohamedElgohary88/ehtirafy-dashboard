import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';
import type { Contract } from '../types';

const statusColor = (status: string): 'default' | 'info' | 'warning' | 'success' | 'error' => {
  const s = status.toLowerCase();
  if (s === 'completed') return 'success';
  if (s === 'inprocess') return 'info';
  if (s === 'approved') return 'info';
  if (s === 'paid') return 'info';
  if (s === 'pending') return 'warning';
  if (s === 'initiated') return 'default';
  if (s === 'cancelled' || s === 'rejected') return 'error';
  return 'default';
};

const statusLabel = (status: string, t: (key: string) => string): string => {
  const s = status.toLowerCase();
  if (s === 'completed') return t('contracts.statusCompleted');
  if (s === 'inprocess') return t('contracts.statusInProgress');
  if (s === 'approved') return t('contracts.statusApproved');
  if (s === 'paid') return t('contracts.statusPaid');
  if (s === 'pending') return t('contracts.statusPending');
  if (s === 'initiated') return t('contracts.statusInitiated');
  if (s === 'cancelled') return t('contracts.statusCancelled');
  if (s === 'rejected') return t('contracts.statusRejected');
  if (s === '-' || !s) return '-';
  return status;
};

export const ContractsPage = () => {
  const { t } = useTranslation();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiService.getContracts();
        setContracts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contracts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = contracts.filter((c) => {
    const matchesSearch =
      !search ||
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.freelancerName.toLowerCase().includes(search.toLowerCase()) ||
      c.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.includes(search);

    const matchesStatus =
      statusFilter === 'all' || c.contractStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          {t('contracts.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('contracts.subtitle')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder={t('contracts.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280 }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>{t('common.status')}</InputLabel>
          <Select
            value={statusFilter}
            label={t('common.status')}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">{t('contracts.allStatuses')}</MenuItem>
            <MenuItem value="initiated">{t('contracts.statusInitiated')}</MenuItem>
            <MenuItem value="pending">{t('contracts.statusPending')}</MenuItem>
            <MenuItem value="approved">{t('contracts.statusApproved')}</MenuItem>
            <MenuItem value="inprocess">{t('contracts.statusInProgress')}</MenuItem>
            <MenuItem value="completed">{t('contracts.statusCompleted')}</MenuItem>
            <MenuItem value="cancelled">{t('contracts.statusCancelled')}</MenuItem>
            <MenuItem value="rejected">{t('contracts.statusRejected')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>{t('contracts.customer')}</TableCell>
                <TableCell>{t('contracts.freelancer')}</TableCell>
                <TableCell>{t('contracts.service')}</TableCell>
                <TableCell>{t('contracts.amount')}</TableCell>
                <TableCell>{t('contracts.contractStatus')}</TableCell>
                <TableCell>{t('contracts.pubStatus')}</TableCell>
                <TableCell>{t('contracts.custStatus')}</TableCell>
                <TableCell>{t('common.createdAt')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">
                      {t('contracts.noContracts')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((contract) => (
                  <TableRow key={contract.id} hover>
                    <TableCell>{contract.id}</TableCell>
                    <TableCell>{contract.customerName}</TableCell>
                    <TableCell>{contract.freelancerName}</TableCell>
                    <TableCell>{contract.serviceName}</TableCell>
                    <TableCell>
                      {contract.amount > 0 ? `${contract.amount} SAR` : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabel(contract.contractStatus, t)}
                        color={statusColor(contract.contractStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabel(contract.pubStatus, t)}
                        color={statusColor(contract.pubStatus)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabel(contract.custStatus, t)}
                        color={statusColor(contract.custStatus)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
