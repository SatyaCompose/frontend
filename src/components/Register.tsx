import React, { useState } from "react";
import "../styles/Register.css";
import logo from '../assets/logo.png';
import { Roles } from "../common/contstant";
import { register } from "../services/auth";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('Select Role');
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false,
        role: false,
    });
    const emailPattern = /^[a-zA-Z0-9._%+-]+@compose\.co\.in$/;
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (type: string) => {
        setSelectedOption(type);
        setIsOpen(false);
        setErrors((prev) => ({ ...prev, role: false }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: false });
    };

    const validateForm = () => {
        const { firstName, lastName, email, password, confirmPassword } = formData;
        const newErrors = {
            firstName: !firstName.trim(),
            lastName: !lastName.trim(),
            email: !email.trim(),
            password: !password.trim(),
            confirmPassword: !confirmPassword.trim(),
            role: selectedOption === "Select Role"
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword } = formData;

        if (
            firstName.trim() === '' ||
            lastName.trim() === '' ||
            email.trim() === '' ||
            password.trim() === '' ||
            confirmPassword.trim() === '' ||
            selectedOption === "Select Role"
        ) {
            toast.error('Fill all required fields..!');
            return;
        }

        if (!emailPattern.test(formData.email.trim())) {
            toast.error('Provide company email only..!');
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const registrationData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: selectedOption,
        };

        try {
            await register(registrationData);
            toast.success("Registration successful..!");
        } catch (error) {
            toast.error("Registration failed. Please try again..!");
            console.error("Error:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate('/sign-in');
    };

    const placeholderStyle = selectedOption === 'Select Role' ? { color: '#777' } : { color: '#333' };

    return (
        <>
            <ToastContainer position="top-center" pauseOnHover closeOnClick toastStyle={{fontSize: 18}}/>
            <div className="register-container">
                <div className="register-box">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="logo"
                    />
                    <h1>Compose Tech Services</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                style={errors.firstName ? { border: "2px solid red" } : {}}
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"

                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                style={errors.lastName ? { border: "2px solid red" } : {}}
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"

                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                id="email"
                                name="email"
                                style={errors.email ? { border: "2px solid red" } : {}}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"                              
                                
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                style={errors.password ? { border: "2px solid red" } : {}}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                id="confirmPassword"
                                style={errors.confirmPassword ? { border: "2px solid red" } : {}}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                
                            />
                        </div>
                        <div className="dropdown-container">
                            <div
                                className="dropdown-selected"
                                style={{
                                    ...placeholderStyle,
                                    border: errors.role ? "2px solid red" : '',
                                }}
                                onClick={toggleDropdown}
                            >{selectedOption}
                            </div>
                            {isOpen && (
                                <div className={`dropdown-options ${isOpen ? 'show' : ''}`}>
                                    {Roles.map((type) => (
                                        <div
                                            className='dropdown-option'
                                            data-value={type}
                                            key={type}
                                            onClick={() => handleOptionSelect(type)}
                                        >
                                            {type}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="register-button">Register</button>
                        <div>
                            <a href='/sign-in'>want to Sign in ?</a>
                        </div>
                    </form>
                </div>
            </div></>
    );
};

export default Register;
