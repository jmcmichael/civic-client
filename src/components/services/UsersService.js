(function() {
  'use strict';
  angular.module('civic.services')
    .factory('UsersResource', UsersResource)
    .factory('Users', UsersService);

  // @ngInject
  function UsersResource($resource) {

    return $resource('/api/users/:userId',
      {
        userId: '@userId'
      },
      {
        get: {
          method: 'GET',
          isArray: false,
          cache: false
        },
        query: {
          method: 'GET',
          isArray: false,
          cache: false
        },
        update: {
          method: 'PATCH',
          params: {
            userId: '@id'
          },
          cache: false
        },
        queryEvents: {
          url: '/api/users/:userId/events',
          method: 'GET',
          isArray: false,
          cache: false
        },
        usernameStatus: {
          url: '/api/users/username_status/',
          params: {
            username: '@username'
          },
          method: 'GET',
          isArray: false,
          cache: false
        }
      }
    );
  }

  // @ngInject
  function UsersService(UsersResource) {
    var item = { };
    var collection = [];
    var events = [];

    return {
      data: {
        item: item,
        collection: collection,
        events: events
      },
      get: get,
      query: query,
      queryEvents: queryEvents,
      update: update,
      usernameStatus: usernameStatus
    };

    function get(userId) {
      return UsersResource.get({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function query(reqObj) {
      return UsersResource.query(reqObj).$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function queryEvents(userId) {
      return UsersResource.queryEvents({userId: userId}).$promise
        .then(function(response) {
          angular.copy(response, events);
          return response.$promise;
        });
    }
    function update(user) {
      return UsersResource.update(user).$promise
        .then(function(response) {
          return response.$promise;
        });
    }

    function usernameStatus(username) {
      return UsersResource.usernameStatus({username: username}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
