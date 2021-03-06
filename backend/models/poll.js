const mongoose = require("mongoose");
const hashids = new (require('hashids'))(process.env.HASH_SALT);
const Schema = mongoose.Schema;

let voteSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, index: true },
    ipAddress: { type: String },
    choice: { type: Schema.Types.ObjectId, required: true }
});

voteSchema.pre('validate', function(next) {
    if(!this.owner && !this.ipAddress) {
        next(new Error("Must have either ipAddress or owner set"));
        return;
    }
    next();
});

let choiceSchema = new Schema({
    name: { type: String, required: true },
    voteSum: { type: Number, default: 0 }
});

let pollSchema = new Schema({
    question: { type: String, required: true },
    choices: { 
        type: [choiceSchema], 
        required: true,
        validate: {
            validator: function(a) {
                return a.length > 1;
            },
            message: "Must have two or more choices."
        } 
    },
    votes: { type: [voteSchema] },
    owner: { type: Schema.Types.ObjectId, required: true, index: true },
    ownerName: { type: String, required: true },
    modifiedDate: { type: Date },
    totalVotes: { type: Number, default: 0 }
});

pollSchema.pre('save', function(next) {
    let poll = this;
    if(poll.votes && poll.votes.length > 0) {
        poll.choices.forEach(function(choice) {
            choice.voteSum = poll.votes.filter(vote => vote.choice == choice.id).length;
        });
        poll.votes.forEach(function(vote) {
            voteChoice = poll.choices.find(choice => choice.id == vote.choice);
            if(!voteChoice) {
                vote.remove();
            }
        });
        poll.totalVotes = poll.votes.length;
    }
    this.modifiedDate = Date.now();
    next();
});

pollSchema.methods.frontendFormatted = function(user_id = null) {
    let response = {
        id: hashids.encodeHex(this.id),
        question: this.question,
        choices: this.choices,
        totalVotes: this.totalVotes,
        owner: {
            id: hashids.encodeHex(this.owner),
            name: this.ownerName,
        },
        modifiedDate: this.modifiedDate
    };
    if(user_id) {
        let hasVoted = this.votes.find(vote => vote.owner == user_id);
        if(hasVoted) {
            response.hasVoted = true;
        } else {
            response.hasVoted = false;
        }
    }
    return response;
}

module.exports = mongoose.model("Poll", pollSchema);