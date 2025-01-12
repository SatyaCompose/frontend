import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import '../styles/UserDashboard.css';
import '../styles/NotificationForm.css'
import Select from 'react-select';
import Button from '@mui/material/Button';
import NotificationIcon from './NotificationIcon';
import { ProfileAvatar } from './ProfileAvatar';
import { fetchUser } from '../services/user';
import { User } from '../types/user';

const NotificationForm = () => {
    const [type, setType] = useState('leave');
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        hours: '',
        cause: '',
        date: '',
    });
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

    const options = [
        { value: "leave", label: "Leave" },
        { value: "working-hours", label: "Working Hours Adjustment" },
        { value: "general", label: "General" }
    ];

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
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
                    <div className='form-div'>
                        <h1>Send a Notification</h1>
                        <form className='notification-form' onSubmit={handleSubmit}>
                            <Select
                                placeholder="Type"
                                options={options}
                                onChange={(e: any) => setType(e?.value)}
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        borderColor: "#ccc",
                                        borderRadius: "4px",
                                        padding: "5px",
                                        boxShadow: "none",
                                    }),
                                    option: (provided, state) => ({
                                        ...provided,
                                        backgroundColor: state.isFocused ? "#4CAF50" : "#fff",
                                        color: state.isFocused ? 'white' : "#000",
                                        cursor: "pointer",
                                    })
                                }}
                                required
                            />

                            {type === 'leave' && (
                                <>
                                    <input type="date" name="startDate" onChange={handleChange} placeholder='Start Date' required />
                                    <input type="date" name="endDate" onChange={handleChange} placeholder='End Date' required />
                                    <textarea name="cause" onChange={handleChange} placeholder='Cause' required />

                                </>
                            )}

                            {type === "working-hours" && (
                                <>
                                    <input placeholder='Date' type="date" name="date" onChange={handleChange} required />
                                    <input placeholder='From' type="time" name="start-hours" onChange={handleChange} required />
                                    <input placeholder='To' type="time" name="end-hours" onChange={handleChange} required />
                                    <textarea placeholder='Cause' name="cause" onChange={handleChange} required />
                                </>
                            )}

                            {type === 'general' && (
                                <>
                                    <input placeholder='title' type="title" name="startDate" onChange={handleChange} required />
                                    <input placeholder='Subject' type="subject" name="endDate" onChange={handleChange} required />
                                    <textarea placeholder='Body' name="body" onChange={handleChange} required />
                                </>
                            )

                            }

                            <Button
                                type="submit"
                                aria-valuetext=''
                                style={{
                                    alignSelf: 'center',
                                    fontSize: 15,
                                    backgroundColor: "#4CAF50",
                                    color: 'white'
                                }}
                            >Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationForm;
