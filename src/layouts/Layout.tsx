import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Camera as CameraIcon,
  DoneAll as DoneAllIcon,
  Payment as PaymentIcon,
  Logout as LogoutIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  Language as LanguageIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguageDirection } from '../hooks';
import { Footer } from '../components/Footer';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const isRTL = useLanguageDirection();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setAnchorElLang(null);
  };

  const changeLanguage = (lang: 'ar' | 'en') => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const navigationItems = [
    { label: t('nav.dashboard'), icon: <DashboardIcon />, path: '/' },
    { label: t('nav.customers'), icon: <PeopleIcon />, path: '/customers' },
    { label: t('nav.freelancers'), icon: <CameraIcon />, path: '/freelancers' },
    { label: t('nav.services'), icon: <DoneAllIcon />, path: '/services' },
    { label: t('nav.payments'), icon: <PaymentIcon />, path: '/payments' },
  ];

  const drawerContent = (
    <Box sx={{ width: 270, height: '100%' }}>
      <Box sx={{ px: 2.5, py: 2.25, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 36, objectFit: 'contain' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, fontSize: '1.1rem' }}>
              {t('common.appName')}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>
              Photography Marketplace
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ px: 1.25, py: 1.5 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              mb: 0.75,
              borderRadius: 2.5,
              textDecoration: 'none',
              color: 'inherit',
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
              '&:hover': {
                backgroundColor: theme => theme.palette.mode === 'dark'
                  ? 'rgba(215, 167, 72, 0.12)'
                  : 'rgba(183, 138, 42, 0.12)',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: isDarkMode ? '#2c220f' : '#fffdfa',
            color: isDarkMode ? '#f8f0df' : '#2c220f',
            border: isDarkMode ? '1px solid rgba(235, 202, 126, 0.18)' : '1px solid rgba(181, 138, 47, 0.16)',
            boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 25px rgba(120,87,24,0.18)',
            padding: '16px'
          },
        }}
      />
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <img src="/logo.png" alt="Logo" style={{ height: 32, objectFit: 'contain' }} />
            </Box>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {t('common.appName')}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 500 }}>
                Operations and approvals center
              </Typography>
            </Box>
          </Box>

          {/* Language Selector */}
          <IconButton
            color="inherit"
            onClick={handleLanguageMenu}
            sx={{ border: theme => `1px solid ${theme.palette.divider}`, mr: 1 }}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElLang}
            open={Boolean(anchorElLang)}
            onClose={handleLanguageClose}
          >
            <MenuItem
              onClick={() => changeLanguage('en')}
              selected={i18n.language === 'en'}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => changeLanguage('ar')}
              selected={i18n.language === 'ar'}
            >
              العربية
            </MenuItem>
          </Menu>

          {/* Theme Toggle */}
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ border: theme => `1px solid ${theme.palette.divider}` }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {onLogout && (
            <IconButton
              color="inherit"
              onClick={onLogout}
              sx={{ border: theme => `1px solid ${theme.palette.divider}`, ml: 1 }}
              title={t('nav.logout') || 'Logout'}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { sm: 270 },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          anchor={isRTL ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          anchor={isRTL ? 'right' : 'left'}
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 270,
              mt: 8,
              borderRight: theme => `1px solid ${theme.palette.divider}`,
              background: theme => theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, #2a1e10 0%, #23190f 100%)'
                : 'linear-gradient(180deg, #fffdfa 0%, #f8f1df 100%)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          width: { xs: '100%', sm: 'calc(100% - 270px)' },
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};
