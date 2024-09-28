import { useState } from "react";
import { Heading } from "../components/Heading";
import {SubHeading} from "../components/SubHeading";
import {InputBox} from "../components/InputBox";
import { Button } from "../components/Button";
import {BottomWarning} from "../components/BottomWarning";
import axios from "axios";
import { useNavigate } from "react-router-dom";

console.log("Signup.jsx file here");
export const Signup = () => {
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [userName,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate  = useNavigate();
    return (
        <>
        <div className="w-screen h-screen bg-gray-400 flex justify-center items-center">
         <div className="bg-white p-[10px]">
            <Heading label="Sign Up" />
            <SubHeading label={"Enter your information to create an Account"}/>
            <InputBox onChange={e => {setFirstName(e.target.value)}} placeholder="John" label={"First Name"} />
            <InputBox onChange={e => {setLastName(e.target.value)}} placeholder="Doe" label={"Last Name"} />
            <InputBox onChange={e => {setUsername(e.target.value)}} placeholder="john.doe@example.com" label={"Email"} />
            <InputBox onChange={e => {setPassword(e.target.value)}} placeholder="123456password" label={"Password"} />
            <Button onClick={async () => {
                const response = await axios.post("http://localhost:3001/api/v1/user/signup",{
                "username" : userName,
                "password" : password,
                "firstName" : firstName,
                "lastName" : lastName
                })
                .then((response) => {
                    // console.log(response.data.token);
                    localStorage.setItem("token",response.data.token);
                    console.log(localStorage.getItem("token"));
                    navigate("/dashboard");
                })
            }}label={"Sign Up"} />
            <BottomWarning label={"Already have an Account ?"} buttonText={"Log In"} to={"/login"} />
        </div>
      </div>
    </>
    )
}
