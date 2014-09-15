function Shell() {
	this.running = false;
	this.state = null;
	this.stateStack = [];
	this.interval = null;
	this.input = null;
	this.gameWindow = null;
}

Shell.prototype.init = function(state, svgID) {
	this.state = state;

	this.input = new Input();
	this.input.init(BUTTON_MAP);

	this.gameWindow = new GameWindow();
	this.gameWindow.init(d3.select(svgID));

	this.state.init(this.gameWindow);


}

Shell.prototype.start = function() {
	this.running = true;

	this.run();
	//this.interval = setInterval(this.run.bind(this), 20);
}

Shell.prototype.run = function() {
	var time = Date.now();

	this.state.nextState = null;

	var input = this.input.getInput();

	this.state.process(input);
	this.state.draw(this.gameWindow);

	this.checkNextState();

	if (!this.running) {
		this.stop();
	}
	else {
		time = Math.max(0, FRAME_TIME - (Date.now() - time));
		setTimeout(this.run.bind(this), time);
	}
}

Shell.prototype.checkNextState = function() {
	var next = this.state.nextState,
		terminate = this.state.terminate;

	if (next) {
		next.init(this.gameWindow);
	}

	if (next && terminate) {
		this.clearStack();
		this.state = next;
	}
	else if (next && !terminate) {
		this.stateStack.push(this.state);
		this.state = next;
	}
	else if (!next && terminate) {
		if (this.stateStack.length) {
			this.state = this.stateStack.pop();
			this.state.reinit(this.gameWindow);
		}
		else {
			this.running = false;
		}
	}
}

Shell.prototype.clearStack = function() {
	while (this.stateStack.length) { this.stateStack.pop(); };
}

Shell.prototype.stop = function() {
	//clearInterval(this.interval);

	this.clearStack();

	this.input.stop();

	this.gameWindow.clear();

	Font().svg(this.gameWindow.svg).data([{ text: 'Goodbye!', color: '#fff', size: 96, x: -1, y: -1 }])();
}