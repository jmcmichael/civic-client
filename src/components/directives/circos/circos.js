(function() {
  'use strict';
  angular.module('civic.common')
    .directive('circosPlot', circos);

  // @ngInject
  function circos() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/circos/circos.tpl.html',
      replace: true,
      scope: {
        gene: '=',
        variants: '='
      },
      controller: circosController,
      link: circosLink
    };

    return directive;
  }

  function circosLink(scope, element, attrs) {
    console.log(element);
    var circosEl = element[0].querySelector('#circos-plot');
    var ideogramEl = element[0].querySelector('#ideogram-plot');
    var circosWidth = circosEl.offsetWidth;
    angular.element(circosEl).css('height', circosWidth + 'px');
    angular.element(ideogramEl).css('height', circosWidth + 'px');
  }

  // @ngInject
  function circosController($scope, $element, _, d3, Ideogram, IdeogramConfig, Circos, CircosConfig) {
    var drawIdeogram = function(element, gene) {
      var ideogramEl = element[0].querySelector('#ideogram-plot');
      var height = ideogramEl.offsetHeight - 60;

      var ideogram = new Ideogram({
        organism: 'human',
        dataDir: 'https://unpkg.com/ideogram@0.10.0/dist/data/bands/native/',
        container: '#ideogram-plot',
        assembly: 'GRCh37',
        chromosomes: ['17'],
        onWillShowAnnotationTooltip: function(annot) {
          console.log('SHOWING TOOLTIP:');
          console.log(annot);
          return annot;
        },
        chrHeight: height,
        showBandLabels: true,
        annotations: [{
          name: 'BRCA1',
          chr: '17',
          start: 43044294,
          stop: 43125482
        }]
      });
    };

    $scope.$evalAsync(function() {
      drawIdeogram();
    });

    var drawCircos = function(element, error, GRCh37, cbands, segdup) {
      var circosEl = element[0].querySelector('#circos-plot');

      // get element width
      var elWidth = circosEl.offsetWidth;
      var elHeight = circosEl.offsetHeight;

      var circos = new Circos({
        container: '#circos-plot',
        width: elWidth,
        height: elHeight
      });

      var gieStainColor = {
        gpos100: 'rgb(0,0,0)',
        gpos: 'rgb(0,0,0)',
        gpos75: 'rgb(130,130,130)',
        gpos66: 'rgb(160,160,160)',
        gpos50: 'rgb(200,200,200)',
        gpos33: 'rgb(210,210,210)',
        gpos25: 'rgb(200,200,200)',
        gvar: 'rgb(220,220,220)',
        gneg: 'rgb(255,255,255)',
        acen: 'rgb(217,47,39)',
        stalk: 'rgb(100,127,164)',
        select: 'rgb(135,177,255)'
      };

      var cytobands = cbands
        .filter(function(d) {
          return d.chrom === 'chr9';
        })
        .map(function(d) {
          return {
            block_id: d.chrom,
            start: parseInt(d.chromStart),
            end: parseInt(d.chromEnd),
            gieStain: d.gieStain
          };
        });

      var start = 39000000;
      var length = 8000000;
      var data = segdup.filter(function(d) {
        return d.chr === 'chr9' && d.start >= start && d.end <= start + length;
      }).filter(function(d) {
        return d.end - d.start > 30000;
      }).map(function(d) {
        d.block_id = d.chr;
        d.start -= start;
        d.end -= start;
        return d;
      });

      circos
        .layout(
          [{
            id: 'chr9',
            len: length,
            label: 'chr9',
            color: '#FFCC00'
          }], {
            innerRadius: elWidth / 2 - 50,
            outerRadius: elWidth / 2 - 30,
            labels: {
              display: false
            },
            ticks: {
              display: true,
              labels: false,
              spacing: 10000
            }
          }
        )
        .highlight('cytobands', cytobands, {
          innerRadius: elWidth / 2 - 50,
          outerRadius: elWidth / 2 - 30,
          opacity: 0.8,
          color: function(d) {
            return gieStainColor[d.gieStain];
          }
        })
        .stack('stack', data, {
          innerRadius: 0.7,
          outerRadius: 1,
          thickness: 4,
          margin: 0.01 * length,
          direction: 'out',
          strokeWidth: 0,
          color: function(d) {
            if (d.end - d.start > 150000) {
              return 'red';
            } else if (d.end - d.start > 120000) {
              return '#333';
            } else if (d.end - d.start > 90000) {
              return '#666';
            } else if (d.end - d.start > 60000) {
              return '#999';
            } else if (d.end - d.start > 30000) {
              return '#BBB';
            } else {
              return '#CCC';
            }
          },
          tooltipContent: function(d) {
            return `${d.block_id}:${d.start}-${d.end}`;
          }
        })
        .render();
    };


    d3.queue()
      .defer(d3.json, CircosConfig.data.GRCh37)
      .defer(d3.csv, CircosConfig.data.cytobands)
      .defer(d3.csv, CircosConfig.data.segdup)
      .await(_.curry(drawCircos)($element));

    // var config = {
    //   outerRadius: elWidth,
    //   innerRadius: elWidth - 30,
    //   cornerRadius: 5,
    //   gap: 0.04, // in radian
    //   labels: {
    //     display: true,
    //     position: 'center',
    //     size: '14px',
    //     color: '#000000',
    //     radialOffset: 20,
    //   },
    //   ticks: {
    //     display: true,
    //     color: 'grey',
    //     spacing: 10000000,
    //     labels: true,
    //     labelSpacing: 10,
    //     labelSuffix: 'Mb',
    //     labelDenominator: 1000000,
    //     labelDisplay0: true,
    //     labelSize: '10px',
    //     labelColor: '#000000',
    //     labelFont: 'default',
    //     majorSpacing: 5,
    //     size: {
    //       minor: 2,
    //       major: 5,
    //     }
    //   },
    //   events: {}
    // };

    // var circos = new Circos(config);
  }
})();
