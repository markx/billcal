var app = angular.module('BillCalApp', ['ngRoute', 'ngTagsInput']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'pages/cal.html',
			controller: 'calController'
		})
		.when('/result', {
			templateUrl : 'pages/result.html',
			controller: 'calController'

		})
})

app.controller('calController', function($scope, $filter){
	$scope.people=[{name:'Ke'},{name:'Yang'}];
	$scope.items=[{name:null, amount:null , people:[]}];
	$scope.totalAmount;
	$scope.result=[];


	$scope.updateCheckbox = function(){
		$scope.people.forEach(function(person,index){
			$scope.items.forEach(function(item) {
			var involvedPeople = $filter('filter')(item.people, {index: index});
				if ( involvedPeople.length == 0 ){
					item.people.push({name:person.name, check:false, index:index});
				}
			})
		});

		$scope.items.forEach(function(item){
			item.people.forEach(function(person){
				var match = $filter('filter')($scope.people, {name: person.name});
				if(match.length == 0){
					item.people.splice(person.index, 1);
				}
			})

		})

	}
	$scope.updateItems = function(index){
		if(index == $scope.items.length-1){
			$scope.items.push({name:null , amount:null, people:[] });
		}

		if(index == $scope.items.length-2 && $scope.items[index].amount==null && $scope.items[index].name==null ){
			$scope.items.pop();
		}

		$scope.updateCheckbox();
		$scope.checkout();

	};


	$scope.checkout = function(){
		$scope.result=[];
		console.log("checkout!");
		var sharedAmount = $scope.totalAmount;
			console.log(sharedAmount);
		for(var i=0; i< $scope.people.length; i++){
			$scope.result.push({name: $scope.people[i].name, amount:0});
		}

		$scope.items.forEach(function(item,index){
		//each item
			//skip the last empty item
			if( index == $scope.items.length-1){
				return ;
			}
			sharedAmount-=item.amount;
			var peopleInvolved = $filter('filter')(item.people, {check: true} );
			var amountPerPerson = item.amount/peopleInvolved.length;
			//each person
			peopleInvolved.forEach(function(person){
				$scope.result[person.index].amount += amountPerPerson;
			})
		});

			console.log(sharedAmount);
		$scope.result.forEach(function(person) {
			person.amount += sharedAmount/$scope.people.length;
		})
		console.log($scope.result);
		// return falddse;
	}


  $scope.$on('$viewContentLoaded', function(){
	  	$scope.updateCheckbox();
  });
})