require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const hashids = new (require('hashids'))(process.env.HASH_SALT);
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
                    id: hashids.encodeHex(user.id)
                });
                return;
            }

            console.log("No user found matching session");
            res.status(403).send();
        });
    } else {
        console.log("No session");
        res.status(403).send();
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
            id: hashids.encodeHex(user.id)
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
app.post('/api/users', (req, res) => {
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
                id: hashids.encodeHex(u2.id),
            });
        }).catch(error => console.log(error));
    });
});

// get all polls created by specific user
app.get("/api/users/:id/polls", (req, res) => {
    let user_id = hashids.decodeHex(req.params.id);
    Poll.find({owner: user_id})
        .sort({ modifiedDate: -1 })
        .select({question: 1, choices: 1, totalVotes: 1})
        .then(polls => {
            console.log(polls[0].question);
            res.json(polls.map(poll => poll.frontendFormatted()));
        }).catch(error => console.log(error));
});

// get polls for the front page
app.get("/api/polls/hot", (req, res) => {
    Poll.find({})
        .sort({ modifiedDate: -1 })
        .limit(10)
        .select({question: 1, choices: 1, owner: 1, totalVotes: 1})
        .then(polls => {
            res.json(polls.map(poll => poll.frontendFormatted()));
        }).catch(error => console.log(error));
})

// get specific poll
app.get("/api/polls/:id", (req, res) => {
    let poll_id = hashids.decodeHex(req.params.id);
    Poll.findById(poll_id, function(error, poll) {
        if(error) {
            console.log(error);
            res.status(400).send("failed");
        }
        console.log(poll.question);
        res.json(poll.frontendFormatted());
    });
});

// vote for a choice
app.post("/api/polls/:id/vote/:choice_id", (req, res) => {
    let poll_id = hashids.decodeHex(req.params.id);
    let choice_id = req.params.choice_id;
    console.log(req.session.user);
    Poll.findById(poll_id, function(error, poll) {
        if(error) {
            console.log(error);
        }
        console.log(poll);
        let alreadyVoted;
        if(req.session.user) {
            alreadyVoted = poll.votes.find(vote => vote.owner == req.session.user);
        } else {
            alreadyVoted = poll.votes.find(vote => vote.ipAddress == req.ip);
        }
        if(alreadyVoted) {
            console.log("Already voted! updating choice");
            poll.votes.id(alreadyVoted.id).choice = choice_id;
            poll.save(function(error) {
                if(error) {
                    console.log(error);
                }
                res.json(poll.frontendFormatted());
            });
        } else {
            poll.votes.push({
                owner: req.session.user,
                ipAddress: req.ip,
                choice: choice_id
            });
            poll.save(function(error) {
                if(error) {
                    console.log(error);
                }
                res.json(poll.frontendFormatted());
            });
        }
    });
});

// create new poll
app.post("/api/polls", (req, res) => {
    console.log(req.body.choices);
    Poll.create({
        question: req.body.question,
        choices: req.body.choices,
        owner: req.session.user,
        ownerName: req.session.user.name,
    }, function(error, poll) {
        if(error) {
            console.log(error);
            res.status(400).send("failed");
        }
        console.log(poll);
        res.json(poll.frontendFormatted());
    });
});

// don't send html to bad api requests
app.all("/api/*", (req, res) => {
    res.status(404).send("failed");
});

// send react app
app.get("*", (req, res) => {
    res.sendFile(__dirname + '/assets/index.html');
});

const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});