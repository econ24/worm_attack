function Scroller() {
	State.call(this);

	var gameArea = null,
		gameAreaData = { transform: 'translate('+(BLOCK_SIZE*GAME_SIZE/2)+', '+BLOCK_SIZE+')' },

		statusBar = null,
		statusBarData = { transform: 'translate('+BLOCK_SIZE*2+', '+BLOCK_SIZE*2+')' },

		player = null,
		playerDeath,
		worm = null,
		item = null,
		bombs,

		gameRect = null;

	this.init = function(gameWindow) {
		gameWindow.clear();
		scope.level = 1;

		var blocksData = [],
			linesData = [];

		for (var x = 0; x < GAME_SIZE; x++) {
			if (x > 1 && x < GAME_SIZE-1) {
				var line = { x1: x*BLOCK_SIZE, x2: x*BLOCK_SIZE, y1: 0, y2: GAME_SIZE*BLOCK_SIZE, color: '#111' };
				linesData.push(line);
				line = { x1: 0, x2: GAME_SIZE*BLOCK_SIZE, y1: x*BLOCK_SIZE, y2: x*BLOCK_SIZE, color: '#111' };
				linesData.push(line);
			}

			for (var y = 0; y < GAME_SIZE; y++) {
				if (x==0 || x==GAME_SIZE-1 || y==0 || y==GAME_SIZE-1) {
					var data = { x: x*BLOCK_SIZE, y: y*BLOCK_SIZE, width: BLOCK_SIZE, height: BLOCK_SIZE, color: '#333' };
					blocksData.push(data);
				}
			}
		}

		gameArea = GameArea()
			.svg(gameWindow.group('game-area', gameAreaData))
			.lines(linesData)
			.blocks(blocksData);

		statusBar = StatusBar()
			.svg(gameWindow.group('status-bar', statusBarData));

		item = GameItem()
			.svg(gameWindow.group('item-group', gameAreaData));

		bombs = Bomb()
			.svg(gameWindow.group('bomb-group', gameAreaData));

		player = Player()
			.svg(gameWindow.group('player-group', gameAreaData));

		worm = Worm(player, gameArea)
			.svg(gameWindow.group('worm-group', gameAreaData));

		gameRect = GameRect()
			.topleft([BLOCK_SIZE, BLOCK_SIZE])
			.width((GAME_SIZE-2)*BLOCK_SIZE)
			.height((GAME_SIZE-2)*BLOCK_SIZE);

		gameArea();
	}

	this.reinit = function(gameWindow) {
		gameWindow.fade(null);
	}

	this.process = function(input) {
		while (input.length) {
			switch (input.shift()) {
				case OPEN_MENU_DOWN:
					this.switchState(new PauseMenu());
					break;
				case MOVE_LEFT_DOWN:
					player.direction([-1, 0]);
					break;
				case MOVE_RIGHT_DOWN:
					player.direction([1, 0]);
					break;
				case MOVE_UP_DOWN:
					player.direction([0, -1]);
					break;
				case MOVE_DOWN_DOWN:
					player.direction([0, 1]);
					break;
				case DROP_BOMB_DOWN:
					var coords;
					if (coords = player.dropBomb()) {
						bombs.drop(coords);
					};
					break;
			}
		}
		worm.update(player, item, gameRect);
	}

	this.draw = function(gameWindow) {
		statusBar(player);

		item(gameRect, worm);
		bombs();

		player();
		if (!gameRect.collide(player.rect())) {
			this.transition(gameWindow, DEATH_BY_WALL, true);
			return;
		}
		if (worm.checkCollision(player.rect())) {
			this.transition(gameWindow, DEATH_BY_WORM, true);
			return;
		}

		if (item.active() && player.checkCollision(item.rect())) {
			player.bombs(1);
			item.active(false);
		}

		worm();
		bombs.checkCollision(worm);

		if (worm.checkCollision(player.rect())) {
			player.alive(false);
		}
		if (item.active() && worm.checkCollision(item.rect())) {
			worm.size(true);
			item.active(false);
		}

		if (!worm.alive()) {
			scope.level += 1;
			player.bombs([3,2,1][scope.difficulty])
			worm.kill();
			worm = Worm(player, gameArea)
				.svg(gameWindow.group('worm-group'))
			this.transition(gameWindow, LEVEL_CLEARED, false);
		}
	}

	this.transition = function(gameWindow, type, terminate) {
		gameWindow.fade(0.5, 1000);
		this.switchState(new TransitionScreen(type));
		if (terminate) {
			this.terminateState();
			player.alive(false);
		}
console.log(player.alive())
	}
}
Scroller.prototype = Object.create(State.prototype);
Scroller.prototype.constructor = Scroller;

