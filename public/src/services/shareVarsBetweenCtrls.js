/**
 * Created by liene on 28/12/2015.
 */


var shareVarsBetweenCtrl = function () {
    "use strict";

    //private
    var property;
    var userlessShare;
    var ExtraLoginInfo;
    //public
    return {

        getProperty: function () {
            return property;
        },

        setProperty: function (value) {
            property = value;
        },

        setExtraLoginInfo: function (data) {
            ExtraLoginInfo = data;
        },
        getExtraLoginInfo: function () {
            return ExtraLoginInfo;
        },

        saveUserlessShare: function (data) {
            userlessShare = data;
        },
        returnUserlessShare: function () {
            return userlessShare;
        }
    };
};

angular.module("geofeelings").factory("shareVarsBetweenCtrl", [shareVarsBetweenCtrl]);