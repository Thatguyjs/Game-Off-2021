import Vec2 from "./include/vec2.mjs";

import LevelInfo from "./level.mjs";
import Player from "./player.mjs";
import Bug from "./bug.mjs";


const Game = {
	gl: null,
	color_program: null,
	void_program: null,
	uniforms: null,

	paused: false,

	player: null,
	player_attribs: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: null },
		indices: [0, 1, 3, 0, 2, 3]
	},

	bugs: [],

	walls: [],
	wall_attribs: {
		position: { numComponents: 2, data: [] },
		color: { numComponents: 4, data: [] },
		indices: []
	},

	voids: [],
	void_attribs: {
		position: { numComponents: 2, data: [] },
		size: { numComponents: 1, data: [] }
	},

	init(gl, programs, uniforms) {
		this.gl = gl;
		this.color_program = programs.color;
		this.void_program = programs.void;
		this.uniforms = uniforms;

		this.player = new Player();
		this.player_attribs.position.data = this.player.get_points();
		this.player_attribs.color.data = (new Float32Array(16)).fill(1.0);

		this.load_level(0);

		// for(let i = 0; i < 10; i++)
		// 	this.bugs.push(new Bug(new Vec2(Math.random() * window.innerWidth, Math.random() * window.innerHeight)));
	},

	load_level(ind) {
		this.player.position = LevelInfo[ind].player_start.position;
		this.player.velocity = LevelInfo[ind].player_start.velocity;
		this.player.rotation = LevelInfo[ind].player_start.rotation;

		this.walls = LevelInfo[ind].walls;
		this.voids = LevelInfo[ind].voids;

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

		const void_num = this.voids.length;

		for(let v = 0; v < void_num; v++) {
			this.void_attribs.position.data.push(this.voids[v].x, this.voids[v].y);
			this.void_attribs.size.data.push(this.voids[v].size);
		}
	},

	// Assigns a bug to the player if once is close enough
	pickup_bug() {
		const player_pos = this.player.position;

		for(let b in this.bugs) {
			const bug_pos = this.bugs[b].position;

			if(bug_pos.x > player_pos.x - 30 && bug_pos.x < player_pos.x + 30 &&
				bug_pos.y > player_pos.y - 30 && bug_pos.y < player_pos.y + 30) {
				this.player.bug = this.bugs[b];
				this.player.modifier = this.player.random_modifier();
			}
		}
	},

	// Drop the bug that the player has, copy the player's velocity to the bug
	drop_bug() {
		if(!this.player.bug) return;

		this.player.bug.velocity = this.player.velocity.copy().mult(2.4);
		this.player.bug = null;
	},

	update() {
		this.player.update(this.walls);

		for(let b in this.bugs)
			this.bugs[b].update();
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

		// Render voids
		this.gl.useProgram(this.void_program.program);
		twgl.setUniforms(this.void_program, this.uniforms);

		const void_buffers = twgl.createBufferInfoFromArrays(this.gl, this.void_attribs);
		twgl.setBuffersAndAttributes(this.gl, this.void_program, void_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.POINTS, void_buffers);
	}
};


window.addEventListener('resize', () => {
	Game.uniforms.viewport = [window.innerWidth, window.innerHeight];
});


export default Game;
