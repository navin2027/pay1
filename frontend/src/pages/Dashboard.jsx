import { Appbar } from "../components/Appbar"
import {Balance} from "../components/Balance"
import {Users} from "../components/Users"
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Dashboard = () => {
    const navigate = useNavigate();
    // function mybalancecheck(){
    //   navigate("/balancecheck")
    // }
    return (
        <>
        <div className="w-screen h-screen bg-gray-400 grid justify-center items-center">
            <div className="">
             <Appbar />
            </div>
            <div className="bg-white p-[10px]">
                {/* <Balance value={"10,000"} /> */}
                <Button label={"My Balance"} onClick={() => navigate("/balancecheck")} />
                <Button label={"UPDATE"} onClick={() => navigate("/update")} />
                <Button label={"BACK"} onClick={() => navigate("/login")} />
                <Button label={"VIEW  TRANSACTION HISTORY"} onClick={() => navigate("/transaction")} />
                <Users />
            </div>
        </div>
        </>
)}