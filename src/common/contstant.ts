export const Roles = ["Employee", "Admin"];

export const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export const Months_in_Digits= ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]

export const generateLeaveEmailTemplate = (userName: string, startDate: string, endDate: string, cause: string) => `
  Subject: Leave Request from ${userName}

  Dear [Admin],

  I would like to request leave from ${startDate} to ${endDate}.
  Reason: ${cause}

  Kindly approve my request.

  Best Regards,
  ${userName}
`;

export const getLast10Days = () => {
    const today = new Date();
    const last10Days = [];

    for (let i = 0; i < 10; i++) {
        const day = new Date();
        day.setDate(today.getDate() - i); // Subtract i days from today's date
        last10Days.push({
            date: day.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            }), // Format: "Mon, Jun 26, 2023"
            isoDate: day.toISOString().split("T")[0], // ISO Date: "2024-11-24"
        });
    }

    return last10Days;
};

