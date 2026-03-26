import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: 'center',
        mt: 'auto',
        color: 'text.secondary',
        borderTop: theme => `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(35, 25, 15, 0.4)' : 'rgba(255, 253, 250, 0.4)',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        © {year} {t('common.appName', 'البطل للتصوير والمناسبات')}. {t('common.allRightsReserved', 'جميع الحقوق محفوظة')}
      </Typography>
    </Box>
  );
};
