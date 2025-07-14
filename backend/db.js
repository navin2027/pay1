const mongoose = require('mongoose');
mongoose.connect("database-url");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true,
        trim : true,
        lowercase : true,
        minLength : 3,
        maxLength : 30
    },
    password : {
        type : String,
        required : true,
        minLength:3,
        maxLength:30
    },
    firstName : {
        type : String,
        required : true,
        minLength: 3,
        maxLength : 30,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        minLength: 3,
        maxLength : 30,
        trim : true
    }
})

const User = mongoose.model("User",userSchema);

const accountSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,    //Reference to the User model
        ref : "User",
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
});

const Account = mongoose.model("Account",accountSchema);

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   // Reference to the User model
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,  // 'credit' or 'debit'
        enum: ['credit', 'debit'],
        required: true
    },
    fromAccountId: {
        type: mongoose.Schema.Types.ObjectId,   // Reference to the Account model (sender)
        ref: 'Account',
        required: true
    },
    toAccountId: {
        type: mongoose.Schema.Types.ObjectId,   // Reference to the Account model (receiver)
        ref: 'Account',
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now   // This will store both date and time
    }
});

// Creating the Transaction model
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = {
    User,
    Account,
    Transaction
}
