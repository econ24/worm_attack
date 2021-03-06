BLOCK_SIZE = 24;
GAME_SIZE = 27;

FPS = 45;
FRAME_TIME = Math.round(1000 / FPS);

DEATH_BY_WALL	= 0
DEATH_BY_WORM	= 1
LEVEL_CLEARED	= 2

MOVE_LEFT		= 1;
MOVE_RIGHT		= 2;
MOVE_UP			= 4;
MOVE_DOWN		= 8;
DROP_BOMB		= 16;
OPEN_MENU		= 32;
ENTER			= 64;
ACTIVATE_BOOST  = 128;

BUTTON_MAP = {
	37: MOVE_LEFT,
	65: MOVE_LEFT,
	39: MOVE_RIGHT,
	68: MOVE_RIGHT,
	38: MOVE_UP,
	87: MOVE_UP,
	40: MOVE_DOWN,
	83: MOVE_DOWN,
	66: ACTIVATE_BOOST,
	27: OPEN_MENU,
	13: ENTER,
	32: DROP_BOMB
};