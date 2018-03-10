const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let voteSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, index: { unique: true} },
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
    voteSum: { type: Number }
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
    modifiedDate: { type: Date }
});

pollSchema.pre('save', function(next) {
    let poll = this;
    if(poll.votes && poll.votes.length > 0) {
        poll.choices.forEach(function(choice) {
            choice.voteSum = poll.votes.filter(vote => vote.choice == choice.id).length;
        });
    }
    this.modifiedDate = Date.now();
    next();
});

module.exports = mongoose.model("Poll", pollSchema);