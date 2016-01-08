/**
 * Created by Jonatan on 27/12/2015.
 */

var profileService = function ($http, googleMapsService) {
    "use strict";
    // private

    //public
    return {
        getUser: function (cb) {
            $http.get("/auth/user").success(function (data) {
                if (data.redirect) {
                    cb(null, data);
                } else {
                    cb(null, new GfUser(data._id, data.username, data.email, data.userimage, new Date(data.age), data.lat, data.lng, data.address, data.chat, data.admin));
                }
            }).error(function (error) {
                cb(error, null);
            });
        },

        saveUser: function (user, cb) {
            googleMapsService.convertAdressToCoordinates(user.address, function (err, coord) {
                if (!err) {
                    user.lat = coord.lat();
                    user.lng = coord.lng();

                    $http.put("/api/user/" + user.id, user).success(function (data) {
                        if (data.redirect) {
                            cb(null, data);
                        } else {
                            cb(null, new GfUser(data._id, data.username, data.email, data.userimage, new Date(data.age), data.lat, data.lng, data.address, data.chat, data.admin));
                        }
                    }).error(function (error) {
                        cb(error, null);
                    });
                } else {
                    cb(err, null);
                }
            });
        },

        logout: function () {
            return $http.get("/auth/logout").then(function (data) {

                return data;
            });
        }
    };
};

angular.module("geofeelings").factory("profileService", ["$http", "googleMapsService", profileService]);