import Vec2 from "./include/vec2.mjs";
import Player from "./player.mjs";


const Game = {
	gl: null,
	program_info: null, // TWGL program info
	uniforms: null,

	paused: false,

	player: null,
	player_attribs: {
		position: { numComponents: 2, data: null },
		color: { numComponents: 4, data: null },
		indices: [0, 1, 3, 0, 2, 3]
	},

	bugs: [],
	bug_attrs: [],

	init(gl, program_info, uniforms) {
		this.gl = gl;
		this.program_info = program_info;
		this.uniforms = uniforms;

		this.player = new Player(new Vec2(window.innerWidth / 2, window.innerHeight / 2));
		this.player_attribs.position.data = this.player.get_points();
		this.player_attribs.color.data = (new Float32Array(16)).fill(1.0);
	},

	update() {
		this.player.update();
	},

	render() {
		this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		this.gl.useProgram(this.program_info.program);
		twgl.setUniforms(this.program_info, this.uniforms);

		// Render the player
		this.player_attribs.position.data = this.player.get_points();
		const pl_buffers = twgl.createBufferInfoFromArrays(this.gl, this.player_attribs);

		twgl.setBuffersAndAttributes(this.gl, this.program_info, pl_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, pl_buffers);

		// Render the bugs
		let total_attrs = {
			position: { numComponents: 2, data: [] },
			color: { numComponents: 4, data: [] },
			indices: []
		};

		for(let b in this.bugs) {
			total_attrs.position.data.push(...this.bug_attrs[b].position);
			total_attrs.color.data.push(...this.bug_attrs[b].color);
			total_attrs.indices.push(+b, +b + 1, +b + 2, +b + 1, +b + 2, +b + 3);
		}

		const bug_buffers = twgl.createBufferInfoFromArrays(this.gl, total_attrs);
		twgl.setBuffersAndAttributes(this.gl, this.program_info, bug_buffers);
		twgl.drawBufferInfo(this.gl, this.gl.TRIANGLES, bug_buffers);
	}
};


window.addEventListener('resize', () => {
	Game.uniforms.viewport = [window.innerWidth, window.innerHeight];
});


export default Game;
