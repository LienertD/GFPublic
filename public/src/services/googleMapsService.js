/**
 * Created by Jonatan on 22/12/2015.
 */

// https://developers.google.com/maps/documentation/geocoding/intro?csw=1#Geocoding
// Dit gebruiken om adressen te vertalen naar lat en lng of omgekeerd
// Waarom? => google maps werkt met lat en lng, wordt zo opgeslaan in de database

var googleMapsService = function () {
    "use strict";
    // private
    var mapoptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    var geocoder = new google.maps.Geocoder();
    var map = new google.maps.Map(document.querySelector("#map"), mapoptions);
    var markers = [];

    var chooseIcon = function (mood) {
        var url = "http://student.howest.be/jonatan.michiels/geofeelings/assets/";
        if (mood <= 20) {
            return url += "depressed.png";
        } else if (mood > 20 && mood <= 40) {
            return url += "sad.png";
        } else if (mood > 40 && mood <= 60) {
            return url += "common.png";
        } else if (mood > 60 && mood <= 80) {
            return url += "happy.png";
        } else {
            return url += "excited.png";
        }
    };

    //public
    return {
        showLocationOnMap: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    var marker = new google.maps.Marker({
                        position: map.getCenter(),
                        map: map,
                        icon: "http://student.howest.be/jonatan.michiels/geofeelings/assets/location_now.png"
                    });
                    markers.push(marker);
                });
            } else {
                console.log("Location isn't found, please allow google atleast to know where you are");
            }
        },

        removeMarkers: function () {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        },

        showOnePostMarker: function (data) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.lat, data.lng),
                map: map,
                icon: chooseIcon(data.mood)
            });

            if (!data.reason) {
                data.reason = "Random post with no reason!";
            }

            if (!data.event) {
                data.event.eventname = "No event data";
            }

            var infoWindow = new google.maps.InfoWindow();
            var content = "<h4 class='infowindowstyle'> Share details </h4>" +
                "<p class='infowindowstyle'> Time: <span>" + new Date(data.time) +
                "<p class='infowindowstyle'> Mood: <span>" + data.mood + "%</span></p>" +
                "<p class='infowindowstyle'> Reason: <span>" + data.reason + "</span></p>" + "</span></p>" +
                "<p class='infowindowstyle'> User: <span>" + data.user.username + "</span></p>" +
                "<p class='infowindowstyle'> Address: <span>" + data.address + "</span></p>" +
                "<p class='infowindowstyle'> Event: <span>" + data.event.eventname + "</span></p>";

            google.maps.event.addListener(marker, "click", (function (marker, content, infoWindow) {
                return function () {
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                };
            })(marker, content, infoWindow));
        },

        showAllMarkers: function (data) {
            var marker, i;
            for (i = 0; i < data.length; i++) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i].lat, data[i].lng),
                    map: map,
                    icon: chooseIcon(data[i].mood)
                });

                if (!data[i].reason) {
                    data[i].reason = "Random post with no reason!";
                }

                if (!data[i].event.eventname) {
                    data[i].event.eventname = "No event data";
                }

                var infoWindow = new google.maps.InfoWindow();
                var content = "<h4 class='infowindowstyle'> Share details </h4>" +
                    "<p class='infowindowstyle'> Time: <span>" + new Date(data[i].time) +
                    "<p class='infowindowstyle'> Mood: <span>" + data[i].mood + "%</span></p>" +
                    "<p class='infowindowstyle'> Reason: <span>" + data[i].reason + "</span></p>" + "</span></p>" +
                    "<p class='infowindowstyle'> User: <span>" + data[i].user.username + "</span></p>" +
                    "<p class='infowindowstyle'> Address: <span>" + data[i].address + "</span></p>" +
                    "<p class='infowindowstyle'> Event: <span>" + data[i].event.eventname + "</span></p>";

                markers.push(marker);
                google.maps.event.addListener(marker, "click", (function (marker, content, infoWindow) {
                    return function () {
                        infoWindow.setContent(content);
                        infoWindow.open(map, marker);
                    };
                })(marker, content, infoWindow));
            }
        },

        zoomInOnMarker: function (lat, lng) {
            map.setZoom(20);
            map.panTo(new google.maps.LatLng(lat, lng));
        },

        resetMapView: function () {
            map.setZoom(10);
        },

        convertAdressToCoordinates: function (address, cb) {
            geocoder.geocode({address: address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    cb(null, results[0].geometry.location);
                } else {
                    cb(status, null);
                }
            });
        },

        convertCoordinatesToAdress: function (lat, lng, cb) {
            var location = new google.maps.LatLng(lat, lng);
            geocoder.geocode({latLng: location}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    cb(null, results[0].formatted_address);
                } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    setTimeout(function () {
                        cb(null, results[0].formatted_address);
                    }, 200);
                } else {
                    cb(status, null);
                }
            });
        }
    };
};

angular.module("geofeelings").factory("googleMapsService", [googleMapsService]);