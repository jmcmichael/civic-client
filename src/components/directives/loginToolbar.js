(function() {
  'use strict';
  angular.module('civic.security.login.toolbar', [])
    .directive('loginToolbar', loginToolbar);

  // @ngInject
  function loginToolbar() {

    var directive = {
      templateUrl: 'components/directives/loginToolbar.tpl.html',
      restrict: 'E',
      replace: true,
      scope: true,
      controller: /* @ngInject */ function($scope, $rootScope, $location, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
      }
    };
    return directive;
  }
})();
