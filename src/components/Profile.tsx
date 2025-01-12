import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import '../styles/UserDashboard.css';
import { Tabs, Tab, Box, Button, TextField } from '@mui/material';
import NotificationIcon from './NotificationIcon';
import { ProfileAvatar } from './ProfileAvatar';
import { fetchUser, updateUser } from '../services/user';
import '../styles/Profile.css'
import CustomTextField from './ProfileTextField';
import SectionTitle from './SectionTitle';

const ProfilePage = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [user, setUser] = useState<any>({});
    const [isFocused, setIsFocused] = useState(false);

    // const [formData, setFormData] = useState();

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

        const updateUserData = async () => {
            try{
                const data = await updateUser();
                if (data && data.status === 200){
                    const userData = data?.data || {};
                    setUser(userData);
                }
            }catch(err: any){
                console.error("Error Updating...", err)
            }
        }
        updateUserData()
        fetchData();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
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
                        <ProfileAvatar name={user?.firstName + user?.lastName} height={80} size='2.5rem' />
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
                    <Box sx={{ width: '80%', margin: 'auto', mt: 4 }}>
                        <Tabs value={tabIndex} onChange={handleTabChange} centered>
                            <Tab label="User Details" />
                            <Tab label="Change Password" />
                            <Tab label="Delete Account" />
                        </Tabs>

                        <Box className='UserData-Box' sx={{ mt: 4 }}>
                            {tabIndex === 0 && (
                                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <ProfileAvatar name={user?.firstName+user?.lastName} height={150} size='5rem' />
                                    <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 40, marginTop: 80 }}>
                                        <CustomTextField label='First Name' defaultValue='' mb={4}/>
                                        <CustomTextField label='Last Name' defaultValue='' mb={4} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 40 }}>
                                        <CustomTextField label='Gender' defaultValue='' mb={4} />
                                        <CustomTextField label='Date of Birth' defaultValue='' mb={4} />
                                    </div>
                                    <div
                                        style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 40, }}
                                    >
                                        <CustomTextField label='Email' defaultValue='' mb={2} />
                                        <CustomTextField label='Mobile' defaultValue='' mb={2} />
                                    </div>
                                    <SectionTitle text='Job Details' />
                                    <div
                                        style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 40, }}
                                    >
                                        <CustomTextField label='First Name' defaultValue='' mb={4} />
                                        <CustomTextField label='Last Name' defaultValue='' mb={4} />
                                    </div>
                                    <div
                                        style={{ display: 'flex', flexDirection: 'row', alignSelf: 'center', gap: 40, }}
                                    >
                                        <CustomTextField label='First Name' defaultValue='' mb={4} />
                                        <CustomTextField label='Last Name' defaultValue='' mb={4} />
                                    </div>

                                    <Button variant="contained" style={{ marginTop:20, width: '20%', alignSelf: 'center'}}>Save Changes</Button>
                                </Box>
                            )}
                            {tabIndex === 1 && (
                                <Box>
                                    <CustomTextField label='Current Password' defaultValue='' mb={4} />
                                    <CustomTextField label='New Password' defaultValue='' mb={4} />
                                    <CustomTextField label='Confirm Password' defaultValue='' mb={4} />
                                    <Button variant="contained">Change Password</Button>
                                </Box>
                            )}
                            {tabIndex === 2 && (
                                <Box sx={{ textAlign: 'center', color: 'red' }}>
                                    <p>Deleting your account is irreversible. Please confirm.</p>
                                    <Button variant="contained" color="error">
                                        Delete Account
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
