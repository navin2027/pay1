import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Use named import if default import doesn't work
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { useNavigate } from 'react-router-dom';
import { Appbar } from "../components/Appbar";

export const BalanceCheck = () => {
    const [amt, setAmt] = useState(null); // Store balance here
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
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

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    return (
        <> 
            <div className="w-screen h-screen bg-gray-400 grid justify-center items-center">
                <div className="bg-white p-[10px]">
                    <Appbar />

                    <div className="relative">
                        <label className="block text-lg text-center mb-2">
                            Enter Password to check Balance:
                        </label>
                        <input
                            className="text-lg text-center border p-2 w-full"
                            type={showPassword ? "text" : "password"}  // Toggle between text and password
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="PASSWORD"
                        />
                        {/* Toggle visibility button */}
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-3 cursor-pointer text-gray-500"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <Button label={"CHECK"} onClick={handleCheckBalance} /> 
                    <Button label={"BACK"} onClick={() => navigate("/dashboard")} />

                    {amt !== null && (
                        <div className="text-center text-2xl">
                            <h1>Balance: ₹{amt}</h1>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="text-center text-2xl text-red-500 uppercase">
                            <h1>{errorMessage}</h1>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
