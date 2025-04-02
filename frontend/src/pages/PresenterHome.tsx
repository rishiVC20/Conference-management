import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../config/axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  useTheme,
  AppBar,
  Toolbar,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import {
  Search as SearchIcon,
  Event as EventIcon,
  Room as RoomIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  Domain as DomainIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { toast } from 'react-toastify';
import PaperDetails from "../components/PaperDetails";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { Paper as PaperType, Presenter } from "../types/paper";
import NotificationBell from "../components/NotificationBell";
import SlotSelectionGrid from '../components/SlotSelectionGrid';



interface AvailableSlot {
  room: string;
  timeSlots: string[];
}

const ALLOWED_DATES = ["2026-01-09", "2026-01-10", "2026-01-11"];

type SearchCriteria = "default" | "paperId" | "title" | "presenter";

// Add styled components for the table
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
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface SpecialSession {
  _id: string;
  title: string;
  speaker: string;
  room: string;
  sessionType: 'Guest Lecture' | 'Keynote Speech' | 'Cultural Event' | 'Workshop';
  date: string;
  startTime: string;
  endTime: string;
  session: 'Session 1' | 'Session 2';
  description?: string;
}

interface Event {
  isSpecialSession: boolean;
  eventType: 'presentation' | 'special';
  _id: string;
  title: string;
  room: string;
  session: string;
  startTime?: string;
  endTime?: string;
  speaker?: string;
  sessionType?: string;
  description?: string;
  selectedSlot?: {
    date: string;
    room: string;
    session: string;
    bookedBy?: string;
  };
  presenters?: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  presentationStatus?: 'Scheduled' | 'In Progress' | 'Presented' | 'Cancelled';
  domain?: string;
  paperId?: string;
  synopsis?: string;
}

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
    session: string;
    bookedBy?: string;
  };
  presentationStatus: "Scheduled" | "In Progress" | "Presented" | "Cancelled";
}

