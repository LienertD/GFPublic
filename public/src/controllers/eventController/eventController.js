/**
 * Created by Jonatan on 4/12/2015.
 */


(function () {
    "use strict";

    var eventController = function ($scope, $location, $sce, $routeParams, eventService, shareService, profileService, googleMapsService) {
        var eventid = $routeParams.param;
        $scope.newEvent = {};
        $scope.hasShared = false;
        var socket = io.connect(window.location.protocol + "//" + location.hostname + ":3001");

        eventService.getEventById(eventid, function(err, event) {
            if(!err) {
                $scope.event = event;
                $scope.event.mood = 50;
                $scope.event.eventid = event.id;
                $scope.event.address1 = splitAddress($scope.event.address, 0);
                $scope.event.address2 = splitAddress($scope.event.address, 1);

                if(!$scope.event.eventimage) {
                    $scope.event.eventimage = "http://student.howest.be/jonatan.michiels/geofeelings/assets/event.png";
                }

                if($scope.event.authorid.length > 0) {
                    profileService.getUser(function(err, user) {
                        if(!err) {
                            $scope.event.userid = user.id;

                            if(user.redirect) {
                                $location.path(user.redirect);
                            } else {
                                if($scope.event.authorid === user.id) {
                                    $scope.event.isAuthor = true;
                                } else {
                                    $scope.event.isAuthor = false;
                                }
                            }
                        } else {
                            throw new ProfileServiceException(err);
                        }
                    });
                } else {
                    $scope.event.isAuthor = false;
                }

                shareService.getSharesByEventId(event.id, function(err, shares) {
                    if(!err) {
                        if(shares.redirect) {
                            $location.path(shares.redirect);
                        } else {
                            if(shares.length > 0) {
                                $scope.changeShares(shares, 100, "All time");
                                googleMapsService.removeMarkers();
                                googleMapsService.showAllMarkers(shares);
                                $scope.sharesforevent = shares;

                                angular.forEach(shares, function(share) {
                                    if(share.user.id === $scope.event.userid) {
                                        $scope.hasShared = true;
                                    }
                                });
                            } else {
                                $scope.noSharesForEvent = "<div>No shares for this event.</div>";
                            }
                        }
                    } else {
                        throw new ShareServiceException(err);
                    }
                });
            } else {
                throw new EventServiceException(err);
            }
        });

        $scope.renderHtml = function(html) {
            return $sce.trustAsHtml(html);
        };

        $scope.postShare = function() {
            $scope.event.time = new Date();
            shareService.postShareAsync($scope.event, function(err, data) {
                if(!err) {
                    if(data.redirect) {
                        $location.path(data.redirect);
                    } else if(data.error) {
                        $scope.error = data.error;
                    } else {
                        socket.emit("sharePosted", data);
                        $scope.event = data;
                    }
                } else {
                    if(err === "ZERO_RESULTS") {
                        $scope.error = "No address found!";
                    } else {
                        $scope.error = "Something went wrong, try again later!";
                    }
                }
            });
        };

        $scope.updateEvent = function() {
            $scope.event.address = makeAddress($scope.event.address1, $scope.event.address2);
            eventService.updateEvent($scope.event, function(err, data) {
                if(!err) {
                    if(data.redirect) {
                        $location.path(data.redirect);
                    } else if(data.error) {
                        $scope.errorEvent = data.error;
                        $scope.$apply();
                    } else {
                        $scope.event = data;
                        $scope.event.address1 = splitAddress($scope.event.address, 0);
                        $scope.event.address2 = splitAddress($scope.event.address, 1);
                        window.alert("Event is successfully updated.");
                    }
                } else {
                    if(err === "ZERO_RESULTS") {
                        $scope.errorEvent = "No address found! Street & Number and Zip & City are required! Make sure there is a space between your input and no komma(,)";
                        $scope.$apply();
                    } else {
                        $scope.errorEvent = "Something went wrong, try again later!";
                        $scope.$apply();
                    }
                }
            });
        };

        $scope.convertMood = function(mood) {
            if(mood > 80) {
                return "excited";
            } else if(mood > 60) {
                return "happy";
            } else if(mood > 40) {
                return "okay";
            } else if (mood > 20) {
                return "sad";
            } else {
                return "depressive";
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

    angular.module("geofeelings").controller("eventController", ["$scope", "$location", "$sce", "$routeParams", "eventService", "shareService", "profileService", "googleMapsService", eventController]);
})();