import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";  // Correct import

export const UpdatePage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [balance, setBalance] = useState(0);  // balance is a number
    const [update, setUpdate] = useState(false);  // Update status
    const navigate = useNavigate();

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.user_Id;

            // Send the PUT request with correct headers and data
            const response = await axios.put(
                "http://localhost:3001/api/v1/user/update",
                {
                    username: userName,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    balance: balance  // Make sure balance is a number
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            // Handle successful response
            if (response.status === 200) {
                setUpdate(true);  // Set update state to true on success
                alert("Updated Successfully!");
            }
        } catch (error) {
            console.error("Error updating account:", error);
            alert("Failed to update account.");
        }
    };

    return (
        <>
        <div className="w-screen h-screen bg-gray-400 grid justify-center items-center">
            <div className="bg-white p-[10px]">
            <Heading label="UPDATE" />
            <SubHeading label={"Enter your information to UPDATE your Account"} />
            <InputBox onChange={e => setFirstName(e.target.value)} placeholder="John" label={"First Name"} />
            <InputBox onChange={e => setLastName(e.target.value)} placeholder="Doe" label={"Last Name"} />
            <InputBox onChange={e => setUsername(e.target.value)} placeholder="john.doe@example.com" label={"Email"} />
            <InputBox onChange={e => setPassword(e.target.value)} placeholder="123456password" label={"Password"} />
            <InputBox onChange={e => setBalance(Number(e.target.value))} placeholder="1000" label={"Balance"} />  {/* Ensure balance is a number */}
          
            {/* Conditionally render LOGIN button based on update state */}
            {update ? (
                <Button onClick={() => navigate("/login")} label={"LOGIN"} />
            ) : (
                <>
                    <Button onClick={handleUpdate} label={"UPDATE"} />
                    <BottomWarning label={"Do not want to UPDATE ?"} buttonText={"CANCEL"} to={"/dashboard"} />
                </>
            )}
            </div>
        </div>
        </>
    );
};
