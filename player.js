function Player() {
	var coords = [10, 10],
		rect = GameRect(),
		block = Block(),
		direction = [0, 0],
		speed = 0.125,
		distance = 0.0,
		alive = true,
		bombs = [5, 4, 3][scope.difficulty];

	rect.topleft([coords[0]*BLOCK_SIZE, coords[1]*BLOCK_SIZE])
		.width(BLOCK_SIZE)
		.height(BLOCK_SIZE);

	function player() {
		distance += speed;
		if (distance >= 1.0) {
			player.move(direction);
			distance = 0.0;

			rect.topleft([coords[0]*BLOCK_SIZE, coords[1]*BLOCK_SIZE]);

			var duration = .75 * FRAME_TIME / speed,

				data = [{
					color: '#880',
					x: coords[0]*BLOCK_SIZE,
					y: coords[1]*BLOCK_SIZE,
					width: BLOCK_SIZE,
					height: BLOCK_SIZE
				}];

			block.data(data)(duration);
		}
	}
	player.rect = function(r) {
		if (!arguments.length) {
			return rect;
		}
		rect = r;
		return player;
	}
	player.checkCollision = function(obj) {
		return rect.collide(obj);
	}
	player.bombs = function(b) {
		if (!arguments.length) {
			return bombs;
		}
		bombs = Math.min(scope.maxBombs(), bombs+b);
		return player
	}
	player.dropBomb = function() {
		if (bombs) {
			bombs--;
			return coords;
		}
		return null;
	}
	player.rect = function(r) {
		if (!arguments.length) {
			return rect;
		}
		rect = r;
		return player;
	}
	player.alive = function(a) {
		if (!arguments.length) {
			return alive;
		}
		alive = a;
		return player;
	}
	player.svg = function(s) {
		if (!arguments.length) {
			return block.svg();
		}
		block.svg(s);
		return player;
	}
	player.direction = function(d) {
		if (!arguments.length) {
			return direction;
		}
		direction = d;
		return player;
	}
	player.move = function(m) {
		coords = [coords[0] + (m.x || m[0]),
				  coords[1] + (m.y || m[1])];
	}
	return player;
}