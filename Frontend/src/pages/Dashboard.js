import React, { useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, CardHeader,
  Chip, Skeleton, Alert, Button, Avatar, Divider,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CalendarMonth as CalendarIcon,
  Receipt as ReceiptIcon,
  TrendingUp as TrendingIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip as ReTooltip, PieChart, Pie, Cell, Legend,
} from 'recharts';
import dayjs from 'dayjs';
import { useExpenses } from '../context/ExpenseContext';
import StatsCard from '../components/StatsCard';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_BG, MONTHS } from '../constants';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, boxShadow: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
      <Typography fontWeight={700} color="primary.main">{formatCurrency(payload[0].value)}</Typography>
    </Box>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1.5, boxShadow: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{payload[0].name}</Typography>
      <Typography fontWeight={700}>{formatCurrency(payload[0].value)}</Typography>
    </Box>
  );
};

function getMonthlyChartData(monthlyTrend) {
  const now = dayjs();
  return Array.from({ length: 6 }, (_, i) => {
    const m = now.subtract(5 - i, 'month');
    const found = monthlyTrend?.find(
      (t) => t._id.year === m.year() && t._id.month === m.month() + 1
    );
    return { name: m.format('MMM'), amount: found?.total || 0 };
  });
}

export default function Dashboard({ onAddExpense }) {
  const { stats, statsLoading, fetchStats } = useExpenses();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const monthlyData = getMonthlyChartData(stats?.monthlyTrend);
  const categoryData = (stats?.byCategory || []).map((c) => ({
    name: c._id,
    value: c.total,
  }));

  const totalCount = stats?.total?.count || 0;
  const avgPerTx = totalCount > 0 ? (stats?.total?.total || 0) / totalCount : 0;
  const topCategory = stats?.byCategory?.[0]?._id || '—';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Dashboard</Typography>
          <Typography color="text.secondary" variant="body2">
            {dayjs().format('dddd, MMMM D, YYYY')}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddExpense}>
          Add Expense
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            loading={statsLoading}
            title="Total Expenses"
            value={formatCurrency(stats?.total?.total)}
            subtitle={`${totalCount} transactions`}
            icon={<WalletIcon />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            loading={statsLoading}
            title="This Month"
            value={formatCurrency(stats?.monthly?.total)}
            subtitle={`${stats?.monthly?.count || 0} transactions`}
            icon={<CalendarIcon />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            loading={statsLoading}
            title="Avg. per Transaction"
            value={formatCurrency(avgPerTx)}
            subtitle="All time average"
            icon={<TrendingIcon />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            loading={statsLoading}
            title="Top Category"
            value={topCategory}
            subtitle={statsLoading ? '' : stats?.byCategory?.[0] ? formatCurrency(stats.byCategory[0].total) : ''}
            icon={<ReceiptIcon />}
            color="#f43f5e"
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Monthly Trend */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="Monthly Spending"
              subheader="Last 6 months"
              titleTypographyProps={{ fontWeight: 700, variant: 'h6' }}
              subheaderTypographyProps={{ variant: 'caption' }}
            />
            <CardContent sx={{ pt: 0 }}>
              {statsLoading ? (
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ) : monthlyData.every((d) => d.amount === 0) ? (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                      axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={60} />
                    <ReTooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                    <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardHeader
              title="By Category"
              subheader="All time breakdown"
              titleTypographyProps={{ fontWeight: 700, variant: 'h6' }}
              subheaderTypographyProps={{ variant: 'caption' }}
            />
            <CardContent sx={{ pt: 0 }}>
              {statsLoading ? (
                <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
              ) : categoryData.length === 0 ? (
                <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90}
                      dataKey="value" labelLine={false} label={renderCustomLabel}
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6b7280'} />
                      ))}
                    </Pie>
                    <ReTooltip content={<CustomPieTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <Typography component="span" variant="caption" color="text.secondary">{value}</Typography>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Card>
        <CardHeader
          title="Recent Transactions"
          subheader="Your last 5 expenses"
          titleTypographyProps={{ fontWeight: 700, variant: 'h6' }}
          subheaderTypographyProps={{ variant: 'caption' }}
        />
        <CardContent sx={{ pt: 0 }}>
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ py: 1.5 }}>
                <Skeleton height={40} />
                {i < 3 && <Divider sx={{ mt: 1.5 }} />}
              </Box>
            ))
          ) : !stats?.recent?.length ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No transactions yet</Typography>
              <Button startIcon={<AddIcon />} onClick={onAddExpense} sx={{ mt: 1 }}>
                Add your first expense
              </Button>
            </Box>
          ) : (
            stats.recent.map((exp, idx) => (
              <React.Fragment key={exp._id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 40, height: 40, borderRadius: 2,
                      bgcolor: CATEGORY_BG[exp.category] || '#f1f5f9',
                    }}
                  >
                    <Typography fontSize={18}>
                      {({ 'Food & Dining': '🍽', Transportation: '🚗', Housing: '🏠',
                        Entertainment: '🎬', Healthcare: '💊', Shopping: '🛍',
                        Education: '📚', Travel: '✈️', 'Bills & Utilities': '💡', Other: '📌',
                      })[exp.category] || '💰'}
                    </Typography>
                  </Avatar>
                  <Box flexGrow={1} minWidth={0}>
                    <Typography fontWeight={600} noWrap>{exp.title}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={exp.category}
                        size="small"
                        sx={{
                          height: 20, fontSize: '0.65rem',
                          bgcolor: CATEGORY_BG[exp.category],
                          color: CATEGORY_COLORS[exp.category],
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(exp.date).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography fontWeight={700} color="error.main" sx={{ flexShrink: 0 }}>
                    -{formatCurrency(exp.amount)}
                  </Typography>
                </Box>
                {idx < stats.recent.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
