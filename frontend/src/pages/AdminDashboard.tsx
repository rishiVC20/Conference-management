import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from '../config/axios';

interface PaperStats {
  domain: string;
  count: number;
}

interface StatusStats {
  status: string;
  count: number;
}

interface RoomStats {
  room: string;
  utilizationRate: number;
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [domainStats, setDomainStats] = useState<PaperStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [roomStats, setRoomStats] = useState<RoomStats[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch papers per domain
        const domainResponse = await axios.get('/api/stats/papers-by-domain');
        setDomainStats(domainResponse.data);

        // Fetch presentation status statistics
        const statusResponse = await axios.get('/api/stats/presentation-status');
        setStatusStats(statusResponse.data);

        // Fetch room utilization
        const roomResponse = await axios.get('/api/stats/room-utilization');
        setRoomStats(roomResponse.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Papers per Domain Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Papers per Domain
            </Typography>
            <ResponsiveContainer>
              <BarChart data={domainStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="domain" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Presentation Status Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Presentation Status
            </Typography>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusStats}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Room Utilization Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 300,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Room Utilization
            </Typography>
            <ResponsiveContainer>
              <BarChart data={roomStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="room" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="utilizationRate"
                  fill={theme.palette.primary.main}
                  name="Utilization Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 