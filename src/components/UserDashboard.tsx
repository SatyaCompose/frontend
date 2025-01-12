import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import '../styles/UserDashboard.css';
import AttendanceChart from './AttendenceChart';
import { fetchUser } from '../services/user';
import NotificationIcon from './NotificationIcon';
import { ProfileAvatar } from './ProfileAvatar';
import { User } from '../types/user';

const UserDashboard = () => {
    const [user, setUser] = useState<User>({});

    const { firstName = '', lastName = '' } = user ?? {}

    useEffect(() => {
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
    }, []);

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
                        <ProfileAvatar name={firstName+lastName} height={80} size='2.5rem' />
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
                            <Link to="/user/profile" className='link'>
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
                    <h1>Welcome {user?.firstName}!!!</h1>
                    <div className="dashboard-grid">
                        <div className="box">
                            <h2 style={{ padding: 30 }}>Attendance Status</h2>
                            <AttendanceChart />
                        </div>

                        <div className="box coming-leaves">
                            <h2>Up Coming Holidays</h2>
                            {/* Content for Coming Leaves */}
                        </div>

                        <div className="box birthday-list">
                            <h2>Upcoming Leaves</h2>
                            {/* Content for Birthday List */}
                        </div>

                        <div className="box notifications">
                            <h2>Skills Acquired</h2>
                            {/* Content for Notifications */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
