/**
 * Created by Jonatan on 6/12/2015.
 */

(function () {
    "use strict";

    var adminController = function ($scope, $location, eventService, shareService, profileService) {
        profileService.getUser(function (err, user) {
            if(!err) {
                if(user.redirect) {
                    $location.path(user.redirect);
                } else {
                    if(user.admin) {
                        eventService.getEvents(function (err, data) {
                            if(!err) {
                                if(data.redirect) {
                                    $location.path(data.redirect);
                                } else {
                                    $scope.eventsAdmin = data;
                                }
                            }
                            else {
                                throw new EventServiceException(err);
                            }
                        });

                        shareService.getAllShares(function (err, data) {
                            if(!err) {
                                if(data.redirect) {
                                    $location.path(data.redirect);
                                } else {
                                    $scope.changeShares(data, 100, "All time");
                                    $scope.sharesAdmin = data;
                                }
                            } else {
                                throw new ShareServiceException(err);
                            }
                        });
                    } else {
                        $location.path("/intro");
                    }
                }
            } else {
                throw new ProfileServiceException(err);
            }
        });

        $scope.deleteEvent = function (event) {
            eventService.deleteEvent(event, function(err, data) {
                if(!err) {
                    $scope.eventsAdmin.splice($scope.eventsAdmin.indexOf(event), 1);
                    window.alert(data.message);
                } else {
                    throw new EventServiceException(err);
                }
            });
        };

        $scope.deleteShare = function (share) {
            shareService.deleteShare(share, function(err, data) {
                if(!err) {
                    $scope.sharesAdmin.splice($scope.sharesAdmin.indexOf(share), 1);
                    window.alert(data.message);
                } else {
                    throw new ShareServiceException(err);
                }
            });
        };
    };

    angular.module("geofeelings").controller("adminController", ["$scope", "$location", "eventService", "shareService", "profileService", adminController]);
})();