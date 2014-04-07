!(function(app) {
  app.controller('authentication', ['$rootScope', '$scope', '$state', 'Restangular', '$http', function($rootScope, $scope, $state, Restangular, $http) {
    $scope.message = 'Welcome to Bunsen'

    $scope.submit = function() {
      Restangular.all('authenticate').post($scope.user)
        .then(function(d) {
          $rootScope.currentUser = d;
          $scope.message = 'You are signed in.'
          $http.defaults.headers.common['Authorization'] = d.token;
          if ($rootScope.goTo) {
            $state.go($rootScope.goTo);
            delete $rootScope.goTo;
          } else {
            $state.go('projects.items');
          }
        }, function() {
          $scope.message = 'Error: Invalid user or password';
        });
    };
  }]);
})(window.bunsen);
