import { useState, useEffect } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Correct import for jwtDecode

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        // Decode the token to get the logged-in user's ID
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedInUserId(decodedToken.user_Id); // Use user_Id from the token
        }

        // Fetch users from the backend
        axios.get('http://localhost:3001/api/v1/user/bulk?filter=' + filter)
            .then(response => {
                const users = response.data.User;

                // Filter out the logged-in user
                const filteredUsers = users.filter(user => user._id !== loggedInUserId);
                setUsers(filteredUsers);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, [filter, loggedInUserId]);

    return (
        <>
            <h1>Users</h1>
            <div>
                <input onChange={e => setFilter(e.target.value)} type="text" placeholder="Search Users ... " />
            </div>
            <div>
                {users.map(user => <User key={user._id} user={user} />)}
            </div>
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    // Add a check to make sure firstName is defined
    const firstNameInitial = user.firstName ? user.firstName[0].toUpperCase() : "";

    return (
        <>
            <div>
                {firstNameInitial}
            </div>
            <div>
                {/* Fallback if firstName or lastName is not available */}
                {user.firstName ? `${user.firstName} ${user.lastName}` : "Name not available"}
            </div>
            <div>
                <Button onClick={() => {
                    navigate("/send?id=" + user._id + "&name=" + (user.firstName || "User"));
                }} label={"Send Money"} />
            </div>
        </>
    );
}
