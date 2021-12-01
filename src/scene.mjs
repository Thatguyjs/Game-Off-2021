// Scene manager / switcher

import Game from "./game.mjs";
import LevelInfo from "./level.mjs";


function el(selector) {
	return document.querySelector(selector);
}

function els(selector) {
	return document.querySelectorAll(selector);
}


let scene_callbacks = {};

let scene = "menu";

function set_scene(scene_name) {
	if(scene === scene_name) return; // Avoid unnecessary switching

	el(`#${scene}`).classList.add('hidden');
	scene = scene_name;
	el(`#${scene}`).classList.remove('hidden');

	const callbacks = scene_callbacks[scene] ?? [];

	for(let c in callbacks)
		callbacks[c]();
}


// Navigation buttons
els('.nav-menu').forEach(e => {
	e.addEventListener('click', () => {
		set_scene('menu');
	});
});

els('.nav-play').forEach(e => {
	e.addEventListener('click', () => {
		Game.load_level(Game.unlocked_level);
		set_scene('level');
	});
});

els('.nav-levels').forEach(e => {
	e.addEventListener('click', () => {
		set_scene('levels');
	});
});

el('#restart-game').addEventListener('click', () => {
	Game.unlocked_level = 0;
	Game.level = 0;
});


// Level selection
for(let l in LevelInfo) {
	const container = document.createElement('div');
	const text = document.createElement('span');
	text.innerText = LevelInfo[l].name;

	container.appendChild(text);
	container.classList.add('level');
	if(Game.unlocked_level >= +l) container.classList.add('unlocked');
	el('#levels-container').appendChild(container);

	container.addEventListener('click', () => {
		if(+l > Game.unlocked_level) {
			alert("You haven't unlocked this level yet!");
			return;
		}

		Game.load_level(+l);
		set_scene('level');
	});
}


export default {
	get_scene() {
		return scene;
	},

	set_scene,

	on_scene(scene_name, callback) {
		if(!scene_callbacks[scene_name])
			scene_callbacks[scene_name] = [];

		scene_callbacks[scene_name].push(callback);
	}
};
