import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import axios from "axios";
import { useEffect, useState } from "react";

export const Transaction = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.user_Id;

        axios.get(
            `http://localhost:3001/api/v1/user/viewtransactions`, 
            {
                params: { userId: userIdFromToken }, 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            setTransactions(response.data.transactions);
        })
        .catch(error => {
            console.error("Error fetching transactions: ", error);
        });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const userIdFromToken = localStorage.getItem("token") ? jwtDecode(localStorage.getItem("token")).user_Id : null;

    return (
        <>
        <div className="min-h-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white w-[80%] p-6 rounded-lg shadow-md">
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Transaction History</h1>
                    <Button label={"BACK"} onClick={() => navigate("/dashboard")} />
                </div>
                <div className="border-t border-gray-300 mt-4 pt-4">
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => {
                            if (userIdFromToken === transaction.fromAccountId && transaction.type === "debit") {
                                // Sent transaction
                                return (
                                    <div key={index} className="my-4 p-4 bg-red-100 rounded-lg">
                                        <h3 className="text-lg font-medium text-red-600">
                                            Sent Rs.{transaction.amount} to {transaction.toUserName} on {formatDate(transaction.transactionDate)}
                                        </h3>
                                    </div>
                                );
                            } else if (userIdFromToken === transaction.toAccountId && transaction.type === "credit") {
                                // Received transaction
                                return (
                                    <div key={index} className="my-4 p-4 bg-green-100 rounded-lg">
                                        <h3 className="text-lg font-medium text-green-600">
                                            Received Rs.{transaction.amount} from {transaction.fromUserName} on {formatDate(transaction.transactionDate)}
                                        </h3>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    ) : (
                        <p className="text-gray-600">No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};
