function Menu(list) {
	State.call(this);

	this.title = list.shift();
	this.titleText = Font();

	this.menuList = list;
	this.menuText = Font();

	this.index = 0;

	var small = 24,
		medium = 48,
		large = 72,
		gap = 10;

	this.init = function(gameWindow) {
		var titleData = [{ text: this.title, color: '#484', size: large, x: -1, y: 150, bold: true }];
		this.titleText
			.data(titleData)
			.svg(gameWindow.group('title'));

		this.menuText
			.svg(gameWindow.group('menu-list'));
	}

	this.reinit = function(gameWindow) {

	}

	this.process = function(input) {
		var button,
			index = this.index;

		while (input.length) {
			button = input.shift();

			if (button == MOVE_UP) {
				this.index -= 1;
			}
			else if (button == MOVE_DOWN) {
				this.index += 1;
			}
			else if (button == ENTER) {
				this.makeSelection();
			}

			this.index = this.index < 0 ? this.index+this.menuList.length : this.index%this.menuList.length;
		}
	}

	this.draw = function(gameWindow) {
		this.titleText();

		var data = [];

		var offset = 200;

		for (var i = 0; i < this.menuList.length; i++) {
			var size = i == this.index ? medium : small;

			offset += size+gap;

			var obj = {
				text: list[i],
				color: i == this.index ? '#fff' : '#666',
				size: size,
				x: -1,
				y: offset,
				bold: i == this.index
			};

			data.push(obj);
		}

		this.menuText.data(data)();

		this.redraw = false;
	}
}
Menu.prototype = Object.create(State.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.makeSelection = function() {
	console.log('must be implemented');
}

function StartMenu() {
	Menu.call(this, ['Worm ATTACK!', 'start', 'options', 'exit'])

	this.makeSelection = function() {
		switch(this.menuList[this.index]) {
			case 'start':
				this.switchState(new WormAttack());
				this.terminateState();
				break;
			case 'options':
				this.switchState(new OptionsMenu());
				break;
			case 'exit':
				this.terminateState();
				break;
		}
	}
}
StartMenu.prototype = Object.create(Menu.prototype);
StartMenu.prototype.constructor = StartMenu;

function OptionsMenu() {
	var list = ['Options', 'return', 'difficulty: '+scope.getDifficulty()];
	Menu.call(this, list)

	this.process = function(input) {
		this.nextState = null;

		var button;
		while (input.length) {
			button = input.shift();

			if (button == MOVE_UP) {
				this.index -= 1;
			}
			else if (button == MOVE_DOWN) {
				this.index += 1;
			}
			else if (button == ENTER) {
				this.makeSelection();
			}
			else if (button == MOVE_LEFT) {
				this.changeOption(-1);
			}
			else if (button == MOVE_RIGHT) {
				this.changeOption(1);
			}

			this.index = this.index < 0 ? this.index+this.menuList.length : this.index%this.menuList.length;
		}
	}

	this.makeSelection = function() {
		switch(this.menuList[this.index]) {
			case 'return':
				this.terminateState();
				break;
		}
	}

	this.changeOption = function(amount) {
		var regex = /^(\w+):/,
			match = this.menuList[this.index].match(regex),
			selection = match ? match.pop() : null;

		switch(selection) {
			case 'difficulty':
				this.changeDifficulty(amount);
				break;
		}
	}

	this.changeDifficulty = function(amount) {
		scope.difficulty = Math.max(0, Math.min(scope.difficulties.length-1, scope.difficulty+amount));

		this.menuList[this.index] = 'difficulty: '+scope.getDifficulty();
	}
}
OptionsMenu.prototype = Object.create(Menu.prototype);
OptionsMenu.prototype.constructor = OptionsMenu;

function PauseMenu() {
	Menu.call(this, ['Pause Menu', 'return', 'exit']);

	this.MenuDraw = this.draw;

	this.draw = function(gameWindow) {
		if (this.nextState) {
			gameWindow.clear();
			return;
		}
		if (this.terminate) {
			gameWindow.remove('#title');
			gameWindow.remove('#menu-list');
			return;
		}
		this.MenuDraw(gameWindow);
	}

	this.makeSelection = function() {
		switch(this.menuList[this.index]) {
			case 'return':
				this.terminateState();
				break;
			case 'exit':
				this.switchState(new StartMenu());
				this.terminateState();
				break;
		}
	}
}
PauseMenu.prototype = Object.create(Menu.prototype);
PauseMenu.prototype.constructor = PauseMenu;

function DeadMenu() {
	Menu.call(this, ['Yer dead :(', 'start', 'options', 'exit']);

	this.MenuDraw = this.draw;

	this.draw = function(gameWindow) {
		if (this.terminate) {
			gameWindow.clear();
			return;
		}
		this.MenuDraw(gameWindow);
	}

	this.makeSelection = function() {
		switch(this.menuList[this.index]) {
			case 'start':
				this.switchState(new Scroller());
				this.terminateState();
				break;
			case 'options':
				this.switchState(new OptionsMenu());
				break;
			case 'exit':
				this.switchState(new StartMenu());
				this.terminateState();
				break;
		}
	}
}
DeadMenu.prototype = Object.create(Menu.prototype);
DeadMenu.prototype.constructor = DeadMenu;