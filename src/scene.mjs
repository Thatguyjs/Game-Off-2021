// Scene manager / switcher

import Game from "./game.mjs";
import LevelInfo from "./level.mjs";


function el(selector) {
	return document.querySelector(selector);
}

function els(selector) {
	return document.querySelectorAll(selector);
}


const scene_list = [
	"menu",
	"levels",
	"level",
	"level-fail"
];

let scene = "menu";

function set_scene(scene_name) {
	if(scene === scene_name) return; // Avoid unnecessary switching

	el(`#${scene}`).classList.add('hidden');
	scene = scene_name;
	el(`#${scene}`).classList.remove('hidden');
}


// Menu buttons
el('#play').addEventListener('click', () => {
	Game.load_level(0);
	set_scene('level');
});

el('#levels').addEventListener('click', () => {
	set_scene('levels');
});


// Level selection
for(let l in LevelInfo) {
	const container = document.createElement('div');
	const text = document.createElement('span');
	text.innerText = l === '0' ? 'Tutorial' : `Level ${l}`;

	container.appendChild(text);
	if(Game.unlocked_level >= +l) container.classList.add('unlocked');
	el('#levels-container').appendChild(container);

	container.addEventListener('click', () => {
		Game.load_level(+l);
		set_scene('level');
	});
}
