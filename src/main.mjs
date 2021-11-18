const canvas = document.getElementById("cnv");
const gl = canvas.getContext("webgl2");


const program = twgl.createProgramInfo(
	gl,
	[
		await (await fetch('shaders/color.vert')).text(),
		await (await fetch('shaders/color.frag')).text()
	]
);

console.log(program);
