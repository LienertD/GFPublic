/**
 * Created by Jonatan on 1/12/2015.
 */

(function () {
    "use strict";

    var introController = function ($scope, shareService, $http, $location, profileService, shareVarsBetweenCtrl, googleMapsService) {

        //var socket = io.connect("http://localhost:3001");
        var socket = io.connect(window.location.protocol + "//" + location.hostname + ":3001");

        //SMILEY TEKENEN
        $scope.sliderValue = 50;
        $scope.moodWord = null;
        var c = document.getElementById("smileyCanvas");
        var ctx = c.getContext("2d");

        var sadRGB = [152, 30, 30];
        var happyRGB = [70, 161, 73];

        //telkens slidervalue verandert gezichtje tekenen
        $scope.$watch("sliderValue", function () {

            ctx.clearRect(0, 0, c.width, c.height); //canvas clearen voor nieuw frame

            var mood = $scope.sliderValue;
            giveMoodWord();
            //offset positie mond
            var offsetX = c.width / 5;
            var offSetY = c.width / 2.14 + (mood / (c.width / 6));

            //variabelen voor beziercurve (= mond)
            var SPx = offsetX;
            var SPy = offSetY + c.width / 3 - (mood * (c.width / 376.66));
            var H1x = offsetX;
            var H1y = offSetY + (mood * (c.width / 250));
            var H2x = offsetX + ((c.width / 300) * 180);
            var H2y = offSetY + (mood * (c.width / 250));
            var EPx = offsetX + (c.width / 1.666);
            var EPy = offSetY + (c.width / 3) - (mood * (c.width / 376.66));

            //hoofd
            ctx.lineWidth = c.width / 60;
            ctx.beginPath();
            ctx.arc((c.width / 2), (c.width / 2), (c.width / 2.07), 0, 2 * Math.PI);
            ctx.fillStyle = "rgb(" + moodColor(0) + "," + moodColor(1) + "," + moodColor(2) + ")";
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.stroke();

            //mond

            ctx.lineWidth = c.width / 30;
            ctx.beginPath();
            ctx.moveTo(SPx, SPy);
            ctx.bezierCurveTo(H1x, H1y, H2x, H2y, EPx, EPy);
            //ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.lineCap = "round";

            //oog links

            ctx.lineWidth = c.width / 60;
            ctx.beginPath();
            ctx.arc(c.width / 3, c.width / 3, c.width / 15, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.stroke();

            //oog rechts
            ctx.beginPath();
            ctx.arc(c.width / 3 * 2, c.width / 3, c.width / 15, 0, 2 * Math.PI);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.stroke();
        });

        var moodColor = function (c) {
            //c: R = 0, G = 1, B = 2

            if (sadRGB[c] > happyRGB[c]) {
                return Math.round(sadRGB[c] - ((sadRGB[c] - happyRGB[c]) * ($scope.sliderValue / 100)));
            }
            else {
                return Math.round(sadRGB[c] + ((happyRGB[c] - sadRGB[c]) * ($scope.sliderValue / 100)));
            }

        };

        var moodwords = ["horrible", "really bad", "bad", "okay", "good", "really good", "excellent"];

        var giveMoodWord = function () {
            /*if ($scope.sliderValue < 5) {
                $scope.moodWord = moodwords[0];
            }
            else if ($scope.sliderValue < 25) {
                $scope.moodWord = moodwords[1];
            }
            else if ($scope.sliderValue < 40) {
                $scope.moodWord = moodwords[2];
            }
            else if ($scope.sliderValue < 60) {
                $scope.moodWord = moodwords[3];
            }
            else if ($scope.sliderValue < 75) {
                $scope.moodWord = moodwords[4];
            }
            else if ($scope.sliderValue < 95) {
                $scope.moodWord = moodwords[5];
            }
            else {
                $scope.moodWord = moodwords[6];
            }*/

            if($scope.sliderValue > 80) {
                $scope.moodWord = "excited";
            } else if($scope.sliderValue > 60) {
                $scope.moodWord = "happy";
            } else if($scope.sliderValue > 40) {
                $scope.moodWord = "okay";
            } else if ($scope.sliderValue > 20) {
                $scope.moodWord = "sad";
            } else {
                $scope.moodWord = "depressive";
            }
        };

        $http.get('/auth/user').success(function (data) {
            $scope.user = data;
        });
        $scope.sharePosted = false;

        $scope.postShare = function () {

            $scope.sharePosted = true; //zorgt ervoor dat spinnertje begint de draaien

            profileService.getUser(function (err, userData) {
                if (!err) {
                    if (userData.redirect) { //user is nog niet ingelogd bij het sharen
                        navigator.geolocation.getCurrentPosition(function (position) {
                            googleMapsService.convertCoordinatesToAdress(position.coords.latitude, position.coords.longitude, function (err, address) {
                                if (!err) {

                                    var shareAddress;
                                    if (err) {
                                        shareAddress = "";
                                    }
                                    else {
                                        shareAddress = address;
                                    }

                                    var userlessShareData = {
                                        "userid": 0,
                                        "eventid": null,
                                        "time": new Date().toISOString(),
                                        "mood": $scope.sliderValue,
                                        "lat": position.coords.latitude,
                                        "lng": position.coords.longitude,
                                        "address": shareAddress,
                                        "reason": $scope.moodReason
                                    };
                                    shareVarsBetweenCtrl.saveUserlessShare(userlessShareData);
                                }
                                else {
                                    console.log("erroke: " + err);
                                }
                            });
                        });
                        shareVarsBetweenCtrl.setExtraLoginInfo("Please login before posting this share.");
                        $location.path(userData.redirect);

                    } else {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            googleMapsService.convertCoordinatesToAdress(position.coords.latitude, position.coords.longitude, function (err, address) {
                                var shareAddress;
                                if (err) {
                                    shareAddress = "";
                                }
                                else {
                                    shareAddress = address;
                                }

                                var shareData = {
                                    "userid": userData.id,
                                    "eventid": null,
                                    "time": new Date().toISOString(),
                                    "mood": $scope.sliderValue,
                                    "lat": position.coords.latitude,
                                    "lng": position.coords.longitude,
                                    "address": shareAddress,
                                    "reason": $scope.moodReason
                                };

                                shareService.postShareAsync(shareData, function (err, resShareData) {
                                    if (!err) {
                                        socket.emit("sharePosted", resShareData); //uitzenden naar iedereen
                                        shareVarsBetweenCtrl.setProperty(resShareData);
                                        $location.path("/intro_shared");
                                    }
                                    else {
                                        console.log(err);
                                    }
                                });

                            });
                        });
                    }
                } else {
                    console.log("error while getting user: " + err);
                }
            });
        };
    };

    angular.module("geofeelings").controller("introController", ["$scope", "shareService", "$http", "$location", "profileService", "shareVarsBetweenCtrl", "googleMapsService", introController]);
})();