function Input() {
	this.keyboardState = {};
	this.buttonState = {};

	this.buttonMap = null;

	this.events = [];
}

Input.prototype.init = function(buttonMap) {
	this.keydown = this.keyDown.bind(this);
	this.keyup = this.keyUp.bind(this);
	window.addEventListener('keydown', this.keydown, true);
	window.addEventListener('keyup', this.keyup, true);

	this.buttonMap = buttonMap;
}

Input.prototype.stop = function() {
	window.removeEventListener('keydown', this.keydown, true);
	window.removeEventListener('keyup', this.keyup, true);
}

Input.prototype.keyDown = function(key) {
	// console.log('pressed:', key.keyCode);
	
	if (key.keyCode in this.buttonMap) {
		if (!this.keyboardState[key.keyCode]) {
			this.events.push(this.buttonMap[key.keyCode]);
		}
		this.buttonState[this.buttonMap[key.keyCode]] = key.timeStamp;
		this.keyboardState[key.keyCode] = key.timeStamp;
	}
}

Input.prototype.keyUp = function(key) {
	// console.log('released:', key.keyCode);
	
	if (key.keyCode in this.buttonMap) {
		this.events.push(-this.buttonMap[key.keyCode]);
		this.buttonState[this.buttonMap[key.keyCode]] = 0;
		this.keyboardState[key.keyCode] = 0;
	}
}

Input.prototype.getInput = function() {
	return this.events;
}

Input.prototype.checkButtonPress = function(button) {
	return this.buttonState[button];
}