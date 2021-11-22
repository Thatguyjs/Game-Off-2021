#version 300 es

precision highp float;

in vec2 position;
in float size;

uniform vec2 viewport;
uniform mat4 world_mat;
uniform mat4 model_mat;

out vec2 f_position;
out float f_size;
out vec3 f_color;

vec2 screen_to_gl_coord(vec2 pos) {
	vec2 half_viewport = viewport / 2.0;

	return vec2(
		(pos.x - half_viewport.x) / half_viewport.x,
		(half_viewport.y - pos.y) / half_viewport.y
	);
}

void main() {
	gl_Position = world_mat * model_mat * vec4(screen_to_gl_coord(position), 0.0, 1.0);
	gl_PointSize = size * viewport.y;

	f_position = screen_to_gl_coord(position);
	f_size = size / min(viewport.x, viewport.y) * 2.0;
	f_color = vec3(0, 0, 0);
}
