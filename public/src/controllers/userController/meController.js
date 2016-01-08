/**
 * Created by Jonatan on 21/12/2015.
 */

(function () {
    "use strict";

    //var socket = io.connect("http://localhost:3001");
    var socket = io.connect(window.location.protocol + "//" + location.hostname + ":3001");

    var meController = function ($scope, $http, $location, $sce, profileService, shareService, googleMapsService) {
        profileService.getUser(function (err, user) {
            if (!err) {
                if (user.redirect) {
                    $location.path(user.redirect);
                } else {
                    $scope.user = user;
                    if (user.address) {
                        $scope.user.address1 = splitAddress(user.address, 0);
                        $scope.user.address2 = splitAddress(user.address, 1);
                    }

                    if (!user.age) {
                        $scope.user.age = new Date();
                    }

                    shareService.getSharesByUserId(user.id, function (err, shares) {
                        if (!err) {
                            if (shares.redirect) {
                                $location.path(shares.redirect);
                            } else {
                                $scope.changeShares(shares, 100, "All time");
                                googleMapsService.removeMarkers();
                                googleMapsService.showAllMarkers(shares);

                                if (shares.length > 0) {
                                    $scope.sharesforprofile = shares;
                                } else {
                                    $scope.noSharesForUser = "<div>You have no shares yet, go share your feelings <a href='#/intro'>here</a></div>";
                                }
                            }
                        } else {
                            throw new ShareServiceException(err);
                        }
                    });
                }
            } else {
                throw new ProfileServiceException(err);
            }
        });

        $scope.save = function (user) {
            user.address = makeAddress(user.address1, user.address2);
            profileService.saveUser(user, function (err, data) {
                if (!err) {
                    if (data.redirect) {
                        $location.path(data.redirect);
                    } else if (data.error) {
                        $scope.errorMe = data.error;
                        $scope.$apply();
                    } else {
                        $scope.user = data;
                        $scope.user.address1 = splitAddress(data.address, 0);
                        $scope.user.address2 = splitAddress(data.address, 1);
                        window.alert("User is successfully updated.");
                    }
                } else {
                    if (err === "ZERO_RESULTS") {
                        $scope.errorMe = "No address found! Street & Number and Zip & City are required! Make sure ther is a space between your input and no komma(,)";
                        $scope.$apply();
                    } else {
                        $scope.errorMe = "Something went wrong, try again later!";
                        $scope.$apply();
                    }
                }
            });
        };

        $scope.logout = function () {
            socket.emit("logoutMessage", $scope.user.id);
            profileService.logout().then(function (data) {
                $location.path(data);
            });
        };

        $scope.renderHtml = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.getShareInfo = function (share) {
            if (share.event.id) {
                return share.event.eventname;
            } else {
                return share.address;
            }
        };

        $scope.getShareImage = function (share) {
            if (share.event.id) {
                return share.event.eventimage;
            } else {
                return "http://student.howest.be/jonatan.michiels/geofeelings/assets/location.png";
            }
        };

        $scope.showShareOnMap = function(share) {
            googleMapsService.zoomInOnMarker(share.lat, share.lng);
        };

        var splitAddress = function (address, part) {
            var split = address.split(",");
            return split[part];
        };

        var makeAddress = function (address1, address2) {
            return address1 + "," + address2;
        };
    };

    angular.module("geofeelings").controller("meController", ["$scope", "$http", "$location", "$sce", "profileService", "shareService", "googleMapsService", meController]);
})();