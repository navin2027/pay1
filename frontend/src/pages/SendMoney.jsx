import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Heading } from "../components/Heading";

export const SendMoney = () => {
    const [amount, setAmount] = useState(0);
    const [balance, setBalance] = useState(0);
    const [searchParams] = useSearchParams();
    const [update, setUpdate] = useState(false);
    const id = searchParams.get("id"); // Recipient's account ID
    const name = searchParams.get("name");
    const navigate = useNavigate();

    async function handleTransfer() {
        try {
            const token = localStorage.getItem("token");
            const decodedToken = jwtDecode(token);
            const userIdFromToken = decodedToken.user_Id; // Sender's user ID

            // Fetch current user balance
            const response1 = await axios.get("http://localhost:3001/api/v1/user/mybalance", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userBalance = response1.data.balance;
            setBalance(userBalance); // Update the balance

            // Perform the transfer only if balance is sufficient
            if (userBalance > amount) {
                // Make the transfer
                await axios.post("http://localhost:3001/api/v1/account/transfer", {
                    to: id,
                    amount: amount,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Register the transaction
                await axios.post("http://localhost:3001/api/v1/user/transaction", {
                    amount: amount, // The amount to be transferred
                    fromAccountId: userIdFromToken, // The sender's account ID
                    toAccountId: id   // The recipient's account ID
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // sender's token
                    },
                });

                setUpdate(true);  // Trigger the update state after a successful transfer
                alert("Transfer successful and transaction registered!");
            } else {
                alert("Insufficient balance.");
            }
        } catch (error){
            console.error("Error during transfer", error);
            alert("An error occurred during the transfer.");
        }
    }

    return (
        <>
         <div className="w-screen h-screen bg-gray-400 grid justify-center items-center">
            <div className="bg-white p-[10px] rounded-lg shadow-lg">
            <div>
                <Heading label={"Send Money"} />
            </div>
            <div>
                <div className="font-bold italic text-lg">
                    <span className="">{name[0].toUpperCase()}</span>
                </div>
                <h3 className="italic">{name}</h3>
            </div>
            <div className="my-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount (in RS.)
                </label>
                <input 
                    type="number" 
                    id="amount" 
                    name="amount" 
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={e => setAmount(Number(e.target.value))} 
                />
            </div>
            <div className="my-4">
                <button 
                    onClick={handleTransfer} 
                    className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Initiate Transfer
                </button>
            </div>
            <div className="my-4">
                {update && (
                    <Button 
                        onClick={() => navigate("/dashboard")} 
                        label={"BACK"} 
                        className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                    />
                )}
            </div>
            </div>
        </div>
        </>
    );
};
