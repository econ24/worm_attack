function GameItem() {
	var coords = [5, 5],
		rect = GameRect(),
		circle = Circle(),
		active = false,
		time = Date.now(),
		duration = randomTime(),
		data = [];

	circle.data(data);

	rect.width(BLOCK_SIZE)
		.height(BLOCK_SIZE);

	function item(gameRect, worm) {
		item.update(gameRect, worm);
		circle.data(data)();
	}
	item.rect = function(r) {
		if (!arguments.length) {
			return rect;
		}
		rect = r;
		return item;
	}
	item.svg = function(s) {
		if (!arguments.length) {
			return circle.svg();
		}
		circle.svg(s);
		return item;
	}
	item.active = function(a) {
		if (!arguments.length) {
			return active;
		}
		if (active && !a) {
			despawn();
		}
		return item;
	}
	item.update = function(gameRect, worm) {
		if (!active) {
			if (Date.now() - time > duration) {
				spawn(gameRect, worm);
			}
		}
		return item;
	}
	item.checkCollision = function(obj) {
		return active && rect.collide(obj);
	}

	function randomTime() {
		return 4000 + Math.round(Math.random() * 4000);
	}
	function spawn(gameRect, worm) {
		var coords = worm.getCoords();
		rect.topleft([coords[0]*BLOCK_SIZE, coords[1]*BLOCK_SIZE]);

		var minDistance = BLOCK_SIZE*(14-scope.difficulty*2),
			maxTries = 50;

		while (rect.distance(worm.getRects()[0].center()) < minDistance && maxTries--) {
			rect.left(Math.round((Math.random()*(gameRect.width()/BLOCK_SIZE-4)+2))*BLOCK_SIZE);
			rect.top(Math.round((Math.random()*(gameRect.height()/BLOCK_SIZE-4)+2))*BLOCK_SIZE);
		}

		data.push({
			color: '#008',
			cx: rect.left()+BLOCK_SIZE/2,
			cy: rect.top()+BLOCK_SIZE/2,
			radius: BLOCK_SIZE/2.5
		});
		active = true;
	}
	function despawn() {
		while (data.length) { data.pop(); };
		duration = randomTime();
		time = Date.now();
		active = false;
	}
	return item;
}

function Bomb() {
	var ring = Ring(),
		data = [],
		svg;

	function bomb() {
		bomb.update();
		ring.data(data)();
	}
	bomb.checkCollision = function(worm) {
		var rects = worm.getRects();

		for (var i = data.length-1; i >= 0; i--) {
			if (data[i].stage == 1) {
				var distances = rects.map(function(rect) { return rect.distance(data[i].center); });

				var collide = distances.reduce(function(prev, dist) { return prev || dist <= data[i].radius; }, false);

				if (collide) {
					data.splice(i, 1);
					worm.size(false);					
				}

			}
		}
	}
	bomb.drop = function(coords) {
		var obj = {
			stage: 0,
			duration: 1500,
			time: Date.now(),
			radius: 5,
			thickness: 5,
			cx: coords[0]*BLOCK_SIZE+BLOCK_SIZE/2,
			cy: coords[1]*BLOCK_SIZE+BLOCK_SIZE/2,
			color: '#800'
		};
		obj.center = [obj.cx, obj.cy];
		data.push(obj);
		return bomb;
	}
	bomb.svg = function(s) {
		if (!arguments.length) {
			return ring.svg();
		}
		ring.svg(s);
		return bomb;
	}

	bomb.update = function() {
		data.forEach(function (bomb, i) {
			if (Date.now()-bomb.time > bomb.duration) {
				bomb.stage += 1;
				bomb.time = Date.now();
				bomb.duration = 3000;
			}
			if (bomb.stage === 1) {
				bomb.radius += .25;
			}
		})

		data.sort(function (a, b) { return a.stage-b.stage; });

		for (var i = data.length-1; i >= 0; i--) {
			if (data[i].stage === 2) {
				data.pop();
			}
		}
	}

	return bomb;
}