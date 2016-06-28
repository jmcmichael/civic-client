(function() {
  'use strict';
  angular.module('civic.config')
    .config(typeaheadConfig);

  // @ngInject
  function typeaheadConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'typeahead',
      templateUrl: 'components/forms/fieldTypes/typeahead.tpl.html',
    });

    formlyConfigProvider.setType({
      name: 'geneTypeahead',
      templateUrl: 'components/forms/fieldTypes/geneTypeahead.tpl.html'
    });

    formlyConfigProvider.setType({
      name: 'drugsTypeahead',
      templateUrl: 'components/forms/fieldTypes/drugsTypeahead.tpl.html'
    });

    formlyConfigProvider.setType({
      name: 'horizontalTypeaheadHelp',
      extends: 'typeahead',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'geneHorizontalTypeaheadHelp',
      extends: 'geneTypeahead',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

})();
