#version 300 es

precision highp float;

in vec4 position;
in vec4 color;

uniform mat4 world_mat;
uniform mat4 model_mat;

out vec4 frag_color;

void main() {
	gl_Position = world_mat * model_mat * position;
	frag_color = color;
}
