// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top
    $ionicConfigProvider.navBar.alignTitle('center')
    $ionicConfigProvider.scrolling.jsScrolling(true);

}])

.config(['$provide', function ($provide) {
    $provide.decorator('$log', ['$delegate', function ($delegate) {
        // Keep track of the original debug/error method, we'll need it later.
        var origDebug = $delegate.debug;
        var origError = $delegate.error;
        /*
         * Intercept the call to $log.debug(), $log.error() so we can add on 
         * our enhancement. We're going to add on a date and 
         * time stamp to the message that will be logged.
         */
        $delegate.debug = function () {
            var args = [].slice.call(arguments);
            args[0] = [new Date().toString(), ': ', args[0]].join('');
            
            // Send on our enhanced message to the original debug method.
            origDebug.apply(null, args)
        };

        $delegate.error = function () {
            var args = [].slice.call(arguments);
            args[0] = [new Date().toString(), ': ', args[0]].join('');
            
            // Send on our enhanced message to the original error method.
            origError.apply(null, args)
        };

        return $delegate;
    }]);
}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'TaskCtrl'
      }
    }
  })
  .state('tab.card-detail', {
      url: '/cards/:cardId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/card-detail.html',
          controller: 'TaskDetailCtrl'
        }
      }
    })

  .state('tab.departments', {
      url: '/departments',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-departments.html',
          controller: 'TaskCtrl'
        }
      }
    })
    .state('tab.department-detail', {
      url: '/departments/:departmentId',
      views: {
        'tab-dash': {
          templateUrl: 'templates/department-detail.html',
          controller: 'TaskDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
