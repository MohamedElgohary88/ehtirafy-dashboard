import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#b78a2a',
        light: '#d8b15a',
        dark: '#8d681a',
        contrastText: '#1f1704',
      },
      secondary: {
        main: '#0f766e',
        light: '#2e9e95',
        dark: '#0a5a53',
        contrastText: '#ecffff',
      },
      background: {
        default: isDarkMode ? '#16120a' : '#f8f4ea',
        paper: isDarkMode ? '#241a0f' : '#fffdfa',
      },
      text: {
        primary: isDarkMode ? '#f8f0df' : '#2c220f',
        secondary: isDarkMode ? '#d7c7a2' : '#655430',
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: '"Tajawal", "IBM Plex Sans Arabic", "Segoe UI", sans-serif',
      h1: {
        fontSize: '2.4rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(74,54,16,0.95), rgba(140,105,33,0.9))'
              : 'linear-gradient(135deg, rgba(226,191,117,0.96), rgba(183,138,42,0.9))',
            backdropFilter: 'blur(8px)',
            boxShadow: isDarkMode
              ? '0 10px 30px rgba(0,0,0,0.35)'
              : '0 10px 25px rgba(120,87,24,0.26)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: isDarkMode ? '1px solid rgba(235, 202, 126, 0.18)' : '1px solid rgba(181, 138, 47, 0.16)',
            boxShadow: isDarkMode
              ? '0 10px 30px rgba(0,0,0,0.28)'
              : '0 10px 24px rgba(146,112,45,0.12)',
            transition: 'transform 180ms ease, box-shadow 180ms ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            '& .MuiTableCell-head': {
              fontWeight: 700,
              color: isDarkMode ? '#f4e3bf' : '#5b4514',
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(183,138,42,0.08)' : 'rgba(183,138,42,0.06)',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
