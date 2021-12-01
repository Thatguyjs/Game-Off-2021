import Vec2 from "./include/vec2.mjs";

import Scene from "./scene.mjs";
import LevelInfo from "./level.mjs";
import GameStorage from "./storage.mjs";

import VoidInfo from "./void.mjs";
import Player from "./player.mjs";
import Bug from "./bug.mjs";

const level_display = document.getElementById('level-display');


const Game = {
	gl: null,
	color_program: null,
	pass_program: null,
	void_program: null,
	uniforms: null,

	level: 0,
	unlocked_level: 0, // Last unlocked level
	paused: false,

	player: null,
	player_attribs: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: null },
		indices: [0, 1, 3, 0, 2, 3]
	},

	bugs: [],
	level_bugs: 0, // Amount of bugs already spawned in the level

	walls: [],
	wall_attribs: {
		position: { numComponents: 2, data: [] },
		color: { numComponents: 4, data: [] },
		indices: []
	},

	// Voids are stored in VoidInfo
	void_attribs: {
		position: { numComponents: 2, data: [] },
		size: { numComponents: 1, data: [] }
	},

	level_pass: null,
	completion: 0,
	pass_attribs: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: null },
		completion: { numComponents: 1, data: null },
		indices: [0, 1, 2, 1, 2, 3]
	},

	health_attribs: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: null },
		indices: []
	},

	init(gl, programs, uniforms) {
		this.gl = gl;
		this.color_program = programs.color;
		this.pass_program = programs.pass;
		this.void_program = programs.void;
		this.uniforms = uniforms;

		this.player = new Player();
		this.player_attribs.position.data = this.player.get_points();
		this.player_attribs.color.data = (new Float32Array(16)).fill(1.0);

		this.load_level(this.unlocked_level);
	},

	load_level(ind) {
		this.level = ind;

		if(ind >= LevelInfo.length) {
			Scene.set_scene('game-win');
			return;
		}

		this.player.position = LevelInfo[ind].player_start.position.copy();
		this.player.velocity = LevelInfo[ind].player_start.velocity.copy();
		this.player.rotation = LevelInfo[ind].player_start.rotation;

		this.walls = LevelInfo[ind].walls;
		VoidInfo.voids = LevelInfo[ind].voids;
		this.level_pass = LevelInfo[ind].level_pass;

		level_display.innerText = ind === 0 ? "Tutorial" : `Level ${ind}`;

		this.level_bugs = 0;
		this.bugs = [];

		clearInterval(this.spawn_bug);
		this.update_level();
	},

	// Construct level attributes for rendering
	update_level() {
		// Walls
		this.wall_attribs.position.data = [];
		this.wall_attribs.color.data = [];
		this.wall_attribs.indices = [];

		const wall_num = this.walls.length;

		for(let w = 0; w < wall_num; w++) {
			const wall = this.walls[w];

			this.wall_attribs.position.data.push(
				wall.x, wall.y,
				wall.x + wall.width, wall.y,
				wall.x, wall.y + wall.height,
				wall.x + wall.width, wall.y + wall.height
			);

			this.wall_attribs.color.data.push(
				1, 1, 1, 1,
				1, 1, 1, 1,
				1, 1, 1, 1,
				1, 1, 1, 1
			);

			this.wall_attribs.indices.push(
				w * 4, w * 4 + 1, w * 4 + 2,
				w * 4 + 1, w * 4 + 2, w * 4 + 3
			);
		}

		// Voids
		this.void_attribs.position.data = [];
		this.void_attribs.size.data = [];

		const void_num = VoidInfo.voids.length;

		for(let v = 0; v < void_num; v++) {
			this.void_attribs.position.data.push(VoidInfo.voids[v].x, VoidInfo.voids[v].y);
			this.void_attribs.size.data.push(VoidInfo.voids[v].size);
		}

		// Level pass
		this.pass_attribs.position.data = new Float32Array([
			this.level_pass.x, this.level_pass.y,
			this.level_pass.x + this.level_pass.width, this.level_pass.y,
			this.level_pass.x, this.level_pass.y + this.level_pass.height,
			this.level_pass.x + this.level_pass.width, this.level_pass.y + this.level_pass.height
		]);

		this.pass_attribs.color.data = new Float32Array([
			0, 0.7, 0.2, 1,
			0, 0.7, 0.2, 1,
			0, 0.7, 0.2, 1,
			0, 0.7, 0.2, 1
		]);

		this.pass_attribs.completion.data = new Float32Array([0, 0, 0, 0]);

		// Start spawning bugs
		setInterval(this.spawn_bug, 1500);
	},

	// Create a new bug
	spawn_bug() {
		if(this.level_bugs >= (this.level + 1) * 2 - 1)
			return;

		this.bugs.push(new Bug(new Vec2(Math.random() * window.innerWidth, Math.random() * window.innerHeight)));
		this.level_bugs++;
	},

	// Assigns a bug to the player if once is close enough
	pickup_bug() {
		const player_pos = this.player.position;

		for(let b in this.bugs) {
			const bug_pos = this.bugs[b].position;

			if(bug_pos.x > player_pos.x - 30 && bug_pos.x < player_pos.x + 30 &&
				bug_pos.y > player_pos.y - 30 && bug_pos.y < player_pos.y + 30) {
				this.player.bug = this.bugs[b];
				// this.player.modifier = this.player.random_modifier();
			}
		}
	},

	// Drop the bug that the player has, copy the player's velocity to the bug
	drop_bug() {
		if(!this.player.bug) return;

		this.player.bug.velocity = this.player.velocity.copy().mult(2.4);
		this.player.bug = null;
	},

	update(time) {
		if(this.player.dead) {
			this.load_level(0);
			this.player.dead = false;
			return false;
		}

		this.uniforms.time = time;

		this.player.update(this.walls, VoidInfo.voids);

		let all_bugs_dead = true;

		for(let b in this.bugs) {
			if(!this.bugs[b].dead) {
				all_bugs_dead = false;
				break;
			}
		}

		if(this.player.is_passing(this.level_pass)) { // this.player.is_passing(this.level_pass) && this.bugs.length >= this.level_bugs && all_bugs_dead) {
			if(this.completion < 1)
				this.completion += 0.01;
			else {
				this.unlocked_level = this.level + 1;
				GameStorage.save();
				this.load_level(++this.level);
			}
		}
		else this.completion = 0;

		for(let b in this.bugs)
			this.bugs[b].update();

		this.pass_attribs.completion.data = new Float32Array([this.completion]);
		return true;
	},

	render() {
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.gl.useProgram(this.color_program.program);
		twgl.setUniforms(this.color_program, this.uniforms);

		// Render the player
		this.player_attribs.position.data = this.player.get_points();
		const pl_buffers = twgl.createBufferInfoFromArrays(this.gl, this.player_attribs);

		twgl.setBuffersAndAttributes(this.gl, this.color_program, pl_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, pl_buffers);

		// Render the bugs
		const bug_num = this.bugs.length;

		let total_attrs = {
			position: { numComponents: 2, data: [] },
			color: { numComponents: 4, data: new Float32Array(bug_num * 16) },
			indices: []
		};

		total_attrs.color.data.fill(0.5);

		for(let b = 0; b < bug_num; b++) {
			if(this.bugs[b].dead) continue;
			total_attrs.position.data.push(...this.bugs[b].get_points());
			total_attrs.indices.push(b * 4, b * 4 + 1, b * 4 + 2, b * 4 + 1, b * 4 + 2, b * 4 + 3);
		}

		const bug_buffers = twgl.createBufferInfoFromArrays(this.gl, total_attrs);
		twgl.setBuffersAndAttributes(this.gl, this.color_program, bug_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, bug_buffers);

		// Render walls
		const wall_buffers = twgl.createBufferInfoFromArrays(this.gl, this.wall_attribs);
		twgl.setBuffersAndAttributes(this.gl, this.color_program, wall_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, wall_buffers);

		// Render the level pass area
		this.gl.useProgram(this.pass_program.program);
		twgl.setUniforms(this.pass_program, this.uniforms);

		const pass_buffers = twgl.createBufferInfoFromArrays(this.gl, this.pass_attribs);
		twgl.setBuffersAndAttributes(this.gl, this.pass_program, pass_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, pass_buffers);

		// Render voids
		this.gl.useProgram(this.void_program.program);
		twgl.setUniforms(this.void_program, this.uniforms);

		const void_buffers = twgl.createBufferInfoFromArrays(this.gl, this.void_attribs);
		twgl.setBuffersAndAttributes(this.gl, this.void_program, void_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.POINTS, void_buffers);
	},


	// Go back to the menu
	to_menu() {
		Scene.set_scene('menu');
	}
};


window.addEventListener('resize', () => {
	Game.uniforms.viewport = [window.innerWidth, window.innerHeight];
});


Game.spawn_bug = Game.spawn_bug.bind(Game);
export default Game;
