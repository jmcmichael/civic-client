(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountViewController', AccountViewController);

  // @ngInject
  function AccountViewController($scope) {
    var vm = $scope.vm = {};

    $scope.$on('title:update', function(e, title) {
      vm.title = title.newTitle;
    })
  }



})();
