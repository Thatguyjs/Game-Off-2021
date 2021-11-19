const canvas = document.getElementById("cnv");
const gl = canvas.getContext("webgl2");


const program = twgl.createProgramInfo(
	gl,
	[
		await (await fetch('shaders/color.vert')).text(),
		await (await fetch('shaders/color.frag')).text()
	]
);

const attribs = {
	position: { numComponents: 2, data: [
		10, 10,
		30, 10,
		10, 30,
		30, 30
	]},

	color: [
		1, 0, 0, 1,
		1, 0, 1, 1,
		0, 1, 0, 1,
		0, 0, 1, 1
	],

	indices: [
		0, 1, 2,
		1, 2, 3
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

	buffers = twgl.createBufferInfoFromArrays(gl, attribs);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.useProgram(program.program);
	twgl.setBuffersAndAttributes(gl, program, buffers);
	twgl.setUniforms(program, uniforms);

	twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);

	window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);


window.onmousemove = (ev) => {
	attribs.position.data[0] = ev.clientX;
	attribs.position.data[1] = ev.clientY;

	attribs.position.data[2] = ev.clientX + 20;
	attribs.position.data[3] = ev.clientY;

	attribs.position.data[4] = ev.clientX;
	attribs.position.data[5] = ev.clientY + 20;

	attribs.position.data[6] = ev.clientX + 20;
	attribs.position.data[7] = ev.clientY + 20;
}
