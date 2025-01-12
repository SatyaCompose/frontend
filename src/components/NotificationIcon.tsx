import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

const NotificationIcon = ({ count = 0 }) => {
    return (
        <Badge
            badgeContent={count}
            color="error"
            overlap="circular"
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <NotificationsIcon style={{ fontSize: '3rem', color: 'black', cursor: 'pointer' }} href='/user/notification-form' />
        </Badge>
    );
};

export default NotificationIcon;
