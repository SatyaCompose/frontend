import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { monthlyAttendanceStatus, yearlyAttendanceStatus } from '../services/attendance';
import { Months_in_Digits } from '../common/contstant';
import { toast, ToastContainer } from 'react-toastify';
import { MonthlyStatus, YearlyStatus } from '../types/attendance';

const AttendanceChart = () => {
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
    const currentMonth = (new Date().getMonth() + 1).toString();
    const currentYear = new Date().getFullYear().toString();
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<string>(currentYear);
    const [monthlyStatus, setMonthlyStatus] = useState<MonthlyStatus>();
    const [yearlyStatus, setYearlyStatus] = useState<YearlyStatus>()


    useEffect(() => {
        const fetchMonthlyStatus = async () => {
            try {
                const data = await monthlyAttendanceStatus(selectedMonth, selectedYear);

                if (data.status === 200) {
                    setMonthlyStatus(data?.data);
                } else {
                    toast.error('Something went wrong during fetching attendance status..!');
                }
            } catch (err) {
                toast.error('Error fetching attendance Status...!');
            }
        };

        const fetchYearlyStatus = async () => {
            try {
                const data = await yearlyAttendanceStatus(selectedYear);

                if (data.status === 200) {
                    setYearlyStatus(data?.data);
                } else {
                    toast.error('Something went wrong during fetching attendance status..!ß')
                }
            } catch (err) {
                toast.error('Error fetching attendance Status...!');
            }

        }
        fetchMonthlyStatus();
        fetchYearlyStatus();
    }, [selectedMonth, selectedYear]);

    const currentStatus = viewMode === 'yearly' ? yearlyStatus : monthlyStatus ?? {};

    if (!currentStatus) {
        return <div>Loading...</div>;
    }


    const {
        actualWorkedHours = 0,
        totalRequiredHours = 0,
        attendancePercentage = 0,
        status = 'N/A',
    } = currentStatus as MonthlyStatus | YearlyStatus;


    const absent = actualWorkedHours > totalRequiredHours ? 0 : totalRequiredHours - actualWorkedHours;

    let overallStatus;

    if (attendancePercentage < 50) {
        overallStatus = {
            data: 'Underperforming',
            color: 'red',
        };
    } else if (attendancePercentage >= 95) {
        overallStatus = {
            data: 'Perfect',
            color: 'green',
        };
    } else {
        overallStatus = {
            data: 'Satisfactory',
            color: '#ff9966',
        };
    }



    const chartData = {
        labels: ['Online', 'Offline'],
        datasets: [
            {
                data: [actualWorkedHours, absent],
                backgroundColor: ['#4CAF50', '#F44336'], // Green for Present, Red for Absent
                hoverBackgroundColor: ['#45A049', '#E57373'],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        cutout: '70%',
        plugins: {
            tooltip: { enabled: true },
            legend: { display: false },
        },
    };

    const years: string[] = Array.from({ length: 11 }, (_, index) => (Number(currentYear) - 5 + index).toString());

    return (
        <>
            <ToastContainer position='top-center' />
            <div style={{ padding: '20px' }}>
                {/* Container for the dropdowns and the doughnut */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                    {/* Dropdowns positioned at the top right */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        {/* View Mode Selection */}
                        <select
                            id="viewMode"
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value as 'monthly' | 'yearly')}
                            style={{
                                fontSize: '14px',
                                textAlign: 'center',
                                width: '130px', // Adjusted width
                                padding: '5px',
                            }}
                        >
                            <option value="monthly">Monthly Status</option>
                            <option value="yearly">Yearly Status</option>
                        </select>

                        {/* Dropdowns for Monthly or Yearly */}
                        {viewMode === 'monthly' && (
                            <div style={{ display: 'flex', gap: '10px', justifyContent: "center" }}>
                                <select
                                    id="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    style={{
                                        fontSize: '14px',
                                        textAlign: 'center',
                                        width: '60px', // Adjusted width
                                        padding: '5px',
                                    }}
                                >
                                    {Months_in_Digits.map((month: string) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    id="year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    style={{
                                        fontSize: '14px',
                                        textAlign: 'center',
                                        width: '80px', // Adjusted width
                                        padding: '5px',
                                    }}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {viewMode === 'yearly' && (
                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                style={{
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    width: '80px', // Adjusted width
                                    padding: '5px',
                                }}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Chart and Index */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                            <Doughnut data={chartData} options={chartOptions} />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                }}
                            >
                                <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{status}</p>
                                <small>Attendance</small>
                            </div>
                        </div>
                        <div>
                            <h4>Attendance Index</h4>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'inline-flex', flexDirection: 'column', gap: '10px' }}>
                                <li>
                                    <span style={{ width: '10px', height: '10px', background: '#4CAF50', marginRight: '10px' }} />
                                    Online: {Math.round(actualWorkedHours)}hrs
                                </li>
                                <li>
                                    <span style={{ width: '10px', height: '10px', background: '#F44336', marginRight: '10px' }} />
                                    Offline: {Math.round(absent)}hrs
                                </li>
                            </ul>
                            <p>
                                <strong>
                                    <span style={{ fontSize: 20 }}>Overall Status: </span>
                                    <span style={{ color: overallStatus.color, fontSize: 20 }}>{overallStatus.data}</span>
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>

            </div></>
    );
};

export default AttendanceChart;
