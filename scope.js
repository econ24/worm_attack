(function() {
	var scope = {};

	scope.difficulties = ['easy', 'normal', 'hard'];
	scope.difficulty = 1;
	scope.getDifficulty = function() {
		return scope.difficulties[scope.difficulty];
	}

	scope.maxBombs = function() {
		return [5, 4, 3][scope.difficulty];
	}

	scope.level = 1;

	this.scope = scope;
})()