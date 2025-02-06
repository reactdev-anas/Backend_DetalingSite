// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// POST route to handle email sending
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    console.log("Received data:", req.body); // log incoming data

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Creating transporter to send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Mail options
        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.EMAIL_USER, // Your email address here
            subject: `Message from ${name}`,
            text: message,
            replyTo: email,
        };

        console.log("Sending email with options:", mailOptions); // log mail options

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info); // log success
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error); // log error
        res.status(500).send('Error sending email: ' + error.message); // send detailed error message to client
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
