(function() {
  'use strict';
  angular.module('civic.services')
    .factory('Circos', function ($window) {
      return $window.Circos;
    })
    .constant('CircosConfig', {
      data: {
        'GRCh37': '/assets/data/GRCh37.json',
        'cytobands': '/assets/data/cytobands.csv',
        'segdup': '/assets/data/segdup.csv'
      }
    });
})();
