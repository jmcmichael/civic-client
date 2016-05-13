(function() {
  angular.module('civic.account')
    .controller('AccountProfileController', AccountProfileController)
    .config(accountProfileConfig);

  // @ngInject
  function accountProfileConfig($stateProvider) {
    $stateProvider.state('account.profile', {
      url: '/accountProfile',
      controller: 'AccountProfileController',
      templateUrl: 'app/views/account/accountProfile/accountProfile.tpl.html',
      resolve: {
        'CurrentUser': 'CurrentUser',
        'user': function(CurrentUser) {
          return CurrentUser.get();
        }
      },
      data: {
        titleExp: '"Account Profile"',
        navMode: 'sub'
      }
    });
  }

  // @ngInject
  function AccountProfileController($scope, user) {
    var vm = $scope.vm = {};
    vm.user = {};
    angular.copy(user, vm.user);

    vm.profileEditFields = [
      {
        key: 'display_name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Display Name',
          require: true,
          helpText: 'Your primary identifier, shown on all user buttons and used for @ mentions in comments, etc.'
        }
      },
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Full Name',
          require: false,
          helpText: 'Your full name'
        }
      },
      {
        key: 'username',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Username',
          require: true,
          helpText: 'Not sure what this is for.'
        }
      },
      {
        key: 'area_of_expertise',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Area of Expertise',
          require: false,
          helpText: 'A short sentence detailing your experience related to cancer genomics and/or medicine.'
        }
      },
      {
        key: 'orcid',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'ORC ID',
          require: false,
          helpText: 'Your Open Research and Contributor ID'
        }
      }
    ];

    vm.submit = function(user, options) {
      console.log('user update submitted.');
    }
  }
})();
