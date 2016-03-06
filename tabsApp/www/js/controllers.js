angular.module('starter.controllers', [])

.controller('TaskCtrl', function($scope, Cards) {
		
		 console.log("in factory cards");
	     Cards.all($scope);
		 $scope.remove = function(card){
		  Cards.remove($scope, card);
		 };
		 $scope.add = function(newcard){
			Cards.post($scope,newcard);
		 };
		 $scope.refresh = function(){
			 Cards.all($scope);
			 $scope.$broadcast('scroll.refreshComplete');
		 };
	
  })

.controller('TaskDetailCtrl', function($scope, $stateParams, Cards) {
  $scope.card = Cards.get($stateParams.cardId);

  $scope.put = function(newCard){
    Cards.put($scope, newCard, $stateParams.cardId);
  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
