(function () {
    "use strict";

    var userService = function ($http) {

        var getAllUsers = function (cb) {
            $http.get("/api/user").success(function (data) {
                if (data.redirect) {
                    cb(null, data);
                } else {

                var arSearchResults = [];
                    angular.forEach(data, function (searchR) {
                        var newSR = new SearchResult(searchR.username, searchR.email, searchR._id,"user");
                        arSearchResults.push(newSR);
                    });
                    cb(null, arSearchResults);
                }
            }).error(function (error) {
                cb(error, null);
            });
        };


        var searchUserFromId = function (searchString) {
            var url = window.location.protocol + "//" + location.hostname+':3000/api/user/' + searchString;
            return $http.get(url).then(function (response) {
                return new GfUser(
                    response.data._id,
                    response.data.username,
                    response.data.email,
                    response.data.userimage,
                    response.data.age,
                    response.data.lat,
                    response.data.lng,
                    response.data.address,
                    response.data.chat,
                    response.data.admin
                );

            });
        };

        return {
            getAllUsers: getAllUsers,
            searchUserFromId: searchUserFromId,
            getUserByIdForShare: function(userid, cb) {
                $http.get("/api/user/" + userid).success(function(data) {
                    cb(null, new GfUser(data._id, data.username, null, data.userimage, null, null, null, null, null, null));
                }).error(function (error) {
                    cb(error, null);
                });
            }
        };
    };
    angular.module("geofeelings").factory("userService", ["$http", userService]);
})();