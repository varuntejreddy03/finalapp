import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // If the user is already in our context, we don't need to fetch it again.
        if (user) return;

        let isMounted = true;

        const fetchUserInfo = async () => {
            // First, check if a token exists in local storage.
            const token = localStorage.getItem('token');
            if (!token) {
                clearUser();
                navigate("/login");
                return;
            }
            
            try {
                // If a token exists, fetch the user's profile information.
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_PROFILE);

                if (isMounted && response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info", error);
                // If the token is invalid or expired, the API call will fail.
                // Clear the user data and redirect to the login page.
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        // Cleanup function to prevent state updates if the component unmounts
        return () => {
            isMounted = false;
        };
    }, [user, updateUser, clearUser, navigate]);

    return user;
};
