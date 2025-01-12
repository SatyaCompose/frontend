import React from 'react';
import { Avatar } from '@mui/material';

interface ProfileAvatarProps {
    name: string;
    height: number;
    size: string
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ( {name, height, size}) => {
    const displayName = name || "Unknown";
    const initials = displayName.charAt(0).toUpperCase();
    const getColorForUser = (displayName: string) => {
        const colors = [
            '#FF5733', '#33FF57', '#3357FF',
            '#FF33A1', '#A133FF', '#33FFF1',
            '#FFC300', '#DAF7A6', '#FF5733'
        ];
        const hash = [...displayName].reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };
    const backgroundColor = getColorForUser(displayName);

    return (
        <Avatar
            sx={{
                bgcolor: backgroundColor,
                color: 'white',
                width: height,
                height: height,
                fontSize: size,
                margin: 'auto',
            }}
        >
            {initials}
        </Avatar>
    );
};