import { createTheme } from '@mui/material/styles';

// Kraus Anderson inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e12726', // KA Red
      light: '#e85454',
      dark: '#b31e1d',
      contrastText: '#fff',
    },
    secondary: {
      main: '#002654', // KA Dark Blue
      light: '#14406b',
      dark: '#001b3d',
      contrastText: '#fff',
    },
    success: {
      main: '#28a745',
      light: '#48c664',
      dark: '#1e7e34',
    },
    warning: {
      main: '#ffc107',
      light: '#ffcd38',
      dark: '#e0a800',
    },
    error: {
      main: '#e12726',
      light: '#e85454',
      dark: '#b31e1d',
    },
    info: {
      main: '#3771b0', // KA Light Blue
      light: '#5b8cc5',
      dark: '#14406b',
    },
    background: {
      default: '#f1f1f1', // KA Light Grey
      paper: '#fff',
    },
    text: {
      primary: '#333333', // KA Dark Grey
      secondary: '#62727b', // KA Grey
    },
  },
  typography: {
    fontFamily: [
      'Open Sans',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#002654',
    },
    h2: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      color: '#002654',
    },
    h3: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#002654',
    },
    h4: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#002654',
    },
    h5: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#002654',
    },
    h6: {
      fontFamily: 'Montserrat, "Helvetica Neue", Arial, sans-serif',
      fontSize: '1rem',
      fontWeight: 700,
      color: '#002654',
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 700,
      letterSpacing: '1px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          borderRadius: 0,
          boxShadow: 'none',
          padding: '0.75rem 1.5rem',
          fontWeight: 700,
          letterSpacing: '1px',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#b31e1d',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: '#14406b',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 0,
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
        colorPrimary: {
          backgroundColor: '#ffffff',
          color: '#333333',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '&.Mui-focused fieldset': {
              borderColor: '#3771b0',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          borderRadius: 0,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f1f1f1',
          '& .MuiTableCell-head': {
            color: '#002654',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(55, 113, 176, 0.05)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f1f1f1',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '1rem',
          borderLeft: '4px solid',
        },
        standardSuccess: {
          backgroundColor: '#d4edda',
          color: '#155724',
          borderLeftColor: '#28a745',
        },
        standardError: {
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderLeftColor: '#e12726',
        },
        standardWarning: {
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderLeftColor: '#ffc107',
        },
        standardInfo: {
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          borderLeftColor: '#3771b0',
        },
      },
    },
  },
});

export default theme;