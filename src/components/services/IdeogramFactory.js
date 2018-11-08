(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Ideogram', function ($window) {
      return $window.Ideogram;
    });
})();
