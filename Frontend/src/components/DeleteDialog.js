import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, CircularProgress, Box,
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { useExpenses } from '../context/ExpenseContext';

export default function DeleteDialog({ open, onClose, expense }) {
  const { removeExpense } = useExpenses();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!expense) return;
    setLoading(true);
    try {
      await removeExpense(expense._id);
      onClose();
    } catch {
      // silent — context handles error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <WarningIcon sx={{ color: '#ef4444' }} />
          </Box>
          <Typography fontWeight={700} fontSize="1.05rem">Delete Expense</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary">
          Are you sure you want to delete{' '}
          <Typography component="span" fontWeight={600} color="text.primary">
            "{expense?.title}"
          </Typography>
          ? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{ minWidth: 100 }}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
