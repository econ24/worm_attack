(function() {
	var scope = {};

	scope.difficulties = ['easy', 'normal', 'hard'];
	scope.difficulty = 1;
	scope.getDifficulty = function() {
		return scope.difficulties[scope.difficulty];
	}

	scope.maxBombs = function() {
		return [3, 4, 5][scope.difficulty];
	}

	scope.level = 1;

	this.scope = scope;
})()