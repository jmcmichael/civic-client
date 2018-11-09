(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Ideogram', function($window) {
      return $window.Ideogram;
    })
    .constant('IdeogramConfig', {
      dataDir: '/bower_components/ideogram/dist/data/'
    });
})();
