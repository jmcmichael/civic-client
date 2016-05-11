(function() {
  'use strict';
  angular.module('civic.account')
    .config(AccountView);

  // @ngInject
  function AccountView($stateProvider) {
    $stateProvider
      .state('account', {
        abstract: true,
        url: '/account',
        controller: 'AccountViewController',
        templateUrl: 'app/views/account/account.tpl.html',
        data: {
          titleExp: '"My Account"',
          navMode: 'sub'
        }
      })
      .state('account.notifications', {
        url: '/notifications?category',
        controller: 'NotificationsController',
        templateUrl: 'app/views/account/notifications/notifications.tpl.html',
        data: {
          titleExp: '"Account Notifications"',
          navMode: 'sub'
        },
        resolve: {
          feed: /* @ngInject */ function($stateParams, CurrentUser) {
            //return CurrentUser.getFeed({page: $stateParams.page});
            return CurrentUser.getFeed({count: 25});
          }
        }
      })
      .state('account.profile', {
        url: '/accountProfile',
        controller: 'AccountProfileController',
        templateUrl: 'app/views/account/accountProfile/accountProfile.tpl.html',
        data: {
          titleExp: '"Account Profile"',
          navMode: 'sub'
        }
        //,
        //resolve: {
        //  mentions: /* @ngInject */ function(CurrentUser) {
        //    CurrentUser.getMentions().then(function(response) {
        //      return response;
        //    });
        //  }
        //}
      });
  }

})();
