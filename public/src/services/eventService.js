/**
 * Created by Jonatan on 28/12/2015.
 */

var eventService = function ($http, googleMapsService) {
    "use strict";

    //private

    //public
    return {

        getAllEvents: function (cb) {
            $http.get("/api/event").success(function (data) {
                if (data.redirect) {
                    cb(null, data);
                } else {

                    var eventsFound = [];
                    angular.forEach(data, function (searchR) {
                        var newSR = new SearchResult(searchR.eventname, searchR.address, searchR._id,"event");
                        eventsFound.push(newSR);
                    });
                    cb(null, eventsFound);
                }
            }).error(function (error) {
                cb(error, null);
            });
        },

        getEvents: function (cb) {
            $http.get("/api/event").success(function (data) {
                if(data.redirect) {
                    cb(null, data);
                } else {
                    var events = [];
                    angular.forEach(data, function(event) {
                        events.push(new GfEvent(event._id, event.eventname, event.eventimage, event.authorid, event.from, event.until, event.lat, event.lng, event.address));
                    });
                    cb(null, events);
                }
            }).error(function (error) {
                cb(error, null);
            });
        },

        getEventById: function (eventid, cb) {
            $http.get("/api/event/" + eventid).success(function (data) {
                if (data.redirect) {
                    cb(null, data);
                } else {
                    if (data.address) {
                        cb(null, new GfEvent(data._id, data.eventname, data.eventimage, data.authorid, new Date(data.from), new Date(data.until), data.lat, data.lng, data.address));
                    } else {
                        googleMapsService.convertCoordinatesToAdress(data.lat, data.lng, function (err, address) {
                            if (!err) {
                                cb(null, cb(null, new GfEvent(data._id, data.eventname, data.eventimage, data.authorid, new Date(data.from), new Date(data.until), data.lat, data.lng, address)));
                            } else {
                                cb(err, null);
                            }
                        });
                    }
                }
            }).error(function (error) {
                cb(error, null);
            });
        },

        getEventByIdForShare: function (eventid, cb) {
            $http.get("/api/event/" + eventid).success(function(data) {
                cb(null, new GfEvent(data._id, data.eventname, data.eventimage, null, null, null, null, null, null));
            }).error(function (error) {
                cb(error, null);
            });
        },

        postEvent: function (data, cb) {
            googleMapsService.convertAdressToCoordinates(data.address, function (err, coord) {
                if (!err) {
                    data.lat = coord.lat();
                    data.lng = coord.lng();

                    $http.post("/api/event", new GfEvent(data._id, data.eventname, data.eventimage, data.authorid, new Date(data.from), new Date(data.until), data.lat, data.lng, data.address)).success(function (response) {
                        cb(null, response);
                    }).error(function (error) {
                        cb(error, null);
                    });
                } else {
                    cb(err, null);
                }
            });
        },

        updateEvent: function (data, cb) {
            googleMapsService.convertAdressToCoordinates(data.address, function (err, coord) {
                if (!err) {
                    data.lat = coord.lat();
                    data.lng = coord.lng();

                    $http.put("/api/event/" + data.id, data).success(function (response) {
                        cb(null, new GfEvent(response._id, response.eventname, response.eventimage, response.authorid, new Date(response.from), new Date(response.until), response.lat, response.lng, response.address));
                    }).error(function (error) {
                        cb(error, null);
                    });
                } else {
                    cb(err, null);
                }
            });
        },

        deleteEvent: function (event, cb) {
            $http.delete("/api/event/" + event.id).success(function (data) {
                cb(null, data);
            }).error(function (error) {
                cb(error, null);
            });
        }
    };
};

angular.module("geofeelings").factory("eventService", ["$http", "googleMapsService", eventService]);