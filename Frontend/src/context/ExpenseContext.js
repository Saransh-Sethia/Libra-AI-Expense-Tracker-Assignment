import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import * as api from '../api/expenseApi';

const ExpenseContext = createContext();

const DEFAULT_FILTERS = { search: '', category: 'All', sort: '-date' };

function getInitialState() {
  let savedFilters = {};
  try { savedFilters = JSON.parse(localStorage.getItem('expense-filters')) || {}; } catch {}
  return {
    expenses: [],
    stats: null,
    loading: false,
    statsLoading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS, ...savedFilters },
    notification: { open: false, message: '', severity: 'success' },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_STATS_LOADING':
      return { ...state, statsLoading: action.payload };
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload, loading: false, error: null };
    case 'SET_STATS':
      return { ...state, stats: action.payload, statsLoading: false };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e._id === action.payload._id ? action.payload : e
        ),
      };
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((e) => e._id !== action.payload) };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SHOW_NOTIFICATION':
      return { ...state, notification: { open: true, ...action.payload } };
    case 'HIDE_NOTIFICATION':
      return { ...state, notification: { ...state.notification, open: false } };
    default:
      return state;
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);
  const filtersRef = useRef(state.filters);

  useEffect(() => {
    filtersRef.current = state.filters;
    localStorage.setItem('expense-filters', JSON.stringify(state.filters));
  }, [state.filters]);

  const fetchExpenses = useCallback(async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;
      const res = await api.getExpenses(params);
      dispatch({ type: 'SET_EXPENSES', payload: res.data.data });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: err.response?.data?.message || 'Failed to fetch expenses',
      });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    dispatch({ type: 'SET_STATS_LOADING', payload: true });
    try {
      const res = await api.getStats();
      dispatch({ type: 'SET_STATS', payload: res.data.data });
    } catch (err) {
      dispatch({ type: 'SET_STATS_LOADING', payload: false });
    }
  }, []);

  const showNotification = useCallback((message, severity = 'success') => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: { message, severity } });
  }, []);

  const hideNotification = useCallback(() => {
    dispatch({ type: 'HIDE_NOTIFICATION' });
  }, []);

  const addExpense = async (data) => {
    const res = await api.createExpense(data);
    dispatch({ type: 'ADD_EXPENSE', payload: res.data.data });
    fetchStats();
    showNotification('Expense added successfully');
    return res.data.data;
  };

  const updateExpense = async (id, data) => {
    const res = await api.updateExpense(id, data);
    dispatch({ type: 'UPDATE_EXPENSE', payload: res.data.data });
    fetchStats();
    showNotification('Expense updated successfully');
    return res.data.data;
  };

  const removeExpense = async (id) => {
    await api.deleteExpense(id);
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    fetchStats();
    showNotification('Expense deleted successfully');
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        fetchExpenses,
        fetchStats,
        addExpense,
        updateExpense,
        removeExpense,
        setFilters,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider');
  return ctx;
}
