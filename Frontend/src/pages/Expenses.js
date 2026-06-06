import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Chip, TextField, MenuItem, InputAdornment,
  Tooltip, Skeleton, Alert, Button, Grid, Avatar,
} from '@mui/material';
import {
  Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon,
  Add as AddIcon, FilterList as FilterIcon, ReceiptLong as EmptyIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { useExpenses } from '../context/ExpenseContext';
import DeleteDialog from '../components/DeleteDialog';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_BG, SORT_OPTIONS, formatCurrency } from '../constants';

const EMOJI_MAP = {
  'Food & Dining': '🍽', Transportation: '🚗', Housing: '🏠',
  Entertainment: '🎬', Healthcare: '💊', Shopping: '🛍',
  Education: '📚', Travel: '✈️', 'Bills & Utilities': '💡', Other: '📌',
};

export default function Expenses({ onEdit }) {
  const { expenses, loading, error, filters, setFilters, fetchExpenses } = useExpenses();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    fetchExpenses(filters);
  }, [filters, fetchExpenses]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput });
        setPage(0);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleCategoryChange = (e) => {
    setFilters({ category: e.target.value });
    setPage(0);
  };

  const handleSortChange = (e) => {
    setFilters({ sort: e.target.value });
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({ search: '', category: 'All', sort: '-date' });
    setPage(0);
  };

  const hasActiveFilters =
    filters.search || filters.category !== 'All' || filters.sort !== '-date';

  const paginated = expenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Expenses</Typography>
          <Typography color="text.secondary" variant="body2">
            {loading ? 'Loading...' : `${expenses.length} transaction${expenses.length !== 1 ? 's' : ''} found`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => onEdit(null)}>
          Add Expense
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 2.5, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5} md={4}>
            <TextField
              fullWidth
              placeholder="Search expenses..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchInput('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <TextField
              select fullWidth label="Category"
              value={filters.category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="All">All Categories</MenuItem>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={6} sm={3} md={3}>
            <TextField
              select fullWidth label="Sort By"
              value={filters.sort}
              onChange={handleSortChange}
            >
              {SORT_OPTIONS.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
            </TextField>
          </Grid>

          {hasActiveFilters && (
            <Grid item xs={12} sm="auto">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
              >
                Clear
              </Button>
            </Grid>
          )}
        </Grid>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& .MuiTableCell-head': { bgcolor: '#f8fafc' } }}>
                <TableCell>EXPENSE</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell align="right">AMOUNT</TableCell>
                <TableCell align="center">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Box sx={{ py: 8, textAlign: 'center' }}>
                      <EmptyIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 1.5 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No expenses found
                      </Typography>
                      <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                        {hasActiveFilters
                          ? 'Try adjusting your filters'
                          : 'Start by adding your first expense'}
                      </Typography>
                      {!hasActiveFilters && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={() => onEdit(null)}>
                          Add Expense
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((exp) => (
                  <TableRow
                    key={exp._id}
                    hover
                    sx={{ '&:last-child td': { border: 0 }, cursor: 'default' }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar
                          sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: CATEGORY_BG[exp.category] || '#f1f5f9', fontSize: 18 }}
                        >
                          {EMOJI_MAP[exp.category] || '💰'}
                        </Avatar>
                        <Box>
                          <Typography fontWeight={600} variant="body2">{exp.title}</Typography>
                          {exp.description && (
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                              {exp.description}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={exp.category}
                        size="small"
                        sx={{
                          bgcolor: CATEGORY_BG[exp.category],
                          color: CATEGORY_COLORS[exp.category],
                          fontWeight: 600,
                          fontSize: '0.7rem',
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(exp.date).format('MMM D, YYYY')}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography fontWeight={700} color="error.main">
                        -{formatCurrency(exp.amount)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => onEdit(exp)}
                            sx={{ color: 'primary.main', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => setDeleteTarget(exp)}
                            sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && expenses.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={expenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        )}
      </Card>

      <DeleteDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        expense={deleteTarget}
      />
    </Box>
  );
}
