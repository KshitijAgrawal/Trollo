angular.module('starter.controllers', [])

.controller('TaskCtrl', function($scope, $ionicModal, Tasks) {
		
		 console.log("in factory cards");

		 var allSuccess = function(cardsResponse) {
			console.log(cardsResponse);
			$scope.cards = cardsResponse;
		 };

		 var memberSuccess = function (member) {
			console.log('member' + member);
			$scope.currentUser = member;
		 };

		 var departmentsSuccess = function (boards){
						$scope.departments = boards;
					};

	     Tasks.all(allSuccess, memberSuccess);
	     Tasks.allDepartments(departmentsSuccess);

		 $scope.remove = function(card){
		  	var deleteSuccess = function(deleteResponse){
		  		$scope.cards.splice($scope.cards.indexOf(card), 1);
		  		console.log("delete success "+deleteResponse);
	  		}

		  Tasks.remove(card, deleteSuccess);
		 };

		 $scope.add = function(newcard){
		  var addSuccess = function(createdCard) {
			  $scope.cards.push(createdCard);
			  console.log('Card created successfully. Data returned:' + JSON.stringify(createdCard));
			  $scope.closeModal();
			};

			Tasks.post(newcard, addSuccess);
		 };

		 $scope.refresh = function(){
			 Tasks.all(allSuccess, memberSuccess);
			 $scope.$broadcast('scroll.refreshComplete');
		 };

		 $scope.refreshNewcardMembers = function(){
		 	var getSuccess = function(members)
		 	{
		 		console.log('members' + members);
		 		$scope.newCard.members = members;
		 		$scope.newCard.assignedTo = $scope.newCard.members[0];
		 	}
		 	Tasks.getMembersForDepartment($scope.newCard.department.id, getSuccess);
		 }

		$ionicModal.fromTemplateUrl('templates/CreateTaskModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modal = modal;
		  });
		  $scope.openModal = function() {
		  	console.log("showing modal");
		  	$scope.newCard = {}; //reset
		    $scope.newCard.department = $scope.departments[0];
		    $scope.refreshNewcardMembers();
		    $scope.modal.show();
		  };
		  $scope.closeModal = function() {
		    $scope.modal.hide();
		  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.modal.remove();
		  });
		  // Execute action on hide modal
		  $scope.$on('modal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('modal.removed', function() {
		    // Execute action
		  });
		  })

.controller('TaskDetailCtrl', function($scope, $stateParams, Tasks) {
		  $scope.card = Tasks.get($stateParams.cardId);

		  $scope.department = Tasks.getDepartment($stateParams.departmentId)

		  $scope.put = function(newCard){
		  	var putSuccess = function(data) {
		        console.log('Card Saved successfully. Data returned:' + JSON.stringify(data));
		      };

		    Tasks.put(newCard, $stateParams.cardId, putSuccess);
		  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
