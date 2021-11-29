import Game from "./game.mjs";


const GameStorage = {
	set_state(obj) {
		Game.unlocked_level = obj.unlocked_level ?? 1;
	},

	get_state() {
		return {
			unlocked_level: Game.unlocked_level
		};
	},

	load_save() {
		const data = localStorage.getItem("game-save").split(';');
		let obj = {};

		for(let d in data) {
			const [type, key, value] = data[d].split(':');

			if(type === 'number') value = +value; // Only Numbers and Strings are supported
			obj[key] = value;
		}

		this.set_state(obj);
	},

	save() {
		const state = this.get_state();
		let save_str = "";

		for(let s in state)
			save_str += `${typeof state[s]}:${s}:${state[s]};`;

		localStorage.setItem("game-save", save_str.slice(0, -1));
	}
};


export default GameStorage;
