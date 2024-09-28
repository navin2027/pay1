import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Correct import
import axios from "axios";
import { useEffect, useState } from "react";

export const Transaction = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Decode the token to get the logged-in user's ID
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.user_Id;

        // Fetch transactions from the backend
        axios.get(
            `http://localhost:3001/api/v1/user/viewtransactions`, 
            {
                params: { userId: userIdFromToken }, // Add userId as a query parameter
                headers: {
                    Authorization: `Bearer ${token}` // Authorization header
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
            <h1>Transaction History</h1>
            <Button label={"BACK"} onClick={() => navigate("/dashboard")} />
            <div>
                {transactions.map((transaction, index) => {
                    if (userIdFromToken === transaction.fromAccountId && transaction.type === "debit") {
                        // Sent transaction
                        return (
                            <h3 key={index}>
                                Sent Rs.{transaction.amount} to {transaction.toUserName} on {formatDate(transaction.transactionDate)}
                            </h3>
                        );
                    } else if (userIdFromToken === transaction.toAccountId && transaction.type === "credit") {
                        // Received transaction
                        return (
                            <h3 key={index}>
                                Received Rs.{transaction.amount} from {transaction.fromUserName} on {formatDate(transaction.transactionDate)}
                            </h3>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </>
    );
};
