const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const API_KEY = process.env.API_KEY;
app.use("/", router);
app.listen(process.env.PORT || 5000, () => console.log("Server Running"));

const contactEmail = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD
    }
});

contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to Send");
    }
});

router.post("/sendmail", (req, res) => {
    const userKey = req.headers.apikey;
    if (userKey != API_KEY) {
        res.status(401);
        console.log("Wrong API KEY: " + userKey);
        res.send("Something went wrong!")
    } else {
        console.log('Sending message');
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const category = req.body.category;
        const species = req.body.species;
        const breed = req.body.breed;
        const petName = req.body.petName;
        const message = req.body.message;
        const mail = {
            from: name,
            to: process.env.USER_EMAIL,
            subject: "Let's Pet Contact Form Message",
            html: `<p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Category: ${category}</p>
        <p>Species: ${species}</p>
        <p>Breed: ${breed}</p>
        <p>Pet Name: ${petName}</p>
        <p>Message: ${message}</p>`
        };
        contactEmail.sendMail(mail, (error) => {
            if (error) {
                res.json({ status: "failed" });
            } else {
                res.json({ status: "sent" });
            }
        });
    }
});