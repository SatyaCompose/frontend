import { toast, ToastContainer } from "react-toastify";
import logo from '../assets/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { loginService } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import '../styles/Register.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });

    const emailPattern = /^[a-zA-Z0-9._%+-]+@compose\.co\.in$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: false });
    };

    const validateForm = () => {
        const { email, password } = formData;
        const newErrors = {
            email: !email.trim(),
            password: !password.trim(),
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { email, password } = formData;

        if (
            email.trim() === '' ||
            password.trim() === ''
        ) {
            toast.error('Fill all required fields..!');
            return;
        }

        if (!emailPattern.test(email.trim())) {
            toast.error('Provide company email only..!');
            return;
        }

        if (!validateForm()) {
            return;
        }

        const loginData = {
            email: email,
            password: password,
        };

        try {
            const response = await loginService(loginData);

            if (response?.status !== 200) {
                toast.error(`${response.message}`);
                return;
            }
            const { role, accessToken, refreshToken } = response.data || {};
            localStorage.setItem("auth_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            toast.success("Login successful..!");
            if (!role || !accessToken) {
                toast.error("Invalid response data");
                return;
            }

            login(accessToken);
            navigate(role.toLowerCase() === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        } catch (error) {
            toast.error("Login failed. Please try again..!");
            console.error("Error:", error);
        }
    };

    return (
        <>
            <ToastContainer position="top-center" pauseOnHover closeOnClick toastStyle={{ fontSize: 18 }} />
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
                        <button type="submit" className="register-button">Sign in</button>
                        <div>
                            <a href='/register'>want to Register ?</a>
                            <a href='/forgot-password'>forgot password ?</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
