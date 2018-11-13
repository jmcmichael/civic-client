(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Ideogram', function ($window) {
      return $window.Ideogram;
    })
    .constant('IdeogramConfig', {
      data: {
        'GRCh37': '/assets/data/GRCh37.json',
        'cytobands': '/assets/data/cytobands.csv',
        'segdup': '/assets/data/segdup.csv'
      }
    });
})();
