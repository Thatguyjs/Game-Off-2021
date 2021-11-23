// Contains info for each level

import Vec2 from "./include/vec2.mjs";


function wall(x, y, width, height) {
	return { x, y, width, height };
}

function create_void(x, y, size, range, strength) {
	return { x, y, size, range, strength };
}

const width = window.innerWidth;
const height = window.innerHeight;


const LevelInfo = [
	{
		name: "Level 1",
		player_start: {
			position: new Vec2(150, 150),
			velocity: new Vec2(),
			rotation: 135
		},
		walls: [
			wall(width / 2 - 200, height / 2 - 125, 12, 250),
			wall(width / 2 + 188, height / 2 - 125, 12, 250),
			wall(width / 2 - 125, height / 2 - 200, 250, 12),
			wall(width / 2 - 125, height / 2 + 188, 250, 12)
		],
		voids: [
			create_void(width / 2, height / 2, 50, 200, 0.02)
		]
	},

	{
		name: "Level 2"
	}
];


export default LevelInfo;
