import React, { useEffect, useState } from 'react';
import {
  Typography, Grid, Paper, Box, CircularProgress, Alert, Card, CardContent
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from '../config/axios';
import { useTheme } from '@mui/material/styles';

const DashboardStats: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presentationStats, setPresentationStats] = useState<any[]>([]);
  const [domainChartData, setDomainChartData] = useState<any>(null);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.success.main,
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/papers/stats/public');
        const allPapersRes = await axios.get('/papers');

        const { presentationStats } = res.data.data;
        const domainLabels = Object.keys(allPapersRes.data.data);
        const domainCounts = domainLabels.map(domain => allPapersRes.data.data[domain].length);

        setPresentationStats([
          { name: 'Presented', value: presentationStats?.presented || 0 },
          { name: 'In Progress', value: presentationStats?.inProgress || 0 },
          { name: 'Scheduled', value: presentationStats?.scheduled || 0 },
          { name: 'Cancelled', value: presentationStats?.cancelled || 0 },
        ]);
        setDomainChartData({
          labels: domainLabels,
          datasets: [
            {
              label: 'Number of Papers',
              data: domainCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderRadius: 6
            }
          ]
        });
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const renderLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, value, name } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = (percent * 100).toFixed(0);
    return (
      <text x={x} y={y} fill={theme.palette.text.primary} textAnchor="start" dominantBaseline="central" fontSize="12px">
        {`${name}: ${value} (${percentage}%)`}
      </text>
    );
  };

  if (loading) return <Box textAlign="center" py={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Conference Stats
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle1" color="text.secondary">Total Papers</Typography>
            <Typography variant="h5">
              {presentationStats.reduce((acc, stat) => acc + stat.value, 0)}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle1" color="text.secondary">Presented</Typography>
            <Typography variant="h5" color="success.main">
              {presentationStats.find(stat => stat.name === 'Presented')?.value || 0}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle1" color="text.secondary">Scheduled</Typography>
            <Typography variant="h5" color="primary">
              {presentationStats.find(stat => stat.name === 'Scheduled')?.value || 0}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle1" color="text.secondary">Cancelled</Typography>
            <Typography variant="h5" color="error">
              {presentationStats.find(stat => stat.name === 'Cancelled')?.value || 0}
            </Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Presentation Pie Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 5, height: 400 }}>
            <Typography variant="h6" gutterBottom>Presentation Status</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={presentationStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={renderLabel}
                >
                  {presentationStats.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 5, height: 400 }}>
            <Typography variant="h6" gutterBottom>Domain-wise Paper Distribution</Typography>
            <Bar
              data={domainChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;