const PresenterHome = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedPaper, setSelectedPaper] = useState<Paper | Event | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [slotSelectionOpen, setSlotSelectionOpen] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [scheduledPapers, setScheduledPapers] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
const [allSlotData, setAllSlotData] = useState<{ [date: string]: any[] }>({});
  const [selectedSession, setSelectedSession] = useState("");
  const [searchCriteria, setSearchCriteria] =
    useState<SearchCriteria>("default");
  const [expandedDomain, setExpandedDomain] = useState<string | false>(false);
  const [expandedRooms, setExpandedRooms] = useState<{
    [key: string]: boolean;
  }>({});
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleViewDate, setScheduleViewDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchPresenterPapers();
  }, [user?.email]);

  useEffect(() => {
    // Check if any paper has a booked slot
    const hasBookedSlot = papers.some((paper) => paper.selectedSlot?.bookedBy);
    console.log("Has booked slot:", hasBookedSlot);
    console.log("Booked paper:", papers.find((p) => p.selectedSlot?.bookedBy));

    setShowSchedule(hasBookedSlot);

    if (hasBookedSlot) {
      // Set initial schedule view date to the first booked paper's date
      const bookedPaper = papers.find((p) => p.selectedSlot?.bookedBy);
      if (bookedPaper?.selectedSlot?.date) {
        const date = new Date(bookedPaper.selectedSlot.date);
        setScheduleViewDate(date);
        fetchScheduledPapers(date);
      }
    }
  }, [papers]);

  const fetchPresenterPapers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/papers/presenter", {
        params: { email: user?.email },
      });
      if (response.data.success) {
        setPapers(response.data.data);
      } else {
        setError("Failed to fetch papers");
      }
    } catch (err) {
      console.error("Error fetching papers:", err);
      setError("Failed to load your papers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledPapers = async (date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get("/papers/by-date", {
        params: { date: formattedDate },
      });

      if (response.data.success) {
        console.log("Scheduled papers response:", response.data);
        const allEvents: Event[] = response.data.data;
        setScheduledPapers(allEvents);
      }
    } catch (error) {
      console.error("Error fetching scheduled papers:", error);
    }
  };

  const handleSlotSelect = async ({ date, room, session }: { date: string; room: string; session: string }) => {
    if (!selectedPaper || !user?.email) return;
  
    try {
      const res = await axios.post("/papers/select-slot", {
        paperId: selectedPaper._id,
        date,
        room,
        session,
        presenterEmail: user.email,
      });
  
      if (res.data.success) {
        toast.success("Slot selected successfully!");
        setPapers(prev =>
          prev.map(p => (p._id === selectedPaper._id ? res.data.data : p))
        );
        handleCloseDialog();
      }
    } catch (err) {
      toast.error("Failed to select slot");
    }
  };
  
  const handleViewDetails = (paper: Paper | Event) => {
    setSelectedPaper(paper);
    setDetailsOpen(true);
  };

  const fetchSlotsForAllDates = async (domain: string) => {
    const slotResults: { [date: string]: any[] } = {};
    for (const date of ALLOWED_DATES) {
      const res = await axios.get("/papers/available-slots", {
        params: {
          domain,
          date: date + "T00:00:00.000Z",
        },
      });
      if (res.data.success) {
        slotResults[date] = res.data.data.availableSlots;
      }
    }
    setAllSlotData(slotResults);
  };
  

  const handleOpenDialog = (paper: Paper | Event) => {
    if ('selectedSlot' in paper && paper.selectedSlot && paper.selectedSlot.bookedBy) {
      const presenters = 'presenters' in paper && paper.presenters ? paper.presenters : [];
      const bookedByPresenter = presenters.find(
        (p) => p.email === paper.selectedSlot?.bookedBy
      );
      if (paper.selectedSlot.bookedBy !== user?.email) {
        setError(
          `This slot has already been booked by ${
            bookedByPresenter?.name || "another presenter"
          }`
        );
        return;
      }
    }
  
    setSelectedPaper(paper);
    setSlotSelectionOpen(true);
    setError("");
    setSuccessMessage("");
  
    if (!('isSpecialSession' in paper)) {
      fetchSlotsForAllDates(paper.domain);
    }
  };
  

  const handleCloseDialog = () => {
    setSlotSelectionOpen(false);
    setSelectedPaper(null);
    setError("");
    setSuccessMessage("");
  };

 
  const fetchAvailableSlots = async (domain: string, date: Date) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get("/papers/available-slots", {
        params: { domain, date: formattedDate },
      });
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to fetch available slots"
      );
    }
  };

  

  

  const handleAccordionRoomChange =
    (domainRoom: string) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedRooms((prev) => ({
        ...prev,
        [domainRoom]: isExpanded,
      }));
    };

  const isDateDisabled = (date: Date) => {
    return !ALLOWED_DATES.includes(format(date, "yyyy-MM-dd"));
  };

  

  const handleLogout = () => {
    logout();
  };

  const handleDomainChange =
    (domain: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedDomain(isExpanded ? domain : false);
    };

  const filteredScheduledPapers = scheduledPapers.filter((paper) => {
    if (!showSchedule) return false;

    const searchTermLower = searchTerm.toLowerCase().trim();

    let matchesSearch = true;
    if (searchTermLower !== "") {
      switch (searchCriteria) {
        case "paperId":
          matchesSearch = paper.paperId?.toLowerCase().includes(searchTermLower) || false;
          break;
        case "title":
          matchesSearch = paper.title.toLowerCase().includes(searchTermLower);
          break;
        case "presenter":
          matchesSearch = paper.presenters?.some(
            (p) =>
              p.name.toLowerCase().includes(searchTermLower) ||
              p.email.toLowerCase().includes(searchTermLower)
          ) || false;
          break;
        default:
          matchesSearch =
            (paper.paperId?.toLowerCase().includes(searchTermLower) || false) ||
            paper.title.toLowerCase().includes(searchTermLower) ||
            (paper.presenters?.some(
              (p) =>
                p.name.toLowerCase().includes(searchTermLower) ||
                p.email.toLowerCase().includes(searchTermLower)
            ) || false);
      }
    }

    return matchesSearch;
  });

  const groupedByDomain = filteredScheduledPapers.reduce((acc, paper) => {
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
  }, {} as { [domain: string]: { [room: string]: Event[] } });

  const handleScheduleDateChange = (date: Date | null) => {
    setScheduleViewDate(date);
    if (date) {
      fetchScheduledPapers(date);
    }
  };

  // Add status color functions
  const getStatusColor = (
    status: Paper["presentationStatus"],
    theme: Theme
  ) => {
    switch (status) {
      case "Presented":
        return theme.palette.success.main;
      case "In Progress":
        return theme.palette.warning.main;
      case "Cancelled":
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getStatusBgColor = (
    status: Paper["presentationStatus"],
    theme: Theme
  ) => {
    switch (status) {
      case "Presented":
        return alpha(theme.palette.success.main, 0.05);
      case "In Progress":
        return alpha(theme.palette.warning.main, 0.05);
      case "Cancelled":
        return alpha(theme.palette.error.main, 0.05);
      default:
        return alpha(theme.palette.info.main, 0.05);
    }
  };

  const getStatusBgHoverColor = (
    status: Paper["presentationStatus"],
    theme: Theme
  ) => {
    switch (status) {
      case "Presented":
        return alpha(theme.palette.success.main, 0.08);
      case "In Progress":
        return alpha(theme.palette.warning.main, 0.08);
      case "Cancelled":
        return alpha(theme.palette.error.main, 0.08);
      default:
        return alpha(theme.palette.info.main, 0.08);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading your papers...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Presenter Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <NotificationBell />
            <Typography variant="body2">{user?.email}</Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {papers.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Papers Found
            </Typography>
            <Typography color="textSecondary">
              You haven't submitted any papers yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {papers.map((paper) => (
              <Grid item xs={12} key={paper._id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: 1,
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {paper.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mb: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                size="small"
                                icon={<DomainIcon />}
                                label={paper.domain}
                                color="primary"
                              />
                              <Chip
                                size="small"
                                icon={<AssignmentIcon />}
                                label={`Paper ID: ${paper.paperId}`}
                                color="secondary"
                              />
                              {paper.selectedSlot &&
                              paper.selectedSlot.bookedBy ? (
                                <Chip
                                  size="small"
                                  icon={<CheckCircleIcon />}
                                  label={
                                    paper.selectedSlot.bookedBy === user?.email
                                      ? "Booked by you"
                                      : "Slot Booked"
                                  }
                                  color={
                                    paper.selectedSlot.bookedBy === user?.email
                                      ? "success"
                                      : "default"
                                  }
                                />
                              ) : (
                                <Chip
                                  size="small"
                                  icon={<WarningIcon />}
                                  label="No Slot Selected"
                                  color="warning"
                                />
                              )}
                            </Box>
                            {paper.selectedSlot &&
                              paper.selectedSlot.bookedBy && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Chip
                                    size="small"
                                    icon={<EventIcon />}
                                    label={format(
                                      new Date(paper.selectedSlot.date),
                                      "dd MMM yyyy"
                                    )}
                                    variant="outlined"
                                  />
                                  <Chip
                                    size="small"
                                    icon={<RoomIcon />}
                                    label={`Room ${paper.selectedSlot.room}`}
                                    variant="outlined"
                                  />
                                  <Chip
                                    size="small"
                                    icon={<ScheduleIcon />}
                                    label={paper.selectedSlot.session === 'Session 1' ? 
                                      'Session 1 (9:00 AM - 12:00 PM)' : 
                                      'Session 2 (1:00 PM - 4:00 PM)'}
                                    variant="outlined"
                                  />
                                  {paper.selectedSlot.bookedBy !==
                                    user?.email && (
                                    <Chip
                                      size="small"
                                      icon={<PersonIcon />}
                                      label={`Booked by: ${
                                        paper.presenters.find(
                                          (p) =>
                                            p.email ===
                                            paper.selectedSlot?.bookedBy
                                        )?.name
                                      }`}
                                      variant="outlined"
                                    />
                                  )}
                                </Box>
                              )}
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleViewDetails(paper);
                              }}
                              startIcon={<PersonIcon />}
                              tabIndex={0}
                            >
                              View Details
                            </Button>
                            {(!paper.selectedSlot?.bookedBy ||
                              paper.selectedSlot?.bookedBy === user?.email) && (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleOpenDialog(paper)}
                                startIcon={<ScheduleIcon />}
                              >
                                {paper.selectedSlot?.bookedBy
                                  ? "Change Slot"
                                  : "Select Slot"}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {showSchedule && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Scheduled Presentations
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="View Schedule For"
                    value={scheduleViewDate}
                    onChange={handleScheduleDateChange}
                    shouldDisableDate={isDateDisabled}
                    defaultCalendarMonth={new Date(ALLOWED_DATES[0])}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Search By</InputLabel>
                    <Select
                      value={searchCriteria}
                      label="Search By"
                      onChange={(e) =>
                        setSearchCriteria(e.target.value as SearchCriteria)
                      }
                    >
                      <MenuItem value="default">All Fields</MenuItem>
                      <MenuItem value="paperId">Paper ID</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                      <MenuItem value="presenter">Presenter</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    size="small"
                    label={`Search by ${
                      searchCriteria === "default"
                        ? "all fields"
                        : searchCriteria
                    }`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            {Object.entries(groupedByDomain).map(([domain, rooms]) => (
              <Accordion
                key={domain}
                expanded={expandedDomain === domain}
                onChange={handleDomainChange(domain)}
                sx={{
                  mb: 2,
                  "&:before": { display: "none" },
                  borderRadius: "8px !important",
                  overflow: "hidden",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: "white",
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      color: "white",
                    },
                  }}
                  tabIndex={0}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DomainIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">{domain}</Typography>
                    <Chip
                      size="small"
                      label={`${Object.keys(rooms).length} Rooms`}
                      sx={{
                        ml: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  {Object.entries(rooms).map(([room, roomEvents]) => (
                    <Accordion
                      key={`${domain}-${room}`}
                      expanded={expandedRooms[`${domain}-${room}`] || false}
                      onChange={handleAccordionRoomChange(`${domain}-${room}`)}
                      sx={{
                        mb: 2,
                        "&:before": { display: "none" },
                        borderRadius: 1,
                        overflow: "hidden",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          },
                        }}
                        tabIndex={0}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <RoomIcon color="primary" />
                          <Typography variant="h6">{room}</Typography>
                          <Chip
                            label={`${roomEvents.length} Events`}
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 2 }}>
                        <TableContainer>
                          <Table size="medium" aria-label="schedule">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>Time</StyledTableCell>
                                <StyledTableCell>Title</StyledTableCell>
                                <StyledTableCell>Paper-ID</StyledTableCell>
                                <StyledTableCell>Type</StyledTableCell>
                                <StyledTableCell>Presenters/Speaker</StyledTableCell>
                                <StyledTableCell>Status</StyledTableCell>
                                <StyledTableCell align="right">Actions</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {roomEvents
                                .sort((a, b) => {
                                  const timeA = a.isSpecialSession ? a.startTime : a.selectedSlot?.session;
                                  const timeB = b.isSpecialSession ? b.startTime : b.selectedSlot?.session;
                                  return (timeA || '').localeCompare(timeB || '');
                                })
                                .map((event) => (
                                  <StyledTableRow 
                                    key={event._id}
                                    sx={{
                                      backgroundColor: event.isSpecialSession 
                                        ? alpha(theme.palette.secondary.main, 0.05)
                                        : 'inherit',
                                      '&:hover': {
                                        backgroundColor: event.isSpecialSession
                                          ? alpha(theme.palette.secondary.main, 0.08)
                                          : alpha(theme.palette.primary.main, 0.04),
                                      },
                                    }}
                                  >
                                    <StyledTableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ScheduleIcon fontSize="small" color="action" />
                                        {event.isSpecialSession ? (
                                          <>
                                            {event.startTime} - {event.endTime}
                                            <Chip
                                              size="small"
                                              label={event.sessionType}
                                              color="secondary"
                                              sx={{ ml: 1 }}
                                            />
                                          </>
                                        ) : (
                                          event.selectedSlot?.session === 'Session 1' 
                                            ? 'Session 1 (9:00 AM - 12:00 PM)'
                                            : 'Session 2 (1:00 PM - 4:00 PM)'
                                        )}
                                      </Box>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      <Typography variant="body2">
                                        {event.title}
                                      </Typography>
                                      {event.isSpecialSession && event.description && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          {event.description}
                                        </Typography>
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell>
    {event.paperId || 'N/A'}
  </StyledTableCell>
                                    <StyledTableCell>
                                      <Chip
                                        size="small"
                                        label={event.isSpecialSession ? 'Special Session' : 'Presentation'}
                                        color={event.isSpecialSession ? 'secondary' : 'primary'}
                                      />
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {event.isSpecialSession ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                          <PersonIcon fontSize="small" color="action" />
                                          {event.speaker}
                                        </Box>
                                      ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                          {event.presenters?.map((presenter, index) => (
                                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                              <PersonIcon fontSize="small" color="action" />
                                              {presenter.name}
                                            </Box>
                                          ))}
                                        </Box>
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                      {!event.isSpecialSession && (
                                        <Chip
                                          label={event.presentationStatus}
                                          size="small"
                                          sx={{
                                            color: getStatusColor(event.presentationStatus || 'Scheduled', theme),
                                            bgcolor: getStatusBgColor(event.presentationStatus || 'Scheduled', theme),
                                            '&:hover': {
                                              bgcolor: getStatusBgHoverColor(event.presentationStatus || 'Scheduled', theme),
                                            },
                                          }}
                                        />
                                      )}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleViewDetails(event);
                                        }}
                                        startIcon={<EventIcon />}
                                        tabIndex={0}
                                      >
                                        View Details
                                      </Button>
                                    </StyledTableCell>
                                  </StyledTableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        <PaperDetails
          paper={selectedPaper}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />

        <Dialog
          open={slotSelectionOpen}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          keepMounted={false}
          disablePortal={false}
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle>
            <Typography variant="h6">Select Presentation Slot</Typography>
          </DialogTitle>
          <DialogContent>
            {slotError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {slotError}
              </Alert>
            )}
            <Box sx={{ mt: 2 }}>
            <SlotSelectionGrid
  allSlotData={allSlotData}
  onSlotSelect={handleSlotSelect} // sends slot to backend
  onCancel={handleCloseDialog} // closes modal
/>

            </Box>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PresenterHome;
