import { useEffect } from 'react';
import '../styles/Logout.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const handleLogout = async () => {
            logout();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            navigate("/sign-in");
        };
        handleLogout();
    }, [logout, navigate]);

    return (
        <div className="logout-container">
            <div className="logout-box">
                <CheckCircleIcon style={{ color: 'green', fontSize: 100 }} />
                <h2>Logged out Successfully!</h2>
                <div className="color-pieces"></div>
            </div>
        </div>
    );
};

export default Logout;
