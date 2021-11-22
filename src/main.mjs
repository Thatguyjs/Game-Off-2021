import Game from "./game.mjs";


const canvas = document.getElementById("cnv");
const gl = canvas.getContext("webgl2");


const color_program = twgl.createProgramInfo(
	gl,
	[
		await (await fetch('shaders/color.vert')).text(),
		await (await fetch('shaders/color.frag')).text()
	]
);

const void_program = twgl.createProgramInfo(
	gl,
	[
		await (await fetch('shaders/void.vert')).text(),
		await (await fetch('shaders/void.frag')).text()
	]
);

Game.init(gl, { color: color_program, void: void_program }, {
	viewport: [window.innerWidth, window.innerHeight],
	world_mat: twgl.m4.identity(),
	model_mat: twgl.m4.identity()
});


gl.clearColor(0.063, 0.063, 0.063, 1);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

function render() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	Game.update();
	Game.render();

	window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);
