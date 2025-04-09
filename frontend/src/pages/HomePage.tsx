import React, { useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  Grid,
  Paper
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';

const HomePage: React.FC = () => {
  const statsRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <img src="/logo.jpg" alt="PICT Logo" style={{ height: 40, marginRight: 10 }} />
            <Typography variant="h6" component="div">
              Conference 2026
            </Typography>
          </Box>
          <Box>
            <Button color="inherit" component={RouterLink} to="/">Home</Button>
            <Button color="inherit" onClick={handleScrollToStats}>Dashboard</Button>
            <Button color="inherit" component={RouterLink} to="/timetable">Timetable</Button>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register">Register</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          height: '40vh',
          backgroundImage: `url('/college.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
          bgcolor: 'rgba(0,0,0,0.5)',
          backgroundBlendMode: 'darken',
          px: 2
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            ICEI-2026
          </Typography>
          <Typography variant="h6">
            3rd International Conference on Emerging Trends and Innovations in ICT (ICEI-2026)
          </Typography>
        </Box>
      </Box>

      {/* About Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          About the Conference
        </Typography>
        <Typography align="center" maxWidth="md" sx={{ mx: 'auto' }}>
          SCTR's Pune Institute of Computer Technology is organising the 3rd edition of the
          International Conference on Emerging Trends and Innovations in ICT (ICEI-2026) from
          9th to 11th January 2026.<br /><br />
          ICEI-2026 has leading researchers, academicians, and industrialists of international
          repute on its advisory board. The conference invites researchers, academicians,
          professionals, practitioners, and students to share their knowledge through high-quality
          original research papers proposing novel solutions and case studies addressing real-world
          problems.<br /><br />
          The conference features keynote speeches, industrial workshops, tutorials, and panel
          discussions on current trends in various domains. ICEI-2026 includes 7 tracks for paper
          publications covering all topics related to emerging trends and innovations in ICT.
          The conference will be conducted in offline mode, with a hybrid option available for
          international delegates.
        </Typography>
      </Container>

      {/* Dashboard Stats Section */}
      <div ref={statsRef}>
        <DashboardStats />
      </div>

      {/* Highlights */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Event Highlights
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: 'Keynote Speakers',
              desc: 'Renowned speakers from industry and academia.',
            },
            {
              title: 'Paper Presentations',
              desc: 'Peer-reviewed research across multiple domains.',
            },
            {
              title: 'Workshops & Panels',
              desc: 'Hands-on learning with experts and panel discussions.',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {item.title}
                </Typography>
                <Typography>{item.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Important Dates */}
      <Box bgcolor="#f5f5f5" py={6}>
        <Container>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Important Dates
          </Typography>
          <Box textAlign="center">
            <Typography>Paper Submission Deadline: Oct 15, 2025</Typography>
            <Typography>Notification of Acceptance: Nov 10, 2025</Typography>
            <Typography>Conference Dates: Jan 9–11, 2026</Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box textAlign="center" py={4} borderTop="1px solid #ddd" bgcolor="white">
        <Typography variant="body2" color="text.secondary">
          © 2025 Conference 2026 | PICT, Pune
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contact: info@conference2026.com
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
