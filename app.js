angular.module('flapperNews', ['ui.router'])
.factory('posts', [function(){
	var o = {
		posts: []
	}
	return o;
}])
.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
	// $scope.test = '';
	// $scope.posts = [
	// 	{title: 'post 1', link: 'http://www.google.com', upvotes: 5},
	// 	{title: 'post 2', upvotes: 2},
	// 	{title: 'post 3', link: 'http://www.google.com', upvotes: 15},
	// 	{title: 'post 4', upvotes: 9},
	// 	{title: 'post 5', link: 'http://www.google.com', upvotes: 4}
	// ];
	$scope.posts = posts.posts;
	$scope.addPost = function(){
		if(!$scope.title || $scope.title === ''){
			return;
		}
		$scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
		$scope.title = '';
	};
	$scope.incrementUpvotes = function(post){
		post.upvotes += 1;
	};
	$scope.decrementUpvotes = function(post){
		post.upvotes -= 1;
	};
}]);