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
  Add as AddIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import { styled, Theme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

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
  isSpecialSession?: boolean;
  speaker?: string;
  sessionType?: 'Guest' | 'Keynote' | 'Cultural';
  startTime?: string;
  endTime?: string;
  date?: string;
  room?: string;
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
  const navigate = useNavigate();

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
      
      // Fetch both papers and special sessions
      const [papersResponse, specialSessionsResponse] = await Promise.all([
        axios.get<ApiResponse>('/papers/by-date', {
          params: { date: formattedDate }
        }),
        axios.get<ApiResponse>('/special-sessions/by-date', {
          params: { date: formattedDate }
        })
      ]);
      
      if (!papersResponse.data.success || !specialSessionsResponse.data.success) {
        const errorMessage = papersResponse.data.message || specialSessionsResponse.data.message || 'Failed to fetch data';
        setError(errorMessage);
        return;
      }

      const papersByDomain = papersResponse.data.data;
      const specialSessions = specialSessionsResponse.data.data;
      
      // Convert special sessions to Paper format
      const formattedSpecialSessions = Array.isArray(specialSessions) 
        ? specialSessions.map(session => ({
            ...session,
            isSpecialSession: true,
            paperId: `SS-${session._id}`,
            domain: 'Special Sessions',
            selectedSlot: {
              date: session.date || '',
              room: session.room || '',
              timeSlot: `${session.startTime} - ${session.endTime}`
            }
          }))
        : [];
      
      // Combine papers and special sessions
      const allPapers: Paper[] = [];
      if (Array.isArray(papersByDomain)) {
        allPapers.push(...papersByDomain);
      } else if (typeof papersByDomain === 'object' && papersByDomain !== null) {
        Object.values(papersByDomain).forEach(papers => {
          if (Array.isArray(papers)) {
            allPapers.push(...papers);
          }
        });
      }
      allPapers.push(...formattedSpecialSessions);
      
      setPapers(allPapers);
    } catch (err: any) {
      console.error('Error fetching papers and special sessions:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load papers and special sessions. Please try again later.';
      setError(errorMessage);
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
    
    // Handle domain properly, using 'Special Sessions' for special sessions and 'Other' for undefined
    const domain = paper.isSpecialSession 
        ? 'Special Sessions'
        : paper.domain || 'Other';
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
      
      // Check if it's a special session (paperId starts with 'SS-')
      if (paperId.startsWith('SS-')) {
        const actualId = paperId.substring(3); // Remove 'SS-' prefix
        const response = await axios.patch(`/special-sessions/${actualId}/status`, {
          status: newStatus
        });
        
        if (response.data.success) {
          setPapers(papers.map(paper => 
            paper._id === actualId && paper.isSpecialSession
              ? { ...paper, presentationStatus: newStatus }
              : paper
          ));
        } else {
          setError(response.data.message || 'Failed to update session status');
        }
      } else {
        // Regular paper status update
        const response = await axios.patch(`/papers/${paperId}/presentation-status`, {
          presentationStatus: newStatus
        });
        
        if (response.data.success) {
          setPapers(papers.map(paper => 
            paper._id === paperId && !paper.isSpecialSession
              ? { ...paper, presentationStatus: newStatus }
              : paper
          ));
        } else {
          setError(response.data.message || 'Failed to update presentation status');
        }
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      setError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const adminFeatures = [
    {
      title: 'Add Paper',
      description: 'Manually add a paper to the database',
      icon: <AssignmentIcon />,
      path: '/admin/add-paper',
    },
    {
      title: 'Add Special Session',
      description: 'Schedule a guest, keynote, or cultural session',
      icon: <EventIcon />,
      path: '/admin/add-special-session',
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
            <NotificationBell />
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

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/add-special-session')}
            startIcon={<AddIcon />}
          >
            Add Special Session
          </Button>
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
                              <StyledTableCell>ID</StyledTableCell>
                              <StyledTableCell>Title</StyledTableCell>
                              <StyledTableCell>Presenters/Speaker</StyledTableCell>
                              <StyledTableCell>Status</StyledTableCell>
                              <StyledTableCell align="right">Actions</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {roomPapers
                              .sort((a, b) => (a.selectedSlot?.timeSlot || '').localeCompare(b.selectedSlot?.timeSlot || ''))
                              .map((paper) => (
                                <StyledTableRow key={paper.isSpecialSession ? `SS-${paper._id}` : paper._id}>
                                  <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <ScheduleIcon fontSize="small" color="action" />
                                      {paper.selectedSlot?.timeSlot}
                                    </Box>
                                  </StyledTableCell>
                                  <StyledTableCell>{paper.paperId}</StyledTableCell>
                                  <StyledTableCell>{paper.title}</StyledTableCell>
                                  <StyledTableCell>
                                    {paper.isSpecialSession ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <PersonIcon fontSize="small" color="action" />
                                        {paper.speaker}
                                      </Box>
                                    ) : (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {paper.presenters.map((presenter, index) => (
                                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <PersonIcon fontSize="small" color="action" />
                                            {presenter.name}
                                          </Box>
                                        ))}
                                      </Box>
                                    )}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={paper.presentationStatus === 'Presented'}
                                            onChange={(e) => handleStatusChange(
                                              paper.isSpecialSession ? `SS-${paper._id}` : paper._id,
                                              e.target.checked ? 'Presented' : 'Scheduled'
                                            )}
                                            disabled={updatingStatus === (paper.isSpecialSession ? `SS-${paper._id}` : paper._id)}
                                            color="success"
                                            size="small"
                                          />
                                        }
                                        label=""
                                      />
                                      {updatingStatus === (paper.isSpecialSession ? `SS-${paper._id}` : paper._id) ? (
                                        <CircularProgress size={20} />
                                      ) : (
                                        <Chip
                                          label={paper.presentationStatus || 'Scheduled'}
                                          size="small"
                                          sx={{
                                            color: getStatusColor(paper.presentationStatus || 'Scheduled', theme),
                                            bgcolor: getStatusBgColor(paper.presentationStatus || 'Scheduled', theme),
                                            '&:hover': {
                                              bgcolor: getStatusBgHoverColor(paper.presentationStatus || 'Scheduled', theme)
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
                {selectedPaper.isSpecialSession ? 'Special Session Details' : 'Paper Details'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="h6" gutterBottom>
                        {selectedPaper.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ID: {selectedPaper.paperId}
                      </Typography>
                      {selectedPaper.isSpecialSession ? (
                        <>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Session Type
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedPaper.sessionType}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Speaker
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedPaper.speaker}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Schedule
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Room: {selectedPaper.selectedSlot?.room}
                              <br />
                              Time: {selectedPaper.startTime} - {selectedPaper.endTime}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
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
                              Time: {selectedPaper.isSpecialSession 
                                ? `${selectedPaper.startTime} - ${selectedPaper.endTime}`
                                : selectedPaper.selectedSlot?.timeSlot === 'Session 1'
                                  ? 'Session 1 (9:00 AM - 12:00 PM)'
                                  : selectedPaper.selectedSlot?.timeSlot === 'Session 2'
                                    ? 'Session 2 (1:00 PM - 4:00 PM)'
                                    : selectedPaper.selectedSlot?.timeSlot}
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
                        </>
                      )}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {selectedPaper.isSpecialSession ? 'Description' : 'Synopsis'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedPaper.isSpecialSession ? selectedPaper.synopsis : selectedPaper.synopsis}
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