angular.module('starter.services', [])

.factory('Cards', function() {
  // Might use a resource here that returns a JSON array
  		var cards;
  return {
    all: function($scope) {
		console.log("all");	
		var cards1;
		var success = function(successMsg) {
			$scope.cards = JSON.parse(cards1["responseText"]);
			cards = $scope.cards;
			console.log("Trello.get success: "+JSON.stringify($scope.cards));		
		};
		var error = function(errorMsg) { return null;};		
		cards1 = Trello.get('lists/56c69aa345f99b2f521e36a5/cards', success, error);	
    },
    remove: function($scope, card) {
      $scope.cards.splice(cards.indexOf(card), 1);
	  cards = $scope.cards;
	  var cID = card.id;
	  Trello.delete('cards/'+cID,
	  function(){console.log("delete success");},
	  function(){console.log("delete error");});
    },
    get: function(cardId) {
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardId) {
          return cards[i];
        }
      }
      return null;
    },
    put: function($scope, newCard, cardId){
      var creationSuccess = function(data) {
        $scope.cards.splice(cards.indexOf(newCard), 1);
        $scope.cards.push(newCard);
        cards = $scope.cards;
        console.log('Card Saved successfully. Data returned:' + JSON.stringify(data));
      };
      console.log('PUT card');
      Trello.put('/cards/'+cardId, newCard, creationSuccess);
    },
	post: function($scope,inputcard)
	{
		var myList = '56c69aa345f99b2f521e36a5';
		var creationSuccess = function(data) {
		  $scope.cards.push(newCard);
	      cards = $scope.cards;
		  console.log('Card created successfully. Data returned:' + JSON.stringify(data));
		};
		var newCard = {
		  name: inputcard.name, 
		  desc: inputcard.desc,
		  // Place this card at the top of our list 
		  idList: myList,
		  pos: 'top'
		};
		Trello.post('/cards/', newCard, creationSuccess);
	}
  };
});
