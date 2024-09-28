import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

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
                // await axios.post("http://localhost:3001/api/v1/user/transaction", {
                //     userId: userIdFromToken,
                //     amount: amount,
                //     type: "debit", // The transfer is a debit from the sender's account
                //     fromAccountId: userIdFromToken, // Sender's account ID
                //     toAccountId: id // Recipient's account ID
                // }, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // });

                await axios.post("http://localhost:3001/api/v1/user/transaction", {
                        amount: amount, // The amount to be transferred
                        fromAccountId: userIdFromToken, // The sender's account ID
                        toAccountId: id   // The recipient's account ID
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`, // sender's token
                    },
                });
                
                // The backend will handle both the debit and credit transactions
                

                setUpdate(true);
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
            <div>
                <h2>Send Money</h2>
            </div>
            <div>
                <div>
                    <span>{name[0].toUpperCase()}</span>
                </div>
                <h3>{name}</h3>
            </div>
            <div>
                <label htmlFor="amount">Amount (in RS.)</label>
                <input type="number" id="amount" name="amount" onChange={e => setAmount(Number(e.target.value))} />
                <button onClick={handleTransfer}>Initiate Transfer</button>
            </div>
            <div>
            {update ? (
                <Button onClick={() => navigate("/dashboard")} label={"BACK"} />
                ) : (
                <div></div>
                )}
            </div>
        </>
    );
};
