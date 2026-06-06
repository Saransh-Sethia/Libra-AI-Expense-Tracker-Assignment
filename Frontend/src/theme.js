import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f43f5e',
      light: '#fb7185',
      dark: '#e11d48',
    },
    success: { main: '#10b981', light: '#34d399', dark: '#059669' },
    warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
    info: { main: '#3b82f6' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, padding: '8px 18px' },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.12)',
          },
        },
        outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 700, fontSize: '1.125rem' } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
      },
    },
  },
});

export default theme;
