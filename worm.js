function Worm(player, gameArea) {
	var coords = randomSpawn(),
		rects = [],
		blocks = Block(),
		direction = [0, 0],
		distance = 0.0,
		alive = true,
		targets = [player],
		speed;

	var blockData = [
		{ color: '#484', x: coords[0]*BLOCK_SIZE, y: coords[1]*BLOCK_SIZE, width: BLOCK_SIZE, height: BLOCK_SIZE },
		{ color: '#484', x: coords[0]*BLOCK_SIZE, y: coords[1]*BLOCK_SIZE, width: BLOCK_SIZE, height: BLOCK_SIZE }
	];

	for (var i = 1; i < scope.level+scope.difficulty; i++) {
		blockData.push({ color: '#484', x: coords[0]*BLOCK_SIZE, y: coords[1]*BLOCK_SIZE, width: BLOCK_SIZE, height: BLOCK_SIZE });
	}

	blockData.forEach(function() {
		var rect = GameRect()
			.width(BLOCK_SIZE)
			.height(BLOCK_SIZE)
			.left(coords[0]*BLOCK_SIZE)
			.top(coords[1]*BLOCK_SIZE);
		rects.push(rect);
	})

	speed = calcSpeed();

	function worm() {
		var duration = 0;

		distance += speed;
		if (distance >= 1.0) {
			distance = 0.0;

			if (!(direction[0] || direction[1])) {
				removeSegment();
			}
			else {
				worm.move(direction);

				blockData.pop();
				blockData.unshift({
					color: '#484',
					x: coords[0]*BLOCK_SIZE,
					y: coords[1]*BLOCK_SIZE,
					width: BLOCK_SIZE,
					height: BLOCK_SIZE
				});

				rects.pop();
				var rect = GameRect()
					.width(BLOCK_SIZE)
					.height(BLOCK_SIZE)
					.topleft([coords[0]*BLOCK_SIZE, coords[1]*BLOCK_SIZE]);
				rects.unshift(rect);

				duration = Math.round(.9 * FRAME_TIME / speed);
			}

			speed = calcSpeed();

			blocks.data(blockData)(duration);
		}
	}
	worm.kill = function() {
		blocks.data([])();
		while (rects.length) { rects.pop(); };
	}
	worm.getRects = function() {
		return rects;
	}
	worm.size = function(bool) {
		if (!arguments.length) {
			return rects.length;
		}
		if (bool) {
			addSegment();
		}
		else {
			removeSegment();
		}
		return worm;
	}
	worm.checkCollision = function(objRect) {
		return rects.reduce(function(prev, rect) { return prev || rect.collide(objRect); }, false);
	}
	worm.update = function(player, item, gameRect) {
		var index = targets.indexOf(item);

		if (item.active() && index == -1) {
			if (Math.random() < (0.50 + scope.difficulty*0.20)) {
				targets.unshift(item);
			}
			else {
				targets.push(item);
			}
		}
		else if (!item.active() && index != -1) {
			targets.splice(index, 1);
		}

		var target = targets[0].rect(),
			head = rects[0],

			targetX = target.left(),
			targetY = target.top(),

			headX = head.left(),
			headY = head.top();

		var allowedDirections = checkDirections();

		if (!allowedDirections.length) {
			direction = [0, 0];
			return worm;
		}

		allowedDirections.sort(sortDirections);

		direction = allowedDirections[0];

		return worm;

		function sortDirections(a, b) {
			return rankDirection(b) - rankDirection(a);
		}
		function rankDirection(dir) {
			return (dir[0]*(targetX-headX) + dir[1]*(targetY-headY))
				* (dir[0] == direction[0] && dir[1] == direction[1] ? 2 : 1);
		}

		function checkDirections() {
			var directions = [[0,1],[0,-1],[1,0],[-1,0]];

			for (var i = directions.length-1; i >= 0; i--) {
				if (checkCollisions(directions[i])) {
					directions.splice(i, 1);
				}
			}
			return directions;
		}
		function checkCollisions(dir) {
			var tempRect = GameRect()
				.width(BLOCK_SIZE)
				.height(BLOCK_SIZE)
				.topleft([(coords[0]+dir[0])*BLOCK_SIZE, (coords[1]+dir[1])*BLOCK_SIZE]);

			if (!gameRect.collide(tempRect)) {
				return true;
			}
			if (worm.checkCollision(tempRect)) {
				return true;
			}
			if (dir[0]+direction[0] == 0 && dir[1]+direction[1] == 0) {
				return true;
			}
			return false;
		}
	}
	worm.alive = function(a) {
		if (!arguments.length) {
			return alive;
		}
		alive = a;
		return worm;
	}
	worm.svg = function(s) {
		if (!arguments.length) {
			return blocks.svg();
		}
		blocks.svg(s);
		return worm;
	}
	worm.direction = function(d) {
		if (!arguments.length) {
			return direction;
		}
		direction = d;
		return worm;
	}
	worm.move = function(m) {
		coords = [coords[0] + (m.x || m[0]),
				  coords[1] + (m.y || m[1])];
	}
	worm.getCoords = function() {
		return coords;
	}

	function randomSpawn() {
		var x = GAME_SIZE/2,
			y = GAME_SIZE/2;

		while( !( ((x === 0 || y === 0) && x !== y) || ((x === GAME_SIZE-1 || y === GAME_SIZE-1) && x !== y) ) )  {
			x = Math.floor(Math.random()*GAME_SIZE);
			y = Math.floor(Math.random()*GAME_SIZE);
		}
		return [x,y];
	}
	function calcSpeed() {
		return Math.ceil(1/(8+blockData.length-scope.difficulty)*10000)/10000;
	}
	function addSegment() {
		var rect = GameRect()
			.width(rects[0].width())
			.height(rects[0].height())
			.topleft(rects[0].topleft());
		rects.push(rect);

		var data = {
			color: '#484',
			x: rects[0].left(),
			y: rects[0].top(),
			width: BLOCK_SIZE,
			height: BLOCK_SIZE
		};
		blockData.push(data);
	}
	function removeSegment() {
		rects.pop();
		blockData.pop();
		alive = rects.length > 0;
	}
	return worm;
}