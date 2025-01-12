import { apiClient } from "./auth"

export const fetchUser = async () => {
    try {
        const response = await apiClient.get("/user/get-user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return { status: 500, data: null };
    }
};

export const updateUser = async () => {
    try {
        const response = await apiClient.post("/user/update-user");
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return { status: 500, data: null };
    }
};
