/**
 * Created by Jonatan on 1/12/2015.
 */

(function () {
    "use strict";

    var userController = function ($scope, $location, userService, shareService, $routeParams, googleMapsService) {

        $scope.init = function () {
            var userid = $routeParams.param;
            userService.searchUserFromId(userid).then(userFoundWithId);

            shareService.getSharesByUserId(userid, function (err, shares) {
                if (!err) {
                    if (shares.redirect) {
                        $location.path(shares.redirect);
                    } else {
                        $scope.changeShares(shares, 100, "All time");
                        googleMapsService.removeMarkers();
                        googleMapsService.showAllMarkers(shares);

                        if (shares.length > 0) {
                            $scope.shareFoundWithUserId = shares;
                        } else {
                            $scope.shareFoundWithUserId = "<div>You have no shares yet, go share one <a href='#/intro'>here</a></div>";
                        }
                    }
                } else {
                    console.log("> error in shareService: " + err);
                }
            });
        };

        var userFoundWithId = function (res) {
            $scope.userfoundwithid = res;
        };

        var giveFeelingsImageArrayNumber = function (share) {
            if (share.mood > 80) {
                return 4;
            }
            else {
                return Math.round(share.mood / 20);
            }
        };

        $scope.getShareImage = function (share) {
            if (share.event.id) {
                return share.event.eventimage;
            } else {
                return "http://student.howest.be/jonatan.michiels/geofeelings/assets/location.png";
            }
        };

        $scope.getShareInfo = function (share) {
            if (share.event.id) {
                return share.event.eventname;
            } else {
                return share.address;
            }
        };

        $scope.showShareOnMap = function (share) {
            googleMapsService.zoomInOnMarker(share.lat, share.lng);
        };
    };

    angular.module("geofeelings").controller("userController", ["$scope", "$location", "userService", "shareService", "$routeParams", "googleMapsService", userController]);
})
();