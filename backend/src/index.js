require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`;
mongoose.connect(dbUrl).catch(error => console.log(error));

const User = require("./user.js");

app = express();
app.use(express.static('assets'));
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    console.log(req.body);
    res.send("ok");
});

// create user
app.post('/api/user', (req, res) => {
    console.log(req.body);
    let u = new User({
        username: 'errpr',
        password: 'asdf'
    });
    console.log(u);
    res.send("ok");
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});