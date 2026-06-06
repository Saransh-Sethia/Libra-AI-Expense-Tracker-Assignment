import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { Container, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import theme from './theme';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import ExpenseForm from './components/ExpenseForm';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';

function NotificationSnackbar() {
  const { notification, hideNotification } = useExpenses();
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={3000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 2 }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  const openForm = (expense = null) => {
    setEditExpense(expense);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditExpense(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ExpenseProvider>
          <Router>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
              <Navbar onAddExpense={() => openForm()} />
              <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
                <Routes>
                  <Route path="/" element={<Dashboard onAddExpense={() => openForm()} />} />
                  <Route path="/expenses" element={<Expenses onEdit={openForm} />} />
                </Routes>
              </Container>
            </Box>
            <ExpenseForm open={formOpen} onClose={closeForm} expense={editExpense} />
          </Router>
          <NotificationSnackbar />
        </ExpenseProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
