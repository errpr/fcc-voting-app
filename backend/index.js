require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');
const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DB}`;
mongoose.connect(dbUrl).catch(error => console.log(error));

const User = require("./models/user.js");
const Poll = require("./models/poll.js");

app = express();
app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// login with previous session
app.get('/api/login', (req, res) => {
    if(req.session && req.session.user) {
        User.findById(req.session.user, function(error, user) {
            if(error) {
                console.log(error);
                res.status(400).send("failed");
                return;
            }

            if(user) {
                res.json({
                    name: user.username,
                    id: user.id
                });
                return;
            }

            console.log("No user found matching session");
            res.status(400).send("failed");
        });
    } else {
        console.log("No session");
        res.status(400).send("failed");
    }
});

// login and get new session
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

        req.session.user = user.id;
        req.session.cookie.username = user.username;
        console.log("User auth success: " + user.username);
        res.json({
            name: user.username,
            id: user.id
        });
    });
});

// log out
app.delete("/api/login", (req, res) => {
    req.session.destroy(function(error) {
        if(error) {
            res.status(400).send("Could not destroy session");
        }
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
            req.session.user = u2.id;
            res.json({
                name: u2.username,
                id: u2.id,
            });
        }).catch(error => console.log(error));
    });
});

app.get("/api/poll/:id", (req, res) => {
    Poll.findById(req.params.id, function(error, poll) {
        if(error) {
            console.log(error);
        }
        console.log(poll);
        res.send("ok");
    });
});

app.post("/api/poll", (req, res) => {
    console.log(req.body.choices);
    Poll.create({
        choices: req.body.choices,
        votes: [],
        owner: req.session.user
    }, function(error, poll) {
        if(error) {
            console.log(error);
        }
        console.log(poll);
        res.send("ok");
    });
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + '/assets/index.html');
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});