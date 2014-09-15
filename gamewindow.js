function GameWindow() {}

GameWindow.prototype.init = function(svg) {
	this.svg = svg;
	this.width = svg.node().offsetWidth;
	this.height = svg.node().offsetHeight;
	svg.datum({ width: this.width, height: this.height });
}

GameWindow.prototype.fade = function(opacity, duration) {
	this.svg.selectAll('*')
		.transition()
		.duration(duration || 250)
		.style('opacity', opacity);
}

GameWindow.prototype.group = function(groupID, attr) {
	if (!document.getElementById(groupID)) {
		attr = attr || {};
		return this.svg.append('g')
			.attr('id', groupID)
			.attr(attr);
	}
	return this.svg.select('#'+groupID);
}

GameWindow.prototype.remove = function(group) {
	d3.selectAll(group).remove();
}

GameWindow.prototype.clear = function() {
	this.svg.selectAll('*').remove();
}