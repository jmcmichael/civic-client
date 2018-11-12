(function() {
  'use strict';
  angular.module('civic.services')
    .factory('circos', function ($window) {
      return $window.Circos;
    });
})();
