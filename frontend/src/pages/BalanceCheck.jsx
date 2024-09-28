import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import if default import doesn't work
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from 'react-router-dom';

export const BalanceCheck = () => {
    const [amt, setAmt] = useState(null); // Store balance here
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // For error handling
    const navigate = useNavigate(); // Add navigation hook

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/v1/user/bulk");
                const users = response.data.User;
                console.log(users);

                const token = localStorage.getItem("token");

                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.user_Id;

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

    async function handleCheckBalance() {
        try {
            console.clear(); // Clear console
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.user_Id;

            const response = await axios.get("http://localhost:3001/api/v1/user/bulk/withpassword", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const users_with_password = response.data.User;

            const matchedUser = users_with_password.find(user => user._id === userIdFromToken);

            if (matchedUser && matchedUser.password === password) {
                console.log("Password is correct");
                
                const response1 = await axios.get("http://localhost:3001/api/v1/user/mybalance", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAmt(response1.data.balance); // Set the balance
                setErrorMessage(""); // Clear error message if successful
            } else {
                console.log("Password is incorrect");
                setAmt(null);
                setErrorMessage("Password is incorrect"); // Set error message
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            setErrorMessage("An error occurred while fetching balance");
        }
    }

    return (
        <>
            <div>PayTM App</div>
            <div>
                {user ? (
                    <div>Hello {user.firstName} {user.lastName}</div>
                ) : (
                    <div>Hello Guest</div>
                )}
            </div>
            <div>
                <InputBox onChange={e => setPassword(e.target.value)} placeholder="your password here" label={"Enter Password to check Balance:"} />
                <Button label={"CHECK"} onClick={handleCheckBalance} />
                <Button label={"BACK"} onClick={() => navigate("/dashboard")} />
            </div>
            {amt !== null && (
                <div>
                    <h1>Balance: ₹{amt}</h1>
                    {/* <Button label={"OK"} onClick={() => navigate("/dashboard")} /> */}
                </div>
            )}
            {errorMessage && (
                <div>
                    <h1>{errorMessage}</h1>
                </div>
            )}
        </>
    );
};
