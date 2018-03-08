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
    User.getAuthenticated(req.body.username, req.body.password, function(error, user, reason) {
        if(reason) {
            switch(reason) {
                case(User.failedLogin.NOT_FOUND): console.log("User not found: " + req.body.username); break;
                case(User.failedLogin.PASSWORD_INCORRECT): console.log("Password incorrect for user: " + req.body.username); break;
                case(User.failedLogin.MAX_ATTEMPTS): console.log("User used max attempts: " + req.body.username); break;
            }
            res.status(400).send("failed");
            return;
        }

        if(error) {
            console.log(error);
            res.status(500).send("failed");
            return;
        }

        // create a session here I guess
        console.log("User auth success: " + user.username);
        res.send("ok");
    });
});

// create user
app.post('/api/user', (req, res) => {
    User.findOne({username: req.body.username}, function(error, user) {
        if(error) {
            console.log(error);
            res.status(500).send("failed");
            return;
        }
        if(user) { 
            console.log("User already exists: " + user.username);
            res.status(400).send("failed"); 
            return; 
        }
        let u = new User({
            username: req.body.username,
            password: req.body.password
        });
        u.save().then(u2 => { 
            res.send(u2._id);
            // should create session here too
        }).catch(error => console.log(error));
    });
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});