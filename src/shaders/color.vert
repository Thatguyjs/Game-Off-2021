#version 300 es

precision highp float;

in vec2 position;
in vec4 color;

uniform vec2 viewport;
uniform mat4 world_mat;
uniform mat4 model_mat;

out vec4 frag_color;

vec2 screen_to_gl_coord(vec2 pos) {
	vec2 half_viewport = viewport / 2.0;

	return vec2(
		(pos.x - half_viewport.x) / half_viewport.x,
		(half_viewport.y - pos.y) / half_viewport.y
	);
}

void main() {
	gl_Position = world_mat * model_mat * vec4(screen_to_gl_coord(position), 0.0, 1.0);
	frag_color = color;
}
