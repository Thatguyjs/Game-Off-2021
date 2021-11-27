#version 300 es
#define PI_2 6.2831853072

precision highp float;

in vec4 frag_color;
in float frag_comp;
out vec4 out_color;

uniform float time;

void main() {
	out_color = vec4(frag_color.rgb * (abs(sin(time / 4000.0 * PI_2)) / 2.0 + 0.5), frag_color.a);
}
