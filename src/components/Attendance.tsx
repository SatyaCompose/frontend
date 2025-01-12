import React, { useCallback, useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Menu,
    MenuItem,
    IconButton,
    Paper,
    Button,
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import '../styles/Attendance.css'
import '../styles/UserDashboard.css';
import { clockIn, clockOut, getAttendances } from '../services/attendance';
import { getLast10Days } from '../common/contstant';
import NotificationIcon from './NotificationIcon';
import { ProfileAvatar } from './ProfileAvatar';
import { fetchUser } from '../services/user';
import { User } from '../types/user';

const AttendancePage = () => {
    const clockInStatus = localStorage.getItem('clockin-status') ?? false;
    const [isClockedIn, setIsClockedIn] = useState(Boolean(clockInStatus));
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState<{ date: string; status: string; }[]>([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState<User>({});

    const { firstName = '', lastName = '' } = user ?? {}

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleClockToggle = async () => {
        try {
            if (isClockedIn) {
                // Clock-Out logic
                await clockOut();
                localStorage.setItem('clockin-status', `${false}`)
                setIsClockedIn(false);
            } else {
                // Clock-In logic
                await clockIn();
                localStorage.setItem('clockin-status', `${true}`)
                setIsClockedIn(true);
            }
        } catch (error) {
            console.error("Error toggling clock-in/out:", error);
        }
    };

    const handleMenuClick = (event: any) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const processAttendanceData = useCallback((data: any[], isClockedIn: boolean) => {
        const fetchStatus = (date: string) => {
            const statusData = data.find((entry: any) => entry?.date === date);

            if (!statusData) return "No data available";

            const totalHours = statusData.sessions?.reduce(
                (sum: any, session: any) => sum + session.totalHours,
                0
            );

            if (isClockedIn && date === getCurrentDate()) {
                return "Clocked in for today; keep it up! 🕒";
            }

            if (totalHours >= 8) {
                return "Fully attended with great consistency! 🎉";
            } else if (totalHours >= 4) {
                return "Partially attended; keep striving for full attendance! 🌟";
            } else if (totalHours > 0) {
                return "Minimal attendance; try to increase engagement! ⚡";
            } else {
                return "No attendance logged for this day. 🚫";
            }
        };

        const last10Days = getLast10Days();
        return last10Days.map((day) => ({
            date: day.isoDate,
            status: fetchStatus(day.isoDate),
        }));
    }, []);

    useEffect(() => {
        const fetchAttendance = async () => {
            const data = await getAttendances();
            const attendanceList = processAttendanceData(data?.data || [], isClockedIn);
            setAttendanceData(attendanceList);
        };
        const fetchData = async () => {
            try {
                const data = await fetchUser();
                if (data && data.status === 200) {
                    const userData = data?.data?.[0] || {};
                    setUser(userData);
                }
            } catch (error) {
                console.error("Error in fetchData:", error);
            }
        };

        fetchData(); 
        fetchAttendance();
    }, [isClockedIn, processAttendanceData]);

    // Helper function to get the current date in ISO format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };


    return (
        <div className="dashboard">
            <div className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="Company Logo" className="Logo zoomed" />
                </div>
                <div className="right-section">
                    <div className="notification-container">
                        <NotificationIcon count={3} />
                    </div>
                    <div className="profile-container" style={{ marginLeft: 50, marginRight: 30 }}>
                        <ProfileAvatar name={firstName + lastName} height={80} size='2.5rem' />
                    </div>
                </div>
            </div>
            <div className="content-area">
                <div className="sidebar">
                    <ul className="menu-list">
                        <li>
                            <Link to="/user/dashboard" className='link'>
                                <DashboardIcon style={{ marginRight: 8 }} /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/dashboard" className='link'>
                                <PersonIcon style={{ marginRight: 8 }} /> Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/notification-form" className='link'>
                                <NotificationsIcon style={{ marginRight: 8 }} /> Notification Form
                            </Link>
                        </li>
                        <li>
                            <Link to="/user/attendance" className='link'>
                                <EventAvailableIcon style={{ marginRight: 8 }} /> Attendance
                            </Link>
                        </li>
                        <li>
                            <Link to="/sign-out" className='link'>
                                <LogoutIcon style={{ marginRight: 8 }} /> Logout
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="main-content">
                    <h1>Attendance Status</h1>
                    
                    <Box>
                        {/* Clock-in/Clock-out Section */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                            <Box>
                                <strong>Current Time:</strong> {currentTime.toLocaleTimeString()}
                            </Box>
                            <Button
                                variant="contained"
                                onClick={handleClockToggle}
                                sx={{
                                    backgroundColor: isClockedIn ? "#f44336" : "#4CAF50",
                                    color: "#fff",
                                    fontWeight: 700,
                                    "&:hover": {
                                        backgroundColor: isClockedIn ? "#d32f2f" : "#388e3c",
                                    },
                                }}
                            >
                                {isClockedIn ? "Clock-Out" : "Clock-In"}
                            </Button>
                        </Box>
                        </Box>
                    <Box sx={{ display: "flex" }}>
                        <Box sx={{ flexGrow: 1, padding: 2 }}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ alignItems: 'center', backgroundColor: '#dff0d8'}}>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {attendanceData.map((row) => (
                                            <TableRow key={row.date}>
                                                <TableCell>{row.date}</TableCell>
                                                <TableCell>{row.status}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={handleMenuClick}>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                    <Menu
                                                        anchorEl={anchorEl}
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        <MenuItem onClick={handleMenuClose}>Regularize</MenuItem>
                                                        <MenuItem onClick={handleMenuClose}>Apply Leave</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default AttendancePage;
