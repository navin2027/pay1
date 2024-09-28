const express = require("express");
const router = express.Router()
const authMiddleware = require("../middleware")
const zod = require("zod");
const JWT_SECRET = require('../config');
const { User, Account,Transaction } = require("../db");

const jwt = require("jsonwebtoken")

const signUpSchema = zod.object({
    username: zod.string().email(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})

// signup route

router.post("/signup",async (req,res) => {

   const body = req.body;
   const {success} =  signUpSchema.safeParse(body);
   if(!success) {
    return res.status(411).json({
        message:"Incorrect inputs"
    })
   }
   const existing_user = await User.findOne({
    username : body.username
   })
   if(existing_user) {
    return res.status(411).json({
        message:"Username already exists"
    })
   }
//    const new_user = await User.create(body);
   const new_User =  await User.create({
    username : body.username,
    password : body.password,
    firstName : body.firstName,
    lastName : body.lastName
   })

   const user_Id = new_User._id

   await Account.create({
    userId : user_Id,
    balance : 1 + Math.random() * 1000
   })

   const token = jwt.sign({user_Id},JWT_SECRET);
   res.json({
    message: "New user created successfully",
    token : token
   })
})

//   login route

const loginSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

router.post("/login", async (req, res) => {
    const body = req.body;

    // Validate the request body with Zod
    const { success, error } = loginSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid username or password format",
        });
    }

    try {
        // Find the user by username
        const user = await User.findOne({ username: body.username });
        if (!user) {
            return res.status(404).json({
                message: "Invalid username or password",
            });
        }

        // Check if the password matches (you should hash passwords and compare hashes)
        if (user.password !== body.password) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        // If authentication is successful, generate a JWT
        const token = jwt.sign({ user_Id: user._id }, JWT_SECRET);

        // Send back the token in the response
        res.json({
            message: "Login successful",
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during login",
            error: error.message,
        });
    }
});

 // update user_info

 const updateSchema = zod.object({
    username: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional(),
    balance: zod.number().optional(),  // Add balance to the schema
});

router.put("/update", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success, data } = updateSchema.safeParse(body);
    
    if (!success) {
        return res.status(411).json({
            message: "Error while updating the information",
        });
    }

    try {
        // Update the user details in the users collection
        await User.updateOne(
            { _id: req.userId },   // Use req.userId from authMiddleware
            { $set: data }         // Update only the fields provided in the body
        );

        // If balance is provided, update the balance in the accounts collection
        if (data.balance !== undefined) {
            await Account.updateOne(
                { userId: req.userId },
                { $set: { balance: data.balance } }
            );
        }

        res.json({
            message: "User information and balance updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while updating the user or balance",
        });
    }
});

// getting user names 

router.get("/bulk",async (req,res) => {
    const filter = req.query.filter || "";
    
    // const users = await User.find({
    //     $or : [{
    //         firstName : {
    //             $regex : filter,
    //         }
    // },{
    //     lastName : {
    //         $regex : filter,
    //     }
    // }]
    // })
    const users = await User.find({
        $or: [
            { firstName: { $regex: filter, $options: 'i' } },
            { lastName: { $regex: filter, $options: 'i' } }
        ]
    });
    
    res.json({
        User : users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            _id : user._id
        }))
    })
})

router.get("/bulk/withpassword",authMiddleware,async (req,res) => {
    const filter = req.query.filter || "";
    
    // const users = await User.find({
    //     $or : [{
    //         firstName : {
    //             $regex : filter,
    //         }
    // },{
    //     lastName : {
    //         $regex : filter,
    //     }
    // }]
    // })
    const users = await User.find({
        $or: [
            { firstName: { $regex: filter, $options: 'i' } },
            { lastName: { $regex: filter, $options: 'i' } }
        ]
    });
    
    res.json({
        User : users.map(user => ({
            username : user.username,
            firstName : user.firstName,
            lastName : user.lastName,
            password : user.password,
            _id : user._id
        }))
    })
})


router.get("/mybalance",authMiddleware,async (req,res) => {
    const account = await Account.findOne({ userId: req.userId });

    if (!account) {
        return res.status(404).json({
            message: "Account not found for this user"
        });
    }

    // Send the balance back in the response
    res.json({
        message: "Balance fetched successfully",
        balance: account.balance
    });
})

const transactionSchema = zod.object({
    amount: zod.number(),
    fromAccountId: zod.string(),
    toAccountId: zod.string()
});

