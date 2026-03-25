import React from 'react';
import { Box, Grid, Paper, Skeleton, Stack } from '@mui/material';

type LoadingVariant = 'table' | 'cards' | 'stats';

interface PageLoadingStateProps {
  variant?: LoadingVariant;
}

export const PageLoadingState: React.FC<PageLoadingStateProps> = ({ variant = 'cards' }) => {
  if (variant === 'table') {
    return (
      <Stack spacing={2.5}>
        <Paper sx={{ p: { xs: 2, md: 3 }, animation: 'ehtFadeRise 420ms ease both' }}>
          <Skeleton variant="text" width={260} height={42} />
          <Skeleton variant="text" width="50%" height={24} />
        </Paper>

        <Paper sx={{ p: 2, animation: 'ehtFadeRise 520ms ease both' }}>
          <Stack spacing={1.5}>
            <Skeleton variant="rectangular" height={42} sx={{ borderRadius: 2 }} />
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={34}
                sx={{ borderRadius: 1.5, animationDelay: `${index * 90}ms` }}
              />
            ))}
          </Stack>
        </Paper>
      </Stack>
    );
  }

  if (variant === 'stats') {
    return (
      <Stack spacing={2.5}>
        <Paper sx={{ p: { xs: 2, md: 3 }, animation: 'ehtFadeRise 420ms ease both' }}>
          <Skeleton variant="text" width={220} height={40} />
          <Skeleton variant="text" width="65%" height={24} />
        </Paper>

        <Grid container spacing={2.5}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  animation: 'ehtFadeRise 560ms ease both',
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <Skeleton variant="text" width="55%" />
                <Skeleton variant="text" width="40%" height={42} sx={{ my: 1 }} />
                <Skeleton variant="circular" width={42} height={42} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2.5,
              animation: 'ehtFadeRise 520ms ease both',
              animationDelay: `${index * 90}ms`,
            }}
          >
            <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 2 }} />
            <Skeleton variant="text" width="70%" height={32} />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="45%" />
            <Box sx={{ display: 'flex', gap: 1.25, mt: 2 }}>
              <Skeleton variant="rectangular" width="50%" height={36} sx={{ borderRadius: 1.5 }} />
              <Skeleton variant="rectangular" width="50%" height={36} sx={{ borderRadius: 1.5 }} />
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
