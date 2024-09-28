const express = require("express");
const { Account } = require("../db");
const authMiddleware = require("../middleware");
const {default: mongoose} = require("mongoose")

const router = express.Router();

router.get("/balance",authMiddleware,async(req,res) => {
    // const account = await Account.findOne({
    //     userId : req.userId
    // });
    // res.json({balance : account.balance})
    try {
        // Convert the userId to a mongoose ObjectId using 'new'
        const userId = new mongoose.Types.ObjectId(req.userId);

        // Find the account using the ObjectId
        const account = await Account.findOne({ userId });

        // Handle the case where no account is found
        if (!account) {
            // Ensure the response is only sent once
            return res.status(404).json({ message: "Account not found" });
        }

        // Respond with the account balance (send response only once)
        return res.json({ balance: account.balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        // Ensure the error response is sent only once
        return res.status(500).json({ message: "Server error" });
    }
})

router.post("/transfer",authMiddleware,async(req,res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount,to} = req.body;

    //Fetching the accounts within the Transaction
    const account = await Account.findOne({userId :  req.userId}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({message : "Insufficient balance"});
    }

    const toAccount = await Account.findOne({userId : to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({message : "User not found"});
    }

    await Account.updateOne({userId : req.userId},{$inc : {balance : -amount}}).session(session);
    await Account.updateOne({userId : to},{$inc : {balance : amount}}).session(session)

    await session.commitTransaction();
    await session.endSession();
    res.json({message : "Transfer successful"});
})

module.exports = router;