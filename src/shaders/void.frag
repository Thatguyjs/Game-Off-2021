#version 300 es

precision highp float;

in vec2 f_position;
in float f_size;
in vec3 f_color;

uniform vec2 f_viewport;

out vec4 out_color;

void main() {
	vec2 uv = gl_FragCoord.xy / f_viewport * 2.0 - 1.0 - f_position;

	float aspect = f_viewport.x / f_viewport.y;
	uv.x *= aspect;

	float dist = f_size - length(uv);

	out_color.rgb = vec3(smoothstep(0.0, 0.01, dist));
	out_color.rgb *= f_color;
	out_color.a = smoothstep(0.0, 0.01, dist);
}
