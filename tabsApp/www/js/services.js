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

		TrelloApis.getAllCardsAssignedToMember('me').then(
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

    remove: function(card, deleteSuccess) {
      var backupCard = cards[cards.indexOf(card)];
      // remove from cards for
	  cards.splice(cards.indexOf(card), 1);
	  var cID = card.id;
	  TrelloApis.deleteACard(cID,
	  	function(deleteResponse){
	  		deleteSuccess(deleteResponse);
	  		},
	  	function(deleteResponse)
	  	{
	  		genericError(deleteResponse);
	  		cards.push(backupCard);
	  	});
    },

    subscribe: function(card, subscribeSuccess)
    {

    },

    get: function(cardId) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
          return cards[i];
        }
      }
      return null;
    },

    getTaskActions: function(cardId, getSuccess) {

    	TrelloApis.getActionsForCard(cardId).then
    	(getSuccess, genericError);
    },

    getDepartment: function(depId){
    	for (var i = 0; i < departments.length; i++) {
        if (departments[i].id === depId) {
          return departments[i];
        }
      }
    },

    getMembersForDepartment: function(depId, getSuccess){
    	TrelloApis.getAllMembersForBoard(depId).then
    	(getSuccess, genericError);
    },

    getTasksForDepartment: function(depId, getSuccess){
    	TrelloApis.getAllCardsForBoard(depId).then
    	(getSuccess, genericError);
    },

    put: function(newCard, cardId, putSuccess){
      var creationSuccess = function(putCard) {
        putSuccess(putCard);
        cards.splice(cards.indexOf(putCard), 1);
        cards.push(putCard);
      };
      console.log('PUT card');
      var promise = TrelloApis.modifyACard(cardId, newCard).then(
      	creationSuccess,
      	genericError);
    },

	post: function(inputcard, addSuccess)
	{
		var myList = '56c69aa345f99b2f521e36a5';
		var creationSuccess = function(createdCard) {
		  addSuccess(createdCard);
	      cards.push(createdCard);
		};

		TrelloApis.getAllListsForBoard(inputcard.department.id).then(
			function(lists)
			{
				var newCard = {
				  name: inputcard.name, 
				  desc: inputcard.desc, 
				  idList: lists[0].id,
				  idBoard: inputcard.department.id,
				  idMembers: [inputcard.assignedTo.id],
				  pos: 'top'
				};
				TrelloApis.createANewcard(newCard).then(
					creationSuccess,
					genericError
				);
			}
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
				success:function(response)
				{
					$log.debug(callerFunction + " : Successful..." + JSON.stringify(response));
					deferred.resolve(response);
				},
				error:function(response)
				{
					$log.error(callerFunction+ " : Error..." + JSON.stringify(response));
					Trello.deauthorize();
					deferred.reject(response);
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

		getACard: function(cardId)
		{
			var getUri = 'cards/' + cardId;
			var hh = httpHelper("getACard");
		    Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		},

		getActionsForCard: function(cardId)
		{
			var getUri = 'cards/' + cardId + '/actions?filter=commentCard,updateCard';
			var hh = httpHelper("getActionsForCard");
		    Trello.get(getUri, hh.success, hh.error);
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
			var hh = httpHelper("getAllMembersForBoard");
			Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		},

		getAllListsForBoard: function(boardId)
		{
			var getUri = 'boards/' + boardId + '/lists';
			var hh = httpHelper("getAllListsForBoard");
			Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		},

		getAllCardsForBoard: function(boardId)
		{
			var getUri = 'boards/' + boardId + '/cards';
			var hh = httpHelper("getAllCardsForBoard");
			Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		},

		//We consider all of the cards to which member is added
		//to be assigned to this member
		getAllCardsAssignedToMember: function(memberIdOrUsername)
		{
			var getUri = 'members/'+ memberIdOrUsername + '/cards';
			var hh = httpHelper("getAllCardsAssignedToMember");
			Trello.get(getUri, hh.success, hh.error);
			return hh.getPromise();
		}
	};
});
	