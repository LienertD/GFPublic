/**
 * Created by Jonatan on 13/12/2015.
 */

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function (passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOGIN
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(function() {
            User.findOne({ 'username' : username }, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, { error : 'Oops! Wrong username.' });
                } else {
                    user.validPassword(password, function (err, isMatch) {
                        if (err) {
                            throw err;
                        }

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, { error : 'Oops! Wrong password.'});
                        }
                    });
                }
            });
        });
    }));

    // REGISTER
    passport.use('register', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(function () {
            if(!req.user) {
                User.findOne({'username': username}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(null, { error : 'Username already taken.'});
                    } else {
                        var newUser = new User();
                        newUser.generateHash(password, function (err, hash) {
                            if (err) {
                                throw err;
                            }

                            newUser.username = username;
                            newUser.password = hash;
                            newUser.email = req.body.email;
                            newUser.admin = false;
                            newUser.chat = true;
                            newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }

                                return done(null, newUser);
                            });
                        });
                    }
                });
            }
        });
    }));
};