function StatusBar() {
	var svg,
		bombData = {},
		levelData = {},
		data = [levelData, bombData],
		font = Font();

	function bar(player) {
		bombData['fill'] = '#008';
		bombData['text'] = 'Bombs: ' + player.bombs() + ' / ' + scope.maxBombs();
		bombData['x'] = 0;
		bombData['y'] = 50;
		bombData['size'] = 24;

		levelData['fill'] = '#008';
		levelData['text'] = 'Level ' + scope.level;
		levelData['x'] = 0;
		levelData['y'] = 0;
		levelData['size'] = 24;

		font.data(data)();
	}
	bar.svg = function(s) {
		if (!arguments.length) {
			return font.svg();
		}
		font.svg(s);
		return bar;
	}

	return bar;
}

function GameArea() {
	var blocksData, linesData, svg, rect,
		lines = Line(),
		blocks = Block();

	function area() {
		lines.svg(svg).data(linesData)();
		blocks.svg(svg).data(blocksData)();
	}
	area.outOfBounds = function(player) {

	}
	area.rect = function(r) {
		if (!arguments.length) {
			return rect;
		}
		rect = r;
		return area;
	}
	area.lines = function(l) {
		if (!arguments.length) {
			return linesData;
		}
		linesData = l;
		return area;
	}
	area.blocks = function(b) {
		if (!arguments.length) {
			return blocksData;
		}
		blocksData = b;
		return area;
	}
	area.svg = function(s) {
		if (!arguments.length) {
			return svg;
		}
		svg = s;
		return area;
	}

	return area;
}

function TransitionScreen(type) {
	State.call(this);

	var font, 
		TRANSITION_TEXT = {},
		paused = true;

	TRANSITION_TEXT[DEATH_BY_WALL] = [
		'You face planted#into the wall!',
		'You became one#with the wall!',
		'Your face#is now like a#wall-patty...',
		'OUCH!!!#I felt that one!'
	];
	TRANSITION_TEXT[DEATH_BY_WORM] = [
		'You were chomped#by the worm!', 
		'You became#worm food...',
		'The worm#just made you its#...lunch...',
		'Your doom#is a worm...'
	];
	TRANSITION_TEXT[LEVEL_CLEARED] = [
		'Way to go!!!',
		'Onward...#and#Upward!!!'
	];

	this.init = function(gameWindow) {
		var text = TRANSITION_TEXT[type][Math.floor(Math.random()*TRANSITION_TEXT[type].length)].split('#'),
			data = []
			offset = 0;

		text.forEach(function(txt) {
			offset += GAME_SIZE*BLOCK_SIZE/(text.length+1);
			var obj = {
				fill: '#800',
				x: -1,
				y: offset,
				size: 48,
				text: txt,
			}
			data.push(obj);
		})

		font = Font()
			.svg(gameWindow.group('death-text'))
			.data(data);

		setTimeout(function() { paused = false; }, 500);
	}
	this.draw = function(gameWindow) {
		font();
		if (this.terminate) {
			gameWindow.remove('#death-text');
			return;
		}
	}
	this.process = function(input) {
		if (input.length && !paused) {

			this.terminateState();

			if (type != LEVEL_CLEARED) {
				this.switchState(new DeadMenu());
			}
		}
		while (input.pop());
	}
}
TransitionScreen.prototype = Object.create(State.prototype);
TransitionScreen.prototype.constructor = TransitionScreen;