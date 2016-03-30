angular.module('starter.controllers', [])

.controller('TasksCtrl', function($scope, $ionicModal, $ionicPopover, Tasks) {		
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

	     // Remove a task --------------------------------------
		 $scope.remove = function(card){
		  	var deleteSuccess = function(deleteResponse){
		  		$scope.cards.splice($scope.cards.indexOf(card), 1);
		  		console.log("delete success "+deleteResponse);
	  		}

		  Tasks.remove(card, deleteSuccess);
		 };

		 // Add a Task ------------------------------------------
		 $scope.add = function(newcard){
		  var addSuccess = function(createdCard) {
			  $scope.cards.push(createdCard);
			  console.log('Card created successfully. Data returned:' + JSON.stringify(createdCard));
			  $scope.closeModal();
			};

			Tasks.post(newcard, addSuccess);
		 };

		 //Refresh ----------------------------------------------
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

		 // All Departments page --------------------------------
		 var shownCards = {};
		 $scope.toggleDepartment = function(department) {
		    if ($scope.isDepartmentShown(department)) {
		      $scope.shownDepartmentCards = null;
		      $scope.shownDepartment = null;
		    } else 
		    {
		      if(shownCards[department.id] == undefined)
		      {
		      	console.log("shownCards[department.id] = undefined")
		      	var getSuccess = function(tasks)
			 	{
			 		console.log('tasks for dept' + JSON.stringify(tasks));
			 		$scope.shownDepartmentCards = tasks;
			 		shownCards[department.id] = tasks;
			 	}
		      	Tasks.getTasksForDepartment(department.id, getSuccess);
		      } else {
		      	console.log("already in cache")
		      	$scope.shownDepartmentCards = shownCards[department.id];
		      }
		      $scope.shownDepartment = department;
		    }
		  };
		  $scope.isDepartmentShown = function(department) {
		    return $scope.shownDepartment === department;
		  };

		 //----------------------------------------------------------------------------

		 // Modal for adding new Task
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

		  //-------------------------------------------------------------------------------

		  $ionicPopover.fromTemplateUrl('templates/TaskPopover.html', {
		    scope: $scope
		  }).then(function(popover) {
		    $scope.popover = popover;
		  });


		  $scope.openPopover = function($event) {
		    $scope.popover.show($event);
		  };
		  $scope.closePopover = function() {
		    $scope.popover.hide();
		  };
		  //Cleanup the popover when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.popover.remove();
		  });
		  // Execute action on hide popover
		  $scope.$on('popover.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove popover
		  $scope.$on('popover.removed', function() {
		    // Execute action
		  });

		  //--------------------------------------------------------------------------------


		  })

.controller('TaskDetailCtrl', function($scope, $stateParams, Tasks) {
		  $scope.card = Tasks.get($stateParams.cardId);

		  $scope.department = Tasks.getDepartment($stateParams.departmentId)

		  $scope.put = function(newCard){
		  	var putSuccess = function(data) {
		        console.log('Card Saved successfully. Data returned:' + JSON.stringify(data));
		      };

		     console.log("Put called");
		     var putCard = {};
		     putCard.name = newCard.name;
		     putCard.desc = newCard.desc;
		     putCard.closed = newCard.closed;

		    Tasks.put(putCard, $stateParams.cardId, putSuccess);
		  };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
