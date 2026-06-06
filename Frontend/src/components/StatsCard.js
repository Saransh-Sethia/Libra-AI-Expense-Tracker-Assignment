import React from 'react';
import { Card, CardContent, Box, Typography, Skeleton } from '@mui/material';

export default function StatsCard({ icon, title, value, subtitle, color, loading }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={120} height={40} />
            ) : (
              <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                {value}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {loading ? <Skeleton width={80} /> : subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: color ? `${color}18` : 'primary.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              ml: 1,
            }}
          >
            <Box sx={{ color: color || 'primary.main', display: 'flex' }}>{icon}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
