(function() {
  'use strict';
  angular.module('civic.common')
    .directive('ideogram', ideogram);

  // @ngInject
  function ideogram() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/ideogram/ideogram.tpl.html',
      replace: true,
      scope: {
        variants: '='
      },
      controller: ideogramController
    };

    return directive;
  }

  // @ngInject
  function ideogramController($scope, $element, Ideogram) {
    // get element width
    var el = $element[0];
    var width = el.offsetWidth - 60;

    var config = {
      organism: 'human',
      chromosome: '17',
      chrHeight: width,
      orientation: 'horizontal',
      container: '#ideo-container',
      dataDir: 'https://unpkg.com/ideogram@0.10.0/dist/data/bands/native/',
      annotations: [{
        name: 'BRCA1',
        chr: '17',
        start: 43044294,
        stop: 44125482
      }]
    };
    var ideogram = new Ideogram(config);
  }
})();
