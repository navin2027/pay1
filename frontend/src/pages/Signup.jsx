import { useState } from "react";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import axios from "axios";
import { useNavigate } from "react-router-dom";

console.log("Signup.jsx file here");

export const Signup = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for storing error messages
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3001/api/v1/user/signup", {
                username: userName,
                password: password,
                firstName: firstName,
                lastName: lastName
            });

            // Save token to localStorage and navigate to dashboard on successful signup
            localStorage.setItem("token", response.data.token);
            console.log(localStorage.getItem("token"));
            navigate("/dashboard");

        } catch (error) {
            // Handle errors, such as validation or duplicate email
            if (error.response && error.response.status === 400) {
                setErrorMessage("Signup failed: " + error.response.data.message); // Set error message from server
            } else {
                setErrorMessage("An error occurred. Please try again."); // Generic error message
            }
            console.error("Signup error:", error);
        }
    };

    return (
        <>
            <div className="w-screen h-screen bg-gray-400 flex justify-center items-center">
                <div className="bg-white p-[10px]">
                    <Heading label="Sign Up" />
                    <SubHeading label={"Enter your information to create an Account"} />
                    <InputBox onChange={e => setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
                    <InputBox onChange={e => setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
                    <InputBox onChange={e => setUsername(e.target.value)} placeholder="john.doe@example.com" label={"Email"} />
                    <InputBox onChange={e => setPassword(e.target.value)} placeholder="123456password" label={"Password"} />

                    {/* Display error message if signup fails */}
                    {errorMessage && (
                        <div className="text-red-500 text-center mb-2">
                            {errorMessage}
                        </div>
                    )}

                    <Button onClick={handleSignup} label={"Sign Up"} />
                    <BottomWarning label={"Already have an Account?"} buttonText={"Log In"} to={"/login"} />
                </div>
            </div>
        </>
    );
};
