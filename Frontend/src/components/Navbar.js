import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, useMediaQuery, Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Menu as MenuIcon,
  AccountBalanceWallet as WalletIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
  { label: 'Expenses', path: '/expenses', icon: <ReceiptIcon fontSize="small" /> },
];

export default function Navbar({ onAddExpense }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1, minHeight: 64 }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 2 }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WalletIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: '-0.03em' }}>
              Libra AI
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive(item.path) ? 'rgba(99,102,241,0.08)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(99,102,241,0.08)', color: 'primary.main' },
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          {/* Add Expense Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddExpense}
            size={isMobile ? 'small' : 'medium'}
          >
            {isMobile ? 'Add' : 'Add Expense'}
          </Button>

          {/* Mobile Menu */}
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 0.5 }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700} color="primary">Libra AI</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <List sx={{ pt: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.path}
              selected={isActive(item.path)}
              onClick={() => { navigate(item.path); setDrawerOpen(false); }}
              sx={{ borderRadius: 2, mx: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isActive(item.path) ? 600 : 400 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
