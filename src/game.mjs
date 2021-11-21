import Vec2 from "./include/vec2.mjs";
import Player from "./player.mjs";
import Bug from "./bug.mjs";


const Game = {
	gl: null,
	color_program: null,
	circle_program: null,
	uniforms: null,

	paused: false,

	player: null,
	player_attribs: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: null },
		indices: [0, 1, 3, 0, 2, 3]
	},

	bugs: [],

	void: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: [ 0, 0, 0, 1 ]}
	},

	init(gl, color_program, circle_program, uniforms) {
		this.gl = gl;
		this.color_program = color_program;
		this.circle_program = circle_program;
		this.uniforms = uniforms;

		this.player = new Player(new Vec2(window.innerWidth / 2, window.innerHeight / 2));
		this.player_attribs.position.data = this.player.get_points();
		this.player_attribs.color.data = (new Float32Array(16)).fill(1.0);

		for(let i = 0; i < 10; i++)
			this.bugs.push(new Bug(new Vec2(Math.random() * window.innerWidth, Math.random() * window.innerHeight)));

		this.void.position.data = new Float32Array([
			window.innerWidth / 2,
			window.innerHeight / 2
		]);
	},

	update() {
		this.player.update();

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
		let total_attrs = {
			position: { numComponents: 2, data: [] },
			color: { numComponents: 4, data: [] },
			indices: []
		};

		const bug_num = this.bugs.length;
		for(let b = 0; b < bug_num; b++) {
			total_attrs.position.data.push(...this.bugs[b].get_points());
			total_attrs.color.data.push(...(new Float32Array(16)).fill(0.5));
			total_attrs.indices.push(b * 4, b * 4 + 1, b * 4 + 2, b * 4 + 1, b * 4 + 2, b * 4 + 3);
		}

		const bug_buffers = twgl.createBufferInfoFromArrays(this.gl, total_attrs);
		twgl.setBuffersAndAttributes(this.gl, this.program_info, bug_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, bug_buffers);

		// Render the void
		this.gl.useProgram(this.circle_program.program);

		const void_buffers = twgl.createBufferInfoFromArrays(this.gl, this.void);
		twgl.setBuffersAndAttributes(this.gl, this.program_info, void_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.POINTS, void_buffers);
	}
};


window.addEventListener('resize', () => {
	Game.uniforms.viewport = [window.innerWidth, window.innerHeight];
});


export default Game;
