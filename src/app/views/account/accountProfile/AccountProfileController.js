(function() {
  angular.module('civic.account')
    .controller('AccountProfileController', AccountProfileController);

  // @ngInject
  function AccountProfileController() {
    console.log('AccountProfileController called.');
  }
})();
