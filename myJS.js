window.onload = myFunc;

function myFunc() {
	d3.select('#game-window')
		.attr('width', BLOCK_SIZE*(GAME_SIZE*2))
		.attr('height', BLOCK_SIZE*(GAME_SIZE+2));

	var menu = new StartMenu(),
		shell = new Shell();

	shell.init(menu, '#game-window');

	shell.start();
}