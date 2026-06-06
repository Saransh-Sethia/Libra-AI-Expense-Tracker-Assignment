export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Travel',
  'Bills & Utilities',
  'Other',
];

export const CATEGORY_COLORS = {
  'Food & Dining': '#f59e0b',
  Transportation: '#3b82f6',
  Housing: '#8b5cf6',
  Entertainment: '#ec4899',
  Healthcare: '#10b981',
  Shopping: '#f43f5e',
  Education: '#6366f1',
  Travel: '#14b8a6',
  'Bills & Utilities': '#f97316',
  Other: '#6b7280',
};

export const CATEGORY_BG = {
  'Food & Dining': '#fef3c7',
  Transportation: '#dbeafe',
  Housing: '#ede9fe',
  Entertainment: '#fce7f3',
  Healthcare: '#d1fae5',
  Shopping: '#ffe4e6',
  Education: '#e0e7ff',
  Travel: '#ccfbf1',
  'Bills & Utilities': '#ffedd5',
  Other: '#f1f5f9',
};

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const SORT_OPTIONS = [
  { value: '-date', label: 'Newest First' },
  { value: 'date', label: 'Oldest First' },
  { value: '-amount', label: 'Highest Amount' },
  { value: 'amount', label: 'Lowest Amount' },
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
