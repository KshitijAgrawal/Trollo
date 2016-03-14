angular.module('starter.services', [])

.factory('Tasks', function(TrelloApis) {
  // Might use a resource here that returns a JSON array
  var cards;
  var departments;	
  return {

    all: function(allSucess, memberSuccess) {
		console.log("all");	
		var success = function(cardsResponse) {
			allSucess(cardsResponse);
			cards = cardsResponse;
		};
		var error = function(errorMsg) { 
			genericError();
		};

		TrelloApis.getAllCardsInAList('56c69aa345f99b2f521e36a5').then(
			success,
			error
			);

		TrelloApis.getMember('me').then(
			memberSuccess,
			genericError
			);
    },

    allDepartments: function(departmentsSuccess)
    {
    	var success = function (boards){
						departmentsSuccess(boards);
						departments = boards;
					};

    	TrelloApis.getAllBoardsForMember('me').then(
					success);
    },

    remove: function($scope, card) {
      $scope.cards.splice(cards.indexOf(card), 1);
	  cards = $scope.cards;
	  var cID = card.id;
	  var promise = TrelloApis.deleteACard(cID,
	  	function(deleteResponse){
	  		console.log("delete success "+deleteResponse);},
	  	function(deleteResponse){
	  		console.log("delete error "+deleteResponse);});
    },

    get: function(cardId) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
          return cards[i];
        }
      }
      return null;
    },

    getDepartment: function(depId){
    	for (var i = 0; i < departments.length; i++) {
        if (departments[i].id === depId) {
          return departments[i];
        }
      }
    },

    put: function($scope, newCard, cardId){
      var creationSuccess = function(data) {
        $scope.cards.splice($scope.cards.indexOf(newCard), 1);
        $scope.cards.push(newCard);
        cards = $scope.cards;
        console.log('Card Saved successfully. Data returned:' + JSON.stringify(data));
      };
      console.log('PUT card');
      var promise = TrelloApis.modifyACard(cardId, newCard).then(
      	creationSuccess,
      	function(putResponse){
	  		console.log("put error "+putResponse);});
    },

	post: function($scope,inputcard)
	{
		var myList = '56c69aa345f99b2f521e36a5';
		var creationSuccess = function(createResponse) {
		  $scope.cards.push(newCard);
	      cards = $scope.cards;
		  console.log('Card created successfully. Data returned:' + JSON.stringify(createResponse));
		};
		var newCard = {
		  name: inputcard.name, 
		  desc: inputcard.desc,
		  // Place this card at the top of our list 
		  idList: myList,
		  pos: 'top'
		};
		var promise = TrelloApis.createANewcard(newCard).then(
			creationSuccess,
			function(createResponse){
	  			console.log("delete error "+ createResponse);}
			);
	}
  };
})

.factory('TrelloApis', function ($q, $log)
{
	var httpHelper = function(callerFunction)
	{
		var deferred = $q.defer();
		return{
				getPromise:function(){
					return deferred.promise;
				},
				success:function(getResponse)
				{
					$log.log(callerFunction + " : Successful...");
					deferred.resolve(getResponse);
				},
				error:function(getResponse)
				{
					$log.log(callerFunction+ " : Error...");
					deferred.reject(getResponse);
				}
			};	
	};
	return {
		getAllCardsInAList: function(listId)
		{
			var listUri = 'lists/' + listId + '/cards';
			var hh = httpHelper("getAllCardsInAList");
			Trello.get(listUri, hh.success, hh.error);
			return hh.getPromise();
		},

		deleteACard: function(cardId)
		{
			var deleteUri = 'cards/' + cardId;
			var hh = httpHelper("deleteACard");
		    Trello.delete(deleteUri, hh.success, hh.error);
			return hh.getPromise();
		},

		createANewcard: function(newCard)
		{
			var createUri = 'cards/';
			var hh = httpHelper("createANewcard");
			Trello.post(createUri, newCard, hh.success, hh.error);
			return hh.getPromise();
		},

		modifyACard: function(cardId, newCard)
		{
			var putUri = 'cards/'+ cardId;
			var hh = httpHelper("modifyACard");
			Trello.put(putUri, newCard, hh.success, hh.error);
			return hh.getPromise();

		},

		getMember: function(memberIdOrUsername)
		{
			var getUri = 'members/'+ memberIdOrUsername;
		    var hh = httpHelper("getMember");
			Trello.put(getUri, hh.success, hh.error);
			return hh.getPromise();
		},

		getAllBoardsForMember: function(memberIdOrUsername)
		{
			var getUri = 'members/'+ memberIdOrUsername + '/boards';
			var hh = httpHelper("getAllBoardsForMember");
			Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		},

		getAllMembersForBoard: function(boardId)
		{
			var getUri = 'boards/' + boardId + '/members';
			var hh = httpHelper("getMember");
			Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		}
	};
});
	