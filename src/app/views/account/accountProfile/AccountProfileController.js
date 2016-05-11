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
      data: {
        titleExp: '"Account Profile"',
        navMode: 'sub'
      }
    });
  }

  // @ngInject
  function AccountProfileController() {
    console.log('AccountProfileController called.');
  }
})();
