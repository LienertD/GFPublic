/**
 * Created by Jonatan on 26/11/2015.
 */

(function () {
    "use strict";

    //var socket = io.connect("http://localhost:3001");
    var socket = io.connect(window.location.protocol + "//" + location.hostname + ":3001");

    var loginController = function ($scope, $http, $location, shareVarsBetweenCtrl, shareService, profileService) {
        $scope.ResetRealtimeMap();
        $scope.changeShares($scope.allShares, 100);

        if (shareVarsBetweenCtrl.getExtraLoginInfo()) {
            $scope.extraLoginInfo = shareVarsBetweenCtrl.getExtraLoginInfo();
        }

        var postUserlessShare = function () {
            var shareData = shareVarsBetweenCtrl.returnUserlessShare();
            profileService.getUser(function (err, user) {
                if (!err) {
                    if (user.redirect) {
                        $location.path(user.redirect);
                    } else {
                        shareData.userid = user.id;

                        shareService.postShareAsync(shareData, function (err, resShareData) {
                            if (!err) {
                                shareVarsBetweenCtrl.setExtraLoginInfo("");
                                shareVarsBetweenCtrl.setProperty(resShareData);
                                $location.path("/intro_shared");
                            }
                            else {
                                throw new ShareServiceException(err);
                            }
                        });
                        shareVarsBetweenCtrl.saveUserlessShare("");
                    }
                } else {
                    throw new ProfileServiceException(err);
                }
            });
        };

        $scope.login = function () {
            $http.post(window.location.protocol + "//" + location.hostname+':8080/auth/login', {
                username: $scope.username,
                password: $scope.password
            }).success(function (data) {
                $scope.error = data.error;

                profileService.getUser(function (err, userData) { //zend je id naar de server om te zeggen dat je er bent en welk socketid je hebt
                    if (!err) {
                        if (userData.redirect) {
                            //userid niet logged in, nog toevoegen dat hij zen id stuurt bij inloggen!
                        } else {
                            socket.emit("loginMessage", userData.id);
                        }
                    } else {
                        throw new ProfileServiceException(err);
                    }
                });

                if (shareVarsBetweenCtrl.returnUserlessShare() !== undefined && shareVarsBetweenCtrl.returnUserlessShare() !== "") //userid heeft willen sharen, maar was niet ingelogd.
                {
                    postUserlessShare();
                }
                else {
                    $location.path(data.redirect);
                }
            });
        };

        $scope.register = function () {
            $http.post(window.location.protocol + "//" + location.hostname+':8080/auth/register', {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email
            }).success(function (data) {
                $scope.error = data.error;
                if (shareVarsBetweenCtrl.returnUserlessShare() !== undefined && shareVarsBetweenCtrl.returnUserlessShare() !== "") //userid heeft willen sharen, maar was niet ingelogd.
                {
                    postUserlessShare();
                }
                else {
                    $location.path(data.redirect);
                }
            });
        };
    };

    angular.module("geofeelings").controller("loginController", ["$scope", "$http", "$location", "shareVarsBetweenCtrl", "shareService", "profileService", loginController]);
})();