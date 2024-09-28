import { BottomWarning } from "../components/BottomWarning";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { Button } from "../components/Button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [userName, setUsername] = useState('');
    const [userPassword, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages

    async function handleLogin() {
        try {
            const response = await axios.post("http://localhost:3001/api/v1/user/login", {
                username: userName,
                password: userPassword
            });
            
            // Save token in localStorage
            localStorage.setItem("token", response.data.token);
            console.log(localStorage.getItem("token"));

            // Redirect to dashboard on successful login
            navigate("/dashboard");

        } catch (error) {
            // Handle errors, such as wrong username/password
            if (error.response && error.response.status === 401) {
                setErrorMessage("Incorrect username or password. Please try again."); // Set error message for wrong credentials
            } else {
                setErrorMessage("An error occurred. Please try again later."); // General error handling
            }
            console.error("Login error:", error);
        }
    }

    return (
        <>
        <div className="w-screen h-screen bg-gray-400 grid justify-center items-center">
          <div className="bg-white p-[10px]">
            <Heading label={"Log In"} />
            <SubHeading label={"Enter your credentials to access your account"} />
            <InputBox placeholder="navin123@gmaii.com" label={"Email"} onChange={e => setUsername(e.target.value)} />
            <InputBox placeholder="password123" label={"Password"} onChange={e => setPassword(e.target.value)} />

            {/* Display error message if login fails */}
            {errorMessage && (
                <div className="text-red-500 text-center mb-2">
                    {errorMessage}
                </div>
            )}

            <Button label={"Log In"} onClick={handleLogin} />
            <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"} />
          </div>
        </div>
        </>
    );
};
