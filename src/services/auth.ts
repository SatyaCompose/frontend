import axios from 'axios';

/**
 * Authentication  client with out token
 */
export const authClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Register user api
 * @param data 
 * @returns 
 */
export const register = async (data: any) => {
    const response = await authClient.post('/register', data);
    return response.data;
};

/**
 * Login Api
 */
export const loginService = async (data: any) => {
    const response = await authClient.post('/login', data);
    return response?.data;
};

/**
 * Logout Api
 */
export const logoutService = async (data: any) => {
    const response = await authClient.post('/logout', data);
    return response?.data;
};

/**
 * Refresh Access Token
 */
export const refreshAccessTokenService = async () => {
    try {

        let refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            const res = await refreshTokenService();
            localStorage.setItem('refresh_token', res.data);
            refreshToken = res.data;
        };
        // const token = refreshToken || refreshAccessToken;

        const response = await authClient.post('/refresh-access-token', { refreshToken });
        const { accessToken } = response?.data ?? {};
        localStorage.setItem("auth_token", accessToken);
        return response
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        localStorage.clear();
    }
};

export const refreshTokenService = async () => {
    const response = await authClient.get('/refresh-token')
    return response?.data;
}

/**
 * Schedule to refresh accessToken
 */
export async function scheduleTokenRefresh() {
    const token = localStorage.getItem("auth_token");
    let refreshToken = localStorage.getItem("refresh_token");

    // Fetch and store a refresh token if not available
    if (!refreshToken) {
        try {
            const res = await refreshTokenService();
            localStorage.setItem('refresh_token', res.data);
            refreshToken = res?.data;
        } catch (error) {
            console.error("Failed to get refresh token:", error);
            return; // Stop further execution if refresh token retrieval fails
        }
    }

    if (token) {
        try {
            // Validate the token structure
            const tokenParts = token?.split('.');
            if (tokenParts?.length !== 3) {
                throw new Error("Invalid token format");
            }

            const base64Payload = base64UrlToBase64(tokenParts[1]);
            const tokenPayload: any = JSON.parse(atob(base64Payload));

            // Calculate token expiry and schedule the refresh
            const expiresIn = tokenPayload.exp * 1000 - Date.now() - 60000;
            setTimeout(async () => {
                try {
                    await refreshAccessTokenService();
                    await scheduleTokenRefresh();
                } catch (error) {
                    console.error("Failed to refresh access token:", error);
                }
            }, Math.max(0, expiresIn));
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    } else {
        console.warn("Auth token not found in localStorage.");
    }
}

function base64UrlToBase64(base64Url: string) {
    return base64Url?.replace(/-/g, '+')?.replace(/_/g, '/');
}

await scheduleTokenRefresh();


/**
 * Api client which uses token
 */
export const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Intrgrating token to every apiClient request
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(new Error(error))
);
