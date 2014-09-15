function State() {
	this.nextState = null;
	this.terminate = false;
}

State.prototype.init = function(gameWindow) {
	console.log('must be implemented');
}

State.prototype.process = function(input) {
	console.log('must be implemented');
}

State.prototype.draw = function(gameWindow) {
	console.log('must be implemented');
}

State.prototype.switchState = function(state) {
	this.nextState = state;
}

State.prototype.terminateState = function() {
	this.terminate = true;
}

State.prototype.reinit = function(gameWindow) {
	console.log('must be implemented');
}