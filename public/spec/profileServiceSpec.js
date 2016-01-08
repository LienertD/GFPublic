/**
 * Created by Jonatan on 8/01/2016.
 */

// TEST SUITE

describe("meController tests", function () {
    var $rootScope, $scope, $controller;

    beforeEach(module("geofeelings"));

    beforeEach(inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;

        $controller('meController', {'$rootScope' : $rootScope, '$scope': $scope});
    }));

    it("$scope.user should not be null", function () {
        expect($rootScope.user);
    });
});