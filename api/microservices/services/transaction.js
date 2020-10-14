const express = require("express");
const { Account, Transaction } = require("../db.js");
const server = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");

////////////////
// MIDDLEWARES /
////////////////
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev")); // Intializing console logger middleware for HTTP requests.

///////////////
// ROUTES /GET/
///////////////
// Route for getting all transactions
server.get("/transactions", (req, res, next) => {
    Transaction.findAll({ include: [{ model: Account }] })
        .then((transactions) => { res.send({ success: true, message: "transactions list: ", transactions }) })
        .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
});
// Route for getting user income
server.get("/transactions/income/:userId", (req, res, next) => {
    Account.findOne({ where: { userId: req.params.userId } })
        .then((account) => {
            Transaction.findAll({ where: { receiver: account.id } })
                .then((transactions) => {
                    let sum = 0;
                    for (let i = 0; i < transactions.length; i++)
                        if (transactions[i].state === 'complete') sum += transactions[i].amount
                    res.send({ success: true, message: "Your incomes are: ", sum })
                })
                .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
        })
        .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
});
// Route for getting user outcome
server.get("/transactions/outcome/:userId", (req, res, next) => {
    Account.findOne({ where: { userId: req.params.userId } })
        .then((account) => {
            Transaction.findAll({ where: { sender: account.id } })
                .then((transactions) => {
                    for (let i = 0, sum = 0; i < transactions.length; i++)
                        if (transactions[i].state === 'complete') sum += transactions[i].amount
                    res.send({ success: true, message: "Your outcomes are: ", sum })
                })
                .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
        })
        .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
});

////////////////
// ROUTES /POST/
////////////////

// Route for posting a 'created' transaction
server.post("/transactions/:sender/to/:receiver", (req, res, next) => {
    const { amount, message } = req.body;
    Promise.all([
        Account.findByPk(req.params.sender), // Search for the account that sends the money
        Account.findByPk(req.params.receiver) // Search for the account that receives the money
    ])
        .then(acc => {
            (Number(acc[0].balance) >= amount) ? // It verifies that has sufficient funds
                Promise.all([
                    acc[0].update({ balance: Number(acc[0].balance) - amount }),  // extract the money from sender account
                    acc[1].update({ balance: Number(acc[1].balance) + amount })   // deposit the money into receiver account
                ]).then((accUpd) => {
                    Transaction.create({ sender: req.params.sender, receiver: req.params.receiver, amount, message, state: 'complete' })
                        .then(transactionCreated => { res.send({ success: true, message: "Transaction Completed: ", transactionCreated, sender: accUpd[0], receiver: accUpd[1] }) })
                        .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
                }) :
                res.status(400).send({ success: false, message: "insufficient funds" })
        });
});

/////////////////
// ROUTES /PATCH/
/////////////////

// Route for changing the state of a transaction
server.patch("/transactions/:id/inProcess", (req, res, next) => {
    Transaction.findByPk(req.params.id) // let's find if the transaction exists
        .then(transaction => {
            Account.findByPk(transaction.sender) // Search for the account that sends the money
                .then(account => {
                    res.send({ success: true, message: "response: ", account })

                        (Number(account.balance) >= transaction.amount) ? // It verifies that has sufficient funds
                        account.update({ balance: Number(account.balance) - transaction.amount })  // takes away the money from his account
                            .then((accUpdated) => {
                                transaction.update({ state: "inProcess" })
                                    .then(transaction => res.send({ success: true, message: "Transaction inProcess : ", transaction, accUpdated }))
                            }) :
                        res.status(400).send({ success: false, message: "insufficient funds" })
                })
        })
        .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }));
});
// Route for patching the amount of money of an account a.k.a 'illicit enrichment'
server.patch("/transactions/enrich/:userId", (req, res, next) => {
    Account.findOne({ where: { userId: req.params.userId } })
        .then(account => {
            account ?
                account.update({ balance: Number(account.balance) + req.body.amount })
                    .then((enrichedAccount) => res.send({ success: true, message: "Enriched Account: ", enrichedAccount }))
                    .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err })) :
                res.send({ success: false, message: "User not found" })
        })
        .catch((err) => res.status(400).send({ success: false, message: "Something went wrong: ", err }))
});

server.listen(3003, () => {
    console.log("Transaction service running on 3003");
});

module.exports = server;