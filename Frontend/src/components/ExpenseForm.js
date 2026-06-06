import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, CircularProgress,
  Alert, IconButton, Box, Typography, InputAdornment,
} from '@mui/material';
import { Close as CloseIcon, AttachMoney as MoneyIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../constants';

const INIT = { title: '', amount: '', category: '', description: '', date: dayjs() };

export default function ExpenseForm({ open, onClose, expense }) {
  const { addExpense, updateExpense } = useExpenses();
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const isEdit = Boolean(expense);

  useEffect(() => {
    if (open) {
      if (expense) {
        setForm({
          title: expense.title,
          amount: String(expense.amount),
          category: expense.category,
          description: expense.description || '',
          date: dayjs(expense.date),
        });
      } else {
        setForm(INIT);
      }
      setErrors({});
      setApiError('');
    }
  }, [open, expense]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length < 2) e.title = 'At least 2 characters';
    if (!form.amount) e.amount = 'Amount is required';
    else if (isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Must be a positive number';
    if (!form.category) e.category = 'Category is required';
    if (!form.date || !form.date.isValid()) e.date = 'Valid date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        title: form.title.trim(),
        amount: Number(form.amount),
        category: form.category,
        description: form.description.trim(),
        date: form.date.toISOString(),
      };
      if (isEdit) await updateExpense(expense._id, payload);
      else await addExpense(payload);
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700}>
            {isEdit ? 'Edit Expense' : 'Add New Expense'}
          </Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          {apiError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{apiError}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={form.title}
                onChange={handleChange('title')}
                error={Boolean(errors.title)}
                helperText={errors.title}
                placeholder="e.g. Grocery shopping"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Amount"
                fullWidth
                value={form.amount}
                onChange={handleChange('amount')}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
                placeholder="0.00"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                select
                fullWidth
                value={form.category}
                onChange={handleChange('category')}
                error={Boolean(errors.category)}
                helperText={errors.category}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={form.date}
                  onChange={(val) => {
                    setForm((prev) => ({ ...prev, date: val }));
                    if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: Boolean(errors.date),
                      helperText: errors.date,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description (optional)"
                fullWidth
                multiline
                rows={2}
                value={form.description}
                onChange={handleChange('description')}
                placeholder="Add a note about this expense..."
                inputProps={{ maxLength: 500 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ minWidth: 100 }}
          >
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Expense'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
