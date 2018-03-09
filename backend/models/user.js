/*
    Thanks to Jeremy Martin, for the blog posts on secure
    user authentication with mongoose.
    
    http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
    http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
*/

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 10;
const LOCK_TIME = 60 * 60 * 1000; // 1 hour

let userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
});

userSchema.pre("save", function(next) {
    let user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
        if(error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, function(error, hash) {
            if(error) {
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.virtual("isLocked").get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
})

userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, match) {
        if(error) {
            return callback(error);
        }
        callback(null, match);
    });
};

userSchema.methods.incrementAttempts = function(callback) {
    if(this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, callback);
    }

    let updates = { $inc: { loginAttempts: 1 } };

    if(this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }

    return this.update(updates, callback);
};

userSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

userSchema.statics.getAuthenticated = function(username, password, callback) {
    let reasons = userSchema.statics.failedLogin;
    this.findOne({ username: username }, function (error, user) {
        if(error) {
            return callback(error);
        }

        if(!user) {
            return callback(null, null, reasons.NOT_FOUND);
        }

        if(user.isLocked) {
            return user.incrementAttempts(function(error) {
                if(error) {
                    return callback(error);
                }
                return callback(null, null, reasons.MAX_ATTEMPTS);
            })
        }

        user.comparePassword(password, function(error, match) {
            if(error) {
                return callback(error);
            }
            if(match) {
                if(!user.loginAttempts && !user.lockUntil) {
                    return callback(null, user);
                }
                let updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(error) {
                    if(error) {
                        return callback(error);
                    }
                    return callback(null, user);
                });
            }

            user.incrementAttempts(function(error) {
                if(error) {
                    return callback(error);
                }
                return callback(null, null, reasons.PASSWORD_INCORRECT);
            })
        });
    });
}

module.exports = mongoose.model("User", userSchema);