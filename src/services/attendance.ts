import { apiClient } from "./auth"

export const monthlyAttendanceStatus = async (month: string, year: string)=>{
    const response = await apiClient.post('/user/attendance-monthly-status', { month, year});
    return response.data;
}

export const yearlyAttendanceStatus = async (year: string) => {
    const response = await apiClient.post('/user/attendance-yearly-status', { year });
    return response.data;
}

export const getAttendances = async () => {
    const response = await apiClient.get('/user/get-attendance');
    return response.data;
}

export const clockIn = async () => {
    const response = await apiClient.get('/user/clock-in');
    return response.data;
}

export const clockOut = async () => {
    const response = await apiClient.get('/user/clock-out');
    return response.data;
}