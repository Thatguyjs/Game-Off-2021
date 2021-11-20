import Vec2 from "./include/vec2.mjs";
import Player from "./player.mjs";


const Game = {
	program_info: null, // TWGL program info

	paused: false,
	player: null,

	init(program_info) {
		this.player = new Player(window.innerWidth / 2, window.innerHeight / 2);
	}
};
