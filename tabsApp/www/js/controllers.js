angular.module('starter.controllers', [])

.controller('TaskCtrl', function($scope, Tasks) {
		
		 console.log("in factory cards");
	     Tasks.all($scope);
		 $scope.remove = function(card){
		  Tasks.remove($scope, card);
		 };
		 $scope.add = function(newcard){
			Tasks.post($scope,newcard);
		 };
		 $scope.refresh = function(){
			 Tasks.all($scope);
			 $scope.$broadcast('scroll.refreshComplete');
		 };
	
  })

.controller('TaskDetailCtrl', function($scope, $stateParams, Tasks) {
  $scope.card = Tasks.get($stateParams.cardId);

  $scope.put = function(newCard){
    Tasks.put($scope, newCard, $stateParams.cardId);
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
