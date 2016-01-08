/**
 * Created by Lienert on 21/12/2015.
 */

(function () {
    "use strict";

    var intro_sharedController = function ($scope, shareVarsBetweenCtrl) {
        $scope.infoPostedShare = shareVarsBetweenCtrl.getProperty();
    };
    angular.module("geofeelings").controller("intro_sharedController", ["$scope", "shareVarsBetweenCtrl", intro_sharedController]);
})();