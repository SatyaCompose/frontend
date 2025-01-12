export interface ClockIn {

}

export interface MonthlyStatus {
    email: string,
    month: string,
    totalRequiredHours: number,
    actualWorkedHours: number,
    difference: number,
    attendancePercentage: number,
    status: string
}

export interface YearlyStatus {
    email: string,
    year: string,
    totalRequiredHours: number,
    actualWorkedHours: number,
    difference: number,
    attendancePercentage: number,
    status: string
}

export interface Attendance {
    _id: string,
    email: string,
    date: string,
    sessions: AttendanceSession[],
    createdAt: string,
    updatedAt: string,
    __v: number
}

export interface AttendanceSession {
    clockIn: string,
    clockOut: string,
    totalHours: number,
    _id: string
}