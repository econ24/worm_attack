function Font() {
	var data, svg;

	function font() {
		var _font = svg.selectAll('text')
			.data(data);

		_font.exit().remove();

		_font.enter().append('text');

		_font
			.attr('font-weight', function(d) {
				return d.bold ? 'bold' : 'normal';
			})
			.text(function(d) { return d.text; })
			.attr('fill', function(d) { return d.color || '#fff'; })
			.attr('font-size', function(d) { return d.size || 12; })
			.attr('class', 'game-text')
			.attr('y', function(d) {
				if (d.y < 0) {
					return svg.datum().height/2;
				}
				return d.y || 0;
			})
			.attr('x', function(d) {
				if (d.x < 0) {
					var textWidth = this.offsetWidth,
						width = svg.datum().width;

					return width/2 - textWidth/2;
				}
				return d.x || 0;
			});
	}
	font.data = function(d) {
		if (!arguments.length) {
			return data;
		}
		data = d;
		return font;
	}
	font.svg = function(s) {
		if (!arguments.length) {
			return svg;
		}
		svg = s;
		return font;
	}

	return font;
}

function Block() {
	var data, svg;

	function block(duration) {
		var _block = svg.selectAll('rect')
			.data(data);

		_block.exit().remove();

		_block.enter().append('rect');

		duration = duration || 0;

		_block
			.attr('fill', function(d) { return d.color; })
			.attr('width', function(d) { return d.width; })
			.attr('height', function(d) { return d.height; })
			.transition().duration(duration).ease('linear')
			.attr('y', function(d) { return d.y; })
			.attr('x', function(d) { return d.x; });
	}
	block.data = function(d) {
		if (!arguments.length) {
			return data;
		}
		data = d;
		return block;
	}
	block.svg = function(s) {
		if (!arguments.length) {
			return svg;
		}
		svg = s;
		return block;
	}

	return block;
}

function Circle() {
	var data, svg;

	function circle(duration) {
		var _circle = svg.selectAll('circle')
			.data(data);

		_circle.exit().remove();

		_circle.enter().append('circle');

		duration = duration || 0;

		_circle
			.attr('fill', function(d) { return d.color; })
			.attr('r', function(d) { return d.radius; })
			.transition().duration(duration).ease('linear')
			.attr('cy', function(d) { return d.cy; })
			.attr('cx', function(d) { return d.cx; });
	}
	circle.data = function(d) {
		if (!arguments.length) {
			return data;
		}
		data = d;
		return circle;
	}
	circle.svg = function(s) {
		if (!arguments.length) {
			return svg;
		}
		svg = s;
		return circle;
	}

	return circle;
}

function Ring() {
	var data, svg;

	function ring(duration) {
		var _ring = svg.selectAll('circle')
			.data(data);

		_ring.exit().remove();

		_ring.enter().append('circle');

		duration = duration || 0;

		_ring
			.attr('fill', 'none')
			.attr('stroke', function(d) { return d.color; })
			.attr('stroke-width', function(d) { return d.thickness; })
			.transition().duration(duration).ease('linear')
			.attr('r', function(d) { return d.radius; })
			.attr('cy', function(d) { return d.cy; })
			.attr('cx', function(d) { return d.cx; });
	}
	ring.data = function(d) {
		if (!arguments.length) {
			return data;
		}
		data = d;
		return ring;
	}
	ring.svg = function(s) {
		if (!arguments.length) {
			return svg;
		}
		svg = s;
		return ring;
	}

	return ring;
}

function Line() {
	var data, svg;

	function line() {
		var _line = svg.selectAll('line')
			.data(data);

		_line.exit().remove();

		_line.enter().append('line');

		_line
			.attr('stroke-width', function(d) { return d.width || 1; })
			.attr('stroke', function(d) { return d.color; })
			.attr('x1', function(d) { return d.x1; })
			.attr('x2', function(d) { return d.x2; })
			.attr('y1', function(d) { return d.y1; })
			.attr('y2', function(d) { return d.y2; });
	}
	line.data = function(d) {
		if (!arguments.length) {
			return data;
		}
		data = d;
		return line;
	}
	line.svg = function(s) {
		if (!arguments.length) {
			return svg;
		}
		svg = s;
		return line;
	}

	return line;
}