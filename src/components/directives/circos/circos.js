(function() {
  'use strict';
  angular.module('civic.common')
    .directive('circos', circos);

  // @ngInject
  function circos() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/circos/circos.tpl.html',
      replace: true,
      scope: {
        variants: '='
      },
      controller: circosController
    };

    return directive;
  }

  // @ngInject
  function circosController($scope, $element, Circos) {
    // get element width
    var el = $element[0];
    var elWidth = el.cssWidth;
    var elHeight= el.cssHeight;

    var config = {
      outerRadius: elWidth,
      innerRadius: elWidth - 30,
      cornerRadius: 5,
      gap: 0.04, // in radian
      labels: {
        display: true,
        position: 'center',
        size: '14px',
        color: '#000000',
        radialOffset: 20,
      },
      ticks: {
        display: true,
        color: 'grey',
        spacing: 10000000,
        labels: true,
        labelSpacing: 10,
        labelSuffix: 'Mb',
        labelDenominator: 1000000,
        labelDisplay0: true,
        labelSize: '10px',
        labelColor: '#000000',
        labelFont: 'default',
        majorSpacing: 5,
        size: {
          minor: 2,
          major: 5,
        }
      },
      events: {}
    };

    var circos = new Circos(config);
  }
})();
