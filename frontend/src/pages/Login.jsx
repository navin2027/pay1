import { BottomWarning } from "../components/BottomWarning"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import {Button} from "../components/Button"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export const Login = () => {
    const navigate  = useNavigate();
    const [userName,setUsername] = useState('');
    const [userPassword,setPassword] = useState('');
    function handleLogin (){
        const response = axios.post("http://localhost:3001/api/v1/user/login",{
            username : userName,
            password : userPassword
         })
         .then((response) => {
             // console.log(response.data.token);
             localStorage.setItem("token",response.data.token);
             console.log(localStorage.getItem("token"));
             navigate("/dashboard");
         })
    }
    console.log("This console is from the Login Page");
    return(
        <>
        <div className="w-screen h-screen bg-gray-400 grid justify-center items-center">
          <div className="bg-white p-[10px]">
            <Heading label={"Log In"} />
            <SubHeading label={"Enter your credentials to access your account"} />
            <InputBox placeholder="navin123@gmaii.com" label={"Email"} onChange={e => setUsername(e.target.value)}/>
            <InputBox placeholder="password123" label={"Password"} onChange={e => setPassword(e.target.value)}/>
            <Button label={"Log In"} onClick={handleLogin}/>
            <BottomWarning label={"Don't  have an account ?"} buttonText={"Sign Up"} to={"/signup"}/>
          </div>
        </div>
        </>
    )
}