// router.post("/transaction",authMiddleware,async (req,res) => {
//     const body = req.body;
//     const { success, data } = transactionSchema.safeParse(body);
//     if (!success) {
//         return res.status(411).json({
//             message: "Invalid transaction data",
//         });
//     }
//     try {
//         // Create the transaction in the database
//         const newTransaction = await Transaction.create({
//             userId: req.userId,
//             amount: data.amount,
//             type: data.type,
//             fromAccountId: data.fromAccountId,
//             toAccountId: data.toAccountId,
//         });

//         res.json({
//             message: "Transaction successful",
//             transaction: newTransaction,
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Error while creating transaction",
//             error: error.message,
//         });
//     }
// })

router.post("/transaction", authMiddleware, async (req, res) => {
    const body = req.body;
    const { success, data } = transactionSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid transaction data",
        });
    }

    try {
        // Debit the sender
        const debitTransaction = await Transaction.create({
            userId: req.userId,
            amount: data.amount,
            type: 'debit',
            fromAccountId: data.fromAccountId,
            toAccountId: data.toAccountId,
        });

        // Credit the recipient
        const creditTransaction = await Transaction.create({
            userId: data.toAccountId, // recipient's user ID
            amount: data.amount,
            type: 'credit',
            fromAccountId: data.fromAccountId,
            toAccountId: data.toAccountId,
        });

        res.json({
            message: "Transaction successful",
            debitTransaction,
            creditTransaction
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while creating transaction",
            error: error.message,
        });
    }
});

// View user's transactions
// View all transactions
// router.get("/viewalltransactions", async (req, res) => {
//     try {
//         // Fetch all transactions from the database, sorted by the most recent transaction first
//         const transactions = await Transaction.find({}).sort({ transactionDate: -1 });

//         if (!transactions.length) {
//             return res.status(404).json({
//                 message: "No transactions found"
//             });
//         }

//         // Map over transactions and fetch user names for each fromAccountId and toAccountId
//         const transactionWithNames = await Promise.all(transactions.map(async transaction => {
//             // Fetch the fromUser and toUser details using fromAccountId and toAccountId
//             const fromUser = await User.findById(transaction.fromAccountId).select('firstName lastName');
//             const toUser = await User.findById(transaction.toAccountId).select('firstName lastName');

//             return {
//                 userId: transaction.userId,
//                 amount: transaction.amount,
//                 type: transaction.type,
//                 fromAccountId: transaction.fromAccountId,
//                 fromUserName: fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : "Unknown",
//                 toAccountId: transaction.toAccountId,
//                 toUserName: toUser ? `${toUser.firstName} ${toUser.lastName}` : "Unknown",
//                 transactionDate: transaction.transactionDate
//             };
//         }));

//         res.json({
//             message: "All transactions fetched successfully",
//             transactions: transactionWithNames
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Error fetching transactions",
//             error: error.message
//         });
//     }
// });

// View user's transactions

// View user's transactions
// View user's transactions
// View user's transactions
// View user's transactions
// View user's transactions
// View user's transactions
router.get("/viewtransactions",authMiddleware, async (req, res) => {
    try {
        // Get userId from the request body
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        // Fetch transactions where the user is either the sender (debit) or the recipient (credit)
        const transactions = await Transaction.find({
            $or: [
                { fromAccountId: userId }, // debit transactions
                { toAccountId: userId }    // credit transactions
            ]
        }).sort({ transactionDate: -1 }); // Sort by most recent transaction first

        if (!transactions.length) {
            return res.status(404).json({
                message: "No transactions found for this user"
            });
        }

        // Map over transactions and fetch user names for each fromAccountId and toAccountId
        const transactionWithNames = await Promise.all(transactions.map(async transaction => {
            const fromUser = await User.findById(transaction.fromAccountId).select('firstName lastName');
            const toUser = await User.findById(transaction.toAccountId).select('firstName lastName');

            return {
                userId: transaction.userId,
                amount: transaction.amount,
                type: transaction.type,
                fromAccountId: transaction.fromAccountId,
                fromUserName: fromUser ? `${fromUser.firstName} ${fromUser.lastName}` : "Unknown",
                toAccountId: transaction.toAccountId,
                toUserName: toUser ? `${toUser.firstName} ${toUser.lastName}` : "Unknown",
                transactionDate: transaction.transactionDate
            };
        }));

        // Remove duplicates based on the userId
        const uniqueTransactions = Array.from(new Map(transactionWithNames.map(item => [item.transactionDate, item])).values());

        res.json({
            message: "Transactions fetched successfully",
            transactions: uniqueTransactions
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching transactions",
            error: error.message
        });
    }
});

router.post("/test", authMiddleware,(req, res) => {
    res.json({ message: "Test route working!" })
});


module.exports = router;