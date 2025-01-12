import React, { useState } from "react";
import TextField from "@mui/material/TextField";

interface CustomTextFieldProps {
    label: string;
    defaultValue: string;
    mb: number;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, defaultValue, mb }) => {
    const [value, setValue] = useState(defaultValue);

    return (
        <TextField
            label={label}
            value={value}
            fullWidth
            variant="outlined"
            sx={{
                mb: mb,
                "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                        borderColor: "#4CAF50", // Set border color to green when focused
                    },
                },
                "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                        color: "#4CAF50", // Optional: Set label color to green when focused
                    },
                },
            }}
            onChange={(e) => setValue(e.target.value)}// Reset focus state
        />
    );
};

export default CustomTextField;
