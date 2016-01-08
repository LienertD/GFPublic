(function () {
    "use strict";

    var app = angular.module("geofeelings", ["ngRoute"]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when("/admin", {
                templateUrl: "./controllers/adminController/admin.html"
            }).when("/search", {
                templateUrl: "./controllers/searchController/search.html"
            }).when("/intro", {
                templateUrl: "./controllers/introController/intro.html"
            }).when("/help", {
                templateUrl: "./directives/help.html"
            }).when("/login", {
                templateUrl: "./controllers/loginController/login.html"
            }).when("/register", {
                templateUrl: "./controllers/loginController/register.html"
            }).when("/user", {
                templateUrl: "./controllers/userController/user.html"
            }).when("/user/:param", {
                templateUrl: "./controllers/userController/user.html",
                controller: 'userController'
            }).when("/me", {
                templateUrl: "./controllers/userController/me.html"
            }).when("/event", {
                templateUrl: "./controllers/eventController/event.html"
            }).when("/event/:param", {
                templateUrl: "./controllers/eventController/event.html",
            }).when("/addEvent", {
                templateUrl: "./controllers/eventController/addEvent.html"
            }).when("/intro_shared", {
                templateUrl: "./controllers/introController/intro_shared.html"
            }).otherwise({
                redirectTo: "/intro"
            });
    });

    app.service('sharedProperties', function () {
        var property = 'First';

        return {
            getProperty: function () {
                return property;
            },
            setProperty: function (value) {
                property = value;
            }
        };
    });

})();
