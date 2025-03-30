import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/axios';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses
} from '@mui/material';
import {
  Event as EventIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Logout as LogoutIcon,
  Domain as DomainIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { styled, Theme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

interface Paper {
  _id: string;
  title: string;
  domain: string;
  paperId: string;
  presenters: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  synopsis: string;
  selectedSlot?: {
    date: string;
    room: string;
    timeSlot: string;
    bookedBy?: string;
  };
  presentationStatus: 'Scheduled' | 'In Progress' | 'Presented' | 'Cancelled';
}

interface ApiResponse {
  success: boolean;
  data: {
    [domain: string]: Paper[];
  };
  message?: string;
}

interface DomainGroup {
  [domain: string]: {
    [room: string]: Paper[];
  };
}

const ALLOWED_DATES = [
  '2026-01-09',
  '2026-01-10',
  '2026-01-11'
];

// Styled components for the table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

type StatusColorType = 'success' | 'warning' | 'error' | 'info';

const getStatusColorKey = (status: Paper['presentationStatus']): StatusColorType => {
  switch (status) {
    case 'Presented':
      return 'success';
    case 'In Progress':
      return 'warning';
    case 'Cancelled':
      return 'error';
    default:
      return 'info';
  }
};

const getStatusColor = (status: Paper['presentationStatus'], theme: Theme) => {
  const colorKey = getStatusColorKey(status);
  return theme.palette[colorKey].main;
};

const getStatusBgColor = (status: Paper['presentationStatus'], theme: Theme) => {
  const colorKey = getStatusColorKey(status);
  return alpha(theme.palette[colorKey].main, 0.05);
};

const getStatusBgHoverColor = (status: Paper['presentationStatus'], theme: Theme) => {
  const colorKey = getStatusColorKey(status);
  return alpha(theme.palette[colorKey].main, 0.08);
};

const getStatusIcon = (status: Paper['presentationStatus']) => {
  switch (status) {
    case 'Presented':
      return <CheckCircleIcon color="success" />;
    case 'In Progress':
      return <PlayArrowIcon color="warning" />;
    case 'Cancelled':
      return <CancelIcon color="error" />;
    default:
      return <ScheduleIcon color="info" />;
  }
};

const AdminHome: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(ALLOWED_DATES[0]));
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [expandedDomain, setExpandedDomain] = useState<string | false>(false);
  const [expandedRooms, setExpandedRooms] = useState<{ [key: string]: boolean }>({});
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      fetchPapersByDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchPapersByDate = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await axios.get<ApiResponse>('/papers/by-date', {
        params: { date: formattedDate }
      });
      
      if (response.data.success) {
        const papersByDomain = response.data.data;
        const allPapers: Paper[] = [];
        Object.values(papersByDomain).forEach(papers => {
          allPapers.push(...papers);
        });
        setPapers(allPapers);
      } else {
        setError('Failed to fetch papers');
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load papers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleLogout = () => {
    logout();
  };

  const isDateDisabled = (date: Date) => {
    return !ALLOWED_DATES.includes(format(date, 'yyyy-MM-dd'));
  };

  const filteredPapers = papers.filter(paper => {
    return selectedDomain === 'All' || paper.domain === selectedDomain;
  });

  const groupedByDomain = filteredPapers.reduce((acc, paper) => {
    if (!paper.selectedSlot) return acc;
    
    const { domain } = paper;
    const room = paper.selectedSlot.room;
    
    if (!acc[domain]) {
      acc[domain] = {};
    }
    if (!acc[domain][room]) {
      acc[domain][room] = [];
    }
    
    acc[domain][room].push(paper);
    return acc;
  }, {} as DomainGroup);

  const handleDomainChange = (domain: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedDomain(isExpanded ? domain : false);
  };

  const handleRoomChange = (domainRoom: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedRooms(prev => ({
      ...prev,
      [domainRoom]: isExpanded
    }));
  };

  const handleViewDetails = (paper: Paper) => {
    setSelectedPaper(paper);
    setDetailsDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedPaper(null);
  };

  const handleStatusChange = async (paperId: string, newStatus: Paper['presentationStatus']) => {
    try {
      setUpdatingStatus(paperId);
      const response = await axios.patch(`/papers/${paperId}/presentation-status`, {
        presentationStatus: newStatus
      });
      
      if (response.data.success) {
        setPapers(papers.map(paper => 
          paper._id === paperId 
            ? { ...paper, presentationStatus: newStatus }
            : paper
        ));
      } else {
        setError(response.data.message || 'Failed to update presentation status');
      }
    } catch (error: any) {
      console.error('Error updating presentation status:', error);
      setError(error.response?.data?.message || 'Failed to update presentation status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const adminFeatures = [
    {
      title: 'Add Paper',
      description: 'Manually add a paper to the database',
      icon: <AssignmentIcon />, // use any icon you like
      path: '/admin/add-paper',
    },
    {
      title: 'Add Special Session',
      description: 'Schedule a guest, keynote, or cultural session',
      icon: <EventIcon />,
      path: '/admin/add-session',
    },
    {
      title: 'Analytics Dashboard',
      description: 'View conference statistics and metrics',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
    },
    {
      title: 'Schedule Manager',
      description: 'Manage presentation schedules and time slots',
      icon: <ScheduleIcon />,
      path: '/admin/schedule',
    },
    {
      title: 'Communication Center',
      description: 'Send notifications and manage communications',
      icon: <NotificationsIcon />,
      path: '/admin/communications',
    },
    {
      title: 'Presenter Management',
      description: 'Manage presenters and track attendance',
      icon: <PeopleIcon />,
      path: '/admin/presenters',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Conference Schedule Management
        </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
              {user?.email}
        </Typography>
            <IconButton color="inherit" onClick={handleLogout} size="small">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {adminFeatures.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Paper
                  component={Link}
                  to={feature.path}
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  shouldDisableDate={isDateDisabled}
                  sx={{ width: '100%' }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'action.active' }} />
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select
                  value={selectedDomain}
                  label="Domain"
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  startAdornment={<DomainIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="All">All Domains</MenuItem>
                  {Object.keys(groupedByDomain).map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 2 }}>
          {Object.entries(groupedByDomain).map(([domain, rooms]) => (
            <Accordion
              key={domain}
              expanded={expandedDomain === domain}
              onChange={handleDomainChange(domain)}
              sx={{
                mb: 1,
                '&:before': { display: 'none' },
                bgcolor: 'background.paper',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DomainIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {domain}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                {Object.entries(rooms).map(([room, roomPapers]) => (
                  <Box key={`${domain}-${room}`} sx={{ mb: 2 }}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: alpha(theme.palette.background.paper, 0.5),
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <RoomIcon color="primary" />
                        <Typography variant="h6">
                          {room}
          </Typography>
                        <Chip 
                          label={`${roomPapers.length} Presentations`} 
                          size="small" 
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      <TableContainer>
                        <Table size="medium" aria-label="presentation schedule">
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Time Slot</StyledTableCell>
                              <StyledTableCell>Paper ID</StyledTableCell>
                              <StyledTableCell>Title</StyledTableCell>
                              <StyledTableCell>Presenters</StyledTableCell>
                              <StyledTableCell>Status</StyledTableCell>
                              <StyledTableCell align="right">Actions</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {roomPapers
                              .sort((a, b) => (a.selectedSlot?.timeSlot || '').localeCompare(b.selectedSlot?.timeSlot || ''))
                              .map((paper) => (
                                <StyledTableRow key={paper._id}>
                                  <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <ScheduleIcon fontSize="small" color="action" />
                                      {paper.selectedSlot?.timeSlot}
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>{paper.paperId}</StyledTableCell>
                                  <StyledTableCell>{paper.title}</StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                      {paper.presenters.map((presenter, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <PersonIcon fontSize="small" color="action" />
                                          {presenter.name}
                                        </Box>
                                      ))}
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={paper.presentationStatus === 'Presented'}
                                            onChange={(e) => handleStatusChange(
                                              paper._id,
                                              e.target.checked ? 'Presented' : 'Scheduled'
                                            )}
                                            disabled={updatingStatus === paper._id}
                                            color="success"
                                            size="small"
                                          />
                                        }
                                        label=""
                                      />
                                      {updatingStatus === paper._id ? (
                                        <CircularProgress size={20} />
                                      ) : (
                                        <Chip
                                          label={paper.presentationStatus}
                                          size="small"
                                          sx={{
                                            color: getStatusColor(paper.presentationStatus, theme),
                                            bgcolor: getStatusBgColor(paper.presentationStatus, theme),
                                            '&:hover': {
                                              bgcolor: getStatusBgHoverColor(paper.presentationStatus, theme)
                                            }
                                          }}
                                        />
                                      )}
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(paper);
                                      }}
                                      startIcon={<EventIcon />}
                                    >
                                      View Details
                                    </Button>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        <Dialog
          open={detailsDialogOpen}
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
        >
          {selectedPaper && (
            <>
              <DialogTitle>
                Paper Details
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" gutterBottom>
                        {selectedPaper.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Paper ID: {selectedPaper.paperId}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Domain
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedPaper.domain}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Schedule
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Room: {selectedPaper.selectedSlot?.room}
                          <br />
                          Time: {selectedPaper.selectedSlot?.timeSlot}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Presenters
                        </Typography>
                        {selectedPaper.presenters.map((presenter, index) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {presenter.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {presenter.email}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Synopsis
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedPaper.synopsis}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>
                  Close
        </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
      </Box>
  );
};

export default AdminHome; 