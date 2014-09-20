function GameRect() {
	var top = 0,
		left = 0,
		width = BLOCK_SIZE,
		height = BLOCK_SIZE;

	var rect = {};
	
	rect.top = function(t) {
		if (!arguments.length) {
			return top;	
		}
		top = t;
		return rect;
	}
	rect.left = function(l) {
		if (!arguments.length) {
			return left;
		}
		left = l;
		return rect;
	}
	rect.width = function(w) {
		if (!arguments.length) {
			return width;
		}
		width = w;
		return rect;
	}
	rect.height = function(h) {
		if (!arguments.length) {
			return height;
		}
		height = h;
		return rect;
	}
	rect.right = function(r) {
		if (!arguments.length) {
			return left+width;
		}
		left = r-width;
		return rect;
	}
	rect.bottom = function(b) {
		if (!arguments.length) {
			return top+height;
		}
		top = b-height;
		return rect;
	}
	rect.topleft = function(tl) {
		if (!arguments.length) {
			return [top, left];
		}
		left = tl.left || tl[0];
		top = tl.top || tl[1];
		return rect;
	}
	rect.center = function(c) {
		if (!arguments.length) {
			return [left+BLOCK_SIZE/2, top+BLOCK_SIZE/2]
		}
		left = (c.x || c[0]) - BLOCK_SIZE/2;
		top = (c.y || c[1]) - BLOCK_SIZE/2;
		return rect;
	}
	rect.distance = function(pos) {
		return Math.sqrt(Math.pow(left+BLOCK_SIZE/2-pos[0], 2)+Math.pow(top+BLOCK_SIZE/2-pos[1], 2));
	}
	rect.move = function(m) {
		left += m.x || m[0];
		top += m.y || m[1];
	}
	rect.collide = function(r) {
        var xCollision = Math.abs(left-r.left())+Math.abs(rect.right()-r.right())-(width+r.width()) < 0;

        var yCollision = Math.abs(top-r.top())+Math.abs(rect.bottom()-r.bottom())-(height+r.height()) < 0;

        return xCollision && yCollision;
	}

	return rect;
}