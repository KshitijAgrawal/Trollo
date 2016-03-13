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

.factory('TrelloApis', function ($q)
{
	return {
		authorize: function()
		{
			var authenticationSuccess = function() { console.log('Successful authentication'); };
			var authenticationFailure = function() { console.log('Failed authentication'); };
			Trello.authorize({
			  //type: popup,
			  name: 'Getting Started Application',
			  scope: {
				read: true,
				write: true },
			  //expiration: never,
			  success: authenticationSuccess,
			  error: authenticationFailure
			});
		},

		getAllCardsInAList: function(listId)
		{
			console.log('getAllCardsInAList...')
			var listUri = 'lists/' + listId + '/cards';

			var deferred = $q.defer();

			var success = function (getResponse) {
				console.log('success getResponse' + JSON.stringify(getResponse));
				deferred.resolve(getResponse);
			}
			var error = function(getResponse) {
				console.log('error getResponse' + JSON.stringify(getResponse));
				deferred.reject(getResponse);
			}

			var getResponse = Trello.get(listUri, success, error);
			return deferred.promise;
		},

		deleteACard: function(cardId)
		{
			console.log('deleteACard...')
			var deleteUri = 'cards/' + cardId;

			var deferred = $q.defer();

			var success = function (deleteResponse) {
				console.log('success deleteResponse' + JSON.stringify(deleteResponse));
				deferred.resolve(deleteResponse);
			}
			var error = function(deleteResponse) {
				console.log('error deleteResponse' + JSON.stringify(deleteResponse));
				deferred.reject(deleteResponse);
			}

			var deleteResponse = Trello.delete(deleteUri, success, error);
			return deferred.promise;
		},

		createANewcard: function(newCard)
		{
			console.log('createANewcard...')
			var createUri = 'cards/';

			var deferred = $q.defer();

			var success = function (createResponse) {
				console.log('success createResponse' + JSON.stringify(createResponse));
				deferred.resolve(createResponse);
			}
			var error = function(createResponse) {
				console.log('error createResponse' + JSON.stringify(createResponse));
				deferred.reject(createResponse);
			}

			var createResponse = Trello.post(createUri, newCard, success, error);
			return deferred.promise;
		},

		modifyACard: function(cardId, newCard)
		{
			console.log('modifyACard...')
			var putUri = 'cards/'+ cardId;

			var deferred = $q.defer();

			var success = function (putResponse) {
				console.log('success putResponse' + JSON.stringify(putResponse));
				deferred.resolve(putResponse);
			}
			var error = function(putResponse) {
				console.log('error putResponse' + JSON.stringify(putResponse));
				deferred.reject(putResponse);
			}

			var putResponse = Trello.put(putUri, newCard, success, error);
			return deferred.promise;

		},

		getMember: function(memberIdOrUsername)
		{
			console.log('getMember...')
			var getUri = 'members/'+ memberIdOrUsername;

			var deferred = $q.defer();

			var success = function (getResponse) {
				console.log('success getResponse' + JSON.stringify(getResponse));
				deferred.resolve(getResponse);
			}
			var error = function(getResponse) {
				console.log('error getResponse' + JSON.stringify(getResponse));
				deferred.reject(getResponse);
			}

			var getResponse = Trello.put(getUri, success, error);
			return deferred.promise;
		},

		getAllBoardsForMember: function(memberIdOrUsername)
		{
			console.log('getAllBoardsForMember...')
			var getUri = 'members/'+ memberIdOrUsername + '/boards';

			var deferred = $q.defer();

			var success = function (getResponse) {
				console.log('success getResponse' + JSON.stringify(getResponse));
				deferred.resolve(getResponse);
			}
			var error = function(getResponse) {
				console.log('error getResponse' + JSON.stringify(getResponse));
				deferred.reject(getResponse);
			}

			var getResponse = Trello.get(getUri, success, error);
			return deferred.promise;
		}

	};
});
