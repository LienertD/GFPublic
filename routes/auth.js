/**
 * Created by Jonatan on 13/12/2015.
 */

var express = require('express');
var passport = require('passport');
var router = express.Router();

// SET HEADERS

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

// LOGOUT

router.route('/logout')
    .get(function (req, res) {
        req.logout();
        res.json({redirect: '/logout'});
    });

// LOGIN

router.route('/login')
    .post(function (req, res) {
        if (!req.body.username || !req.body.password) {
            return res.json({error: 'All fields are required'});
        }

        passport.authenticate('login', function (err, user) {
            if (err) {
                return res.json(err);
            }

            if (user.error) {
                return res.json({error: user.error});
            }

            req.logIn(user, function (err) {
                if (err) {
                    return res.json(err);
                }

                if (user.admin) {
                    return res.json({redirect: '/admin'});
                }

                return res.json({redirect: '/me'});
            });
        })(req, res);
    });

// REGISTER

router.route('/register')
    .post(function (req, res) {
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.json({error: 'All fields are required'});
        }

        passport.authenticate('register', function (err, user) {
            if (err) {
                return res.json(err);
            }

            if (user.error) {
                return res.json({error: user.error});
            }

            req.logIn(user, function (err) {
                if (err) {
                    return res.json(err);
                }

                return res.json({redirect: '/me'});
            });
        })(req, res);
    });

// MANAGE USER

router.route('/user')
    .get(isLoggedIn, function (req, res) {
        return res.json(req.user);
    });

// CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.json({redirect: '/login'});
    } else {
        next();
    }
}

module.exports = router;