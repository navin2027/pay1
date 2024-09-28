import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import if default import doesn't work

export const Appbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch all users
                const response = await axios.get("http://localhost:3001/api/v1/user/bulk");
                const users = response.data.User;
                console.log(users);

                // Get the token from localStorage
                const token = localStorage.getItem("token"); // Make sure you have a token in localStorage
                console.log("Token in local storage:", token);

                if (token) {
                    // Decode the token to get the user ID
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.user_Id;
                    console.log(userId); // Replace `user_Id` with the correct field name

                    // Find the user with the matching ID
                    const currentUser = users.find(user => user._id === userId);

                    if (currentUser) {
                        setUser(currentUser);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <>
            <div className="">PayTM App</div>
            <div>
                {user ? (
                    <div>Hello {user.firstName} {user.lastName}</div>
                ) : (
                    <div>Hello Guest</div>
                )}
            </div>
        </>
    );
};
