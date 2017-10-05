(function() {
  'use strict';
  angular.module('civic.add')
    .config(AddAssertionConfig)
    .controller('AddAssertionController', AddAssertionController);

  // @ngInject
  function AddAssertionConfig($stateProvider) {
    $stateProvider
      .state('add.assertion', {
        url: '/assertion?geneId?variantId',
        templateUrl: 'app/views/add/assertion/addAssertion.tpl.html',
        resolve: {
          Assertions: 'Assertions'
        },
        controller: 'AddAssertionController',
        controllerAs: 'vm',
        data: {
          title: 'Add Assertion',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AddAssertionController($scope,
                                  $stateParams,
                                  _,
                                  formConfig,
                                  ConfigService,
                                  Assertions,
                                  Datatables,
                                  Security,
                                  Genes,
                                  Diseases) {
    var vm = this;
    vm.type = 'ASSERTION';

    var help = ConfigService.evidenceHelpText;
    var descriptions = ConfigService.evidenceAttributeDescriptions;
    var make_options = ConfigService.optionMethods.make_options; // make options for pull down
    var el_options = ConfigService.optionMethods.el_options; // make options for evidence level
    var cs_options = ConfigService.optionMethods.cs_options; // make options for clinical significance
    var merge_props = ConfigService.optionMethods.merge_props; // reduce depth of object tree by 1; by merging properties of properties of obj

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;


    vm.assertion = {
      gene: {name:''},
      variant: {name:''},
      description: '',
      disease: {
        name: ''
      },
      evidence_type: '',
      clinical_significance: ''
    };

    vm.assertionFields = [
      {
        key: 'gene',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['entrezIdDisplay'],
        controller: /* @ngInject */ function($scope, $stateParams, Genes) {
          // populate field if geneId provided
          if ($stateParams.geneId) {
            Genes.getName($stateParams.geneId).then(function(gene) {
              $scope.model.gene = _.pick(gene, ['id', 'name', 'entrez_id']);
              $scope.to.data.entrez_id = gene.entrez_id;
            });
          }
          // if gene name provided, get id, entrez_id
          if ($stateParams.geneName) {
            Genes.beginsWith($stateParams.geneName)
              .then(function(response) {
                // set field to first item on typeahead suggest
                $scope.model.gene = response[0];
                $scope.to.data.entrez_id = response[0].entrez_id;
              });
          }
        },
        templateOptions: {
          label: 'Gene Entrez Name',
          value: 'vm.newEvidence.gene',
          minLength: 32,
          required: true,
          editable: false,
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          templateUrl: 'components/forms/fieldTypes/geneTypeahead.tpl.html',
          onSelect: 'to.data.entrez_id = $model.entrez_id',
          helpText: help['Gene Entrez Name'],
          data: {
            entrez_id: '--',
            typeaheadSearch: function(val) {
              return Genes.beginsWith(val)
                .then(function(response) {
                  var labelLimit = 70;
                  var list = _.map(response, function(gene) {
                    if (gene.aliases.length > 0) {
                      gene.alias_list = gene.aliases.join(', ');
                      if (gene.alias_list.length > labelLimit) {
                        gene.alias_list = _.truncate(gene.alias_list, labelLimit);
                      }
                    }
                    return gene;
                  });
                  return list;
                });
            }
          }
        },
        modelOptions: {
          debounce: {
            default: 300
          }
        }
      },
      {
        key: 'variant',
        type: 'horizontalTypeaheadHelp',
        className: 'input-caps',
        controller: /* @ngInject */ function($scope, $stateParams, Variants) {
          // populate field if variantId provided
          if ($stateParams.variantId) {
            Variants.get($stateParams.variantId).then(function(variant) {
              $scope.model.variant = {
                name: variant.name
              };
            });
          }
          // just drop in the variant name string if provided
          if ($stateParams.variantName) {
            $scope.model.variant = {
              name: $stateParams.variantName
            };
          }
        },
        templateOptions: {
          label: 'Variant Name',
          required: true,
          value: 'vm.newEvidence.variant',
          minLength: 32,
          helpText: help['Variant Name'],
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)',
          editable: true
        },
        data: {
          typeaheadSearch: function(val) {
            var request = {
              mode: 'variants',
              count: 10,
              page: 0,
              'filter[variant]': val
            };
            return Datatables.query(request)
              .then(function(response) {
                return _.map(_.uniq(response.result, 'variant'), function(event) {
                  return {
                    name: event.variant
                  };
                });
              });
          }
        }
      },
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.evidenceType) {
            var et = $stateParams.evidenceType;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_type);
            if(_.includes(permitted, et)) {
              $scope.model.evidence_type = $stateParams.evidenceType;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[et];
            } else {
              console.warn('Ignoring pre-population of Evidence Type with invalid value: ' + et);
            }
          }
        },
        templateOptions: {
          label: 'Evidence Type',
          required: true,
          value: 'vm.newEvidence.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [{ value: '', label: 'Please select an Evidence Type' }].concat(make_options(descriptions.evidence_type)),
          onChange: function(value, options, scope) {
            // reset clinical_significance, as its options will change
            scope.model.clinical_significance = '';

            // if we're switching to Predictive, seed the drugs array w/ a blank entry,
            // otherwise set to empty array
            value === 'Predictive' ? scope.model.drugs = [''] : scope.model.drugs = [];

            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];

            // update evidence direction attribute definition
            var edField = _.find(scope.fields, { key: 'evidence_direction'});
            if (edField.value() !== '') { // only update if user has selected an option
              edField.templateOptions.data.updateDefinition(null, edField, scope);
            }
          },
          helpText: help['Evidence Type'],
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.evidence_type
          }
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'vm.assertion.description',
          focus: true,
          minLength: 32,
          helpText: 'A brief description of this new assertion.'
        }
      },
      {
        key: 'disease',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['loader', 'diseasedisplay'],
        templateOptions: {
          label: 'Disease',
          value: 'vm.newEvidence.doid',
          required: true,
          minLength: 32,
          helpText: 'Please enter a disease name. Disease must exist in the CIViC database.',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          onSelect: 'to.data.doid = $model.doid',
          templateUrl: 'components/forms/fieldTypes/diseaseTypeahead.tpl.html',
          data: {
            doid: '--',
            typeaheadSearch: function(val) {
              return Diseases.beginsWith(val)
                .then(function(response) {
                  var labelLimit = 70;
                  return _.map(response, function(disease) {
                    if (disease.aliases.length > 0) {
                      disease.alias_list = disease.aliases.join(', ');
                      if(disease.alias_list.length > labelLimit) { disease.alias_list = _.truncate(disease.alias_list, labelLimit); }
                    }
                    return disease;
                  });
                });
            }
          }
        },
        controller: /* @ngInject */ function($scope, $stateParams, Diseases) {
          if($stateParams.diseaseName) {
            Diseases.beginsWith($stateParams.diseaseName)
              .then(function(response) {
                $scope.model.disease = response[0];
                $scope.to.data.doid = response[0].doid;
              });
          }
        }
      },
      // {
      //   key: 'nccn_guidelines',
      //   type: 'horizontalMultiselectHelp',
      //   templateOptions: {
      //     label: 'NCCN Guidelines',
      //     required: true,
      //     value: 'vm.newEvidence.evidence_type',
      //     ngOptions: 'option["value"] as option["label"] for option in to.options',
      //     options: [{ value: '', label: 'Please select NCCN Guidelines' }].concat(make_options(ConfigService.nccnGuidelines)),
      //     helpText: 'Please select applicable NCCN Guidelines',
      //     data: {
      //       attributeDefinition: '&nbsp;',
      //       attributeDefinitions: descriptions.evidence_type
      //     }
      //   }
      // },
    ];

    vm.add = function(newAssertion) {
      newAssertion.variants = _.without(newAssertion.variants, ''); // delete blank input values
      Assertions.add(newAssertion)
        .then(function(response) {
          console.log('new assertion created!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.newGroupId = response.id;
          vm.newGeneId = response.variants[0].gene_id; // grab gene id from first variant in group
        })
        .catch(function(error) {
          console.error('assertion submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function() {
          console.log('assertion submit done!');
        });
    };
  }

})();
