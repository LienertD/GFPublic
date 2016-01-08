/**
 * Created by Jonatan on 15/12/2015.
 */

var express = require('express');
var router = express.Router();

var User = require("../models/user.js");
var Share = require('../models/share.js');
var Event = require('../models/event.js');

// SET HEADERS

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// USERS

router.route('/user')
    .get(function (req, res) {
        if (req.user) {
            User.find(function (err, users) {
                if (err) {
                    res.send(err);
                }

                res.json(users);
                res.end();
            });
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

router.route('/user/:id')
    .get(function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                res.send(err);
                res.end();
            } else {
                res.json(user);
                res.end();
            }
        });
    })

    .put(function (req, res) {
        if (req.user) {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    res.send(err);
                    res.end();
                }

                if (req.body.username && req.body.email) {
                    user.username = req.body.username;
                    user.email = req.body.email;
                    user.userimage = "http://student.howest.be/jonatan.michiels/geofeelings/assets/user.png";
                    user.age = req.body.age;
                    user.lat = req.body.lat;
                    user.address = req.body.address;
                    user.lng = req.body.lng;
                    user.chat = req.body.chat;

                    user.save(function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json(user);
                            res.end();
                        }
                    });
                } else {
                    res.json({error: "username must be unique and not empty."});
                    res.end();
                }
            })
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

// SHARES

router.route('/share')
    .get(function (req, res) {
        Share.find(function (err, shares) {
            if (err) {
                res.send(err);
                res.end();
            } else {
                res.json(shares);
                res.end();
            }
        });
    })

    .post(function (req, res) {
        if (req.user) {
            if (req.body.userid && req.body.time && req.body.mood && req.body.lat && req.body.lng && req.body.address) {
                var newShare = new Share();
                newShare.userid = req.body.userid;
                newShare.eventid = req.body.eventid;
                newShare.time = req.body.time;
                newShare.mood = req.body.mood;
                newShare.lat = req.body.lat;
                newShare.lng = req.body.lng;
                newShare.address = req.body.address;
                newShare.reason = req.body.reason;

                newShare.save(function (err) {
                    if (err) {
                        res.send(err);
                        res.end();
                    } else {
                        res.json({share: newShare});
                        res.end();
                    }
                });
            } else {
                res.json({error: "All fields are required except reason."});
                res.end();
            }
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

router.route('/share/user/:userid')
    .get(function (req, res) {
        if (req.user) {
            Share.find({userid: req.params.userid}, function (err, shares) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    res.json(shares);
                    res.end();
                }
            });
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

router.route('/share/event/:eventid')
    .get(function (req, res) {
        if (req.user) {
            Share.find({eventid: req.params.eventid}, function (err, shares) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    res.json(shares);
                    res.end();
                }
            });
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

router.route('/share/:id')
    .delete(function (req, res) {
        if (req.user.admin) {
            Share.findByIdAndRemove(req.params.id, function (err, share) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    res.json({message: "Share with id " + share._id + " is deleted."});
                    res.end();
                }
            });
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

// EVENTS

router.route('/event')
    .get(function (req, res) {
        if (req.user) {
            Event.find(function (err, events) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    res.json(events);
                    res.end();
                }
            });
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    })

    .post(function (req, res) {
        if (req.user) {
            if (req.body.eventname && req.body.authorid && req.body.from && req.body.until && req.body.lat && req.body.lng && req.body.address) {
                var newEvent = new Event();
                newEvent.eventname = req.body.eventname;
                newEvent.eventimage = "http://student.howest.be/jonatan.michiels/geofeelings/assets/event.png";
                newEvent.authorid = req.body.authorid;
                newEvent.from = req.body.from;
                newEvent.until = req.body.until;
                newEvent.lat = req.body.lat;
                newEvent.lng = req.body.lng;
                newEvent.address = req.body.address;

                newEvent.save(function (err) {
                    if (err) {
                        res.send(err);
                        res.end();
                    } else {
                        res.json({event: newEvent});
                        res.end();
                    }
                });
            } else {
                res.json({error: "All fields are required except eventimage."});
                res.end();
            }

        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

router.route('/event/:id')
    .get(function (req, res) {
        Event.findById(req.params.id, function (err, event) {
            if (err) {
                res.send(err);
                res.end();
            } else {
                res.json(event);
                res.end();
            }
        });
    })

    .put(function (req, res) {
        if (req.user) {
            Event.findById(req.params.id, function (err, event) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    if (req.body.eventname && req.body.authorid && req.body.from && req.body.until && req.body.lat && req.body.lng && req.body.address) {
                        event.eventname = req.body.eventname;
                        event.eventimage = "http://student.howest.be/jonatan.michiels/geofeelings/assets/event.png";
                        event.authorid = req.body.authorid;
                        event.from = req.body.from;
                        event.until = req.body.until;
                        event.lat = req.body.lat;
                        event.lng = req.body.lng;
                        event.address = req.body.address;

                        event.save(function (err) {
                            if (err) {
                                res.send(err);
                                res.end();
                            } else {
                                res.json(event);
                                res.end();
                            }
                        });
                    } else {
                        res.json({error: "All fields are required except eventimage."});
                        res.end();
                    }
                }
            })
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    })

    .delete(function (req, res) {
        if (req.user.admin) {
            Event.findByIdAndRemove(req.params.id, function (err, event) {
                if (err) {
                    res.send(err);
                    res.end();
                } else {
                    res.json({message: "Event with id " + event._id + " is deleted."});
                    res.end();
                }
            });
        } else {
            res.json({redirect: '/login'});
            res.end();
        }
    });

module.exports = router;