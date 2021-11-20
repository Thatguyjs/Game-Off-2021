import Game from "./game.mjs";


const canvas = document.getElementById("cnv");
const gl = canvas.getContext("webgl2");


const program = twgl.createProgramInfo(
	gl,
	[
		await (await fetch('shaders/color.vert')).text(),
		await (await fetch('shaders/color.frag')).text()
	]
);

Game.init(gl, program, {
	viewport: [window.innerWidth, window.innerHeight],
	world_mat: twgl.m4.identity(),
	model_mat: twgl.m4.identity()
});

const attribs = {
	position: { numComponents: 2, data: Game.player.get_points() },

	color: [
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1,
		1, 1, 1, 1
	],

	indices: [
		0, 1, 3,
		0, 2, 3
	]
};

let buffers = twgl.createBufferInfoFromArrays(gl, attribs);

const uniforms = {
	viewport: [window.innerWidth, window.innerHeight],
	world_mat: twgl.m4.identity(),
	model_mat: twgl.m4.identity()
};


gl.clearColor(0.063, 0.063, 0.063, 1);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

function render() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	Game.update();
	Game.render();

	// attribs.position.data = Game.player.get_points();
	// buffers = twgl.createBufferInfoFromArrays(gl, attribs);
    // 
	// gl.viewport(0, 0, canvas.width, canvas.height);
	// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // 
	// gl.useProgram(program.program);
	// twgl.setBuffersAndAttributes(gl, program, buffers);
	// twgl.setUniforms(program, uniforms);
    // 
	// twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

	window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
