import Vec2 from "./include/vec2.mjs";

import VoidInfo from "./void.mjs";


const RADIANS = 1;
const DEGREES = 2;

function polar_to_cart(angle, radius, mode=RADIANS) {
	if(mode === DEGREES) angle = angle * Math.PI / 180;
	return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

function dist(v1, v2) {
	return Math.sqrt((v1.x - v2.x) ** 2 + (v2.y - v1.y) ** 2);
}


class Bug {
	constructor(position, rotation, velocity) {
		this.position = position ?? new Vec2();
		this.rotation = rotation ?? 0;
		this.velocity = velocity ?? new Vec2();
		this.dead = false;
	}

	update() {
		this.velocity.x += (Math.random() - 0.5) * 0.05;
		this.velocity.y += (Math.random() - 0.5) * 0.05;

		this.velocity.add(VoidInfo.force_from(this.position).div(2));

		this.velocity.x /= 1.01;
		this.velocity.y /= 1.01;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		for(let v in VoidInfo.voids) {
			if(dist(this.position, VoidInfo.voids[v]) < VoidInfo.voids[v].size) {
				this.dead = true;
				return;
			}
		}
	}


	get_points() {
		const p1 = polar_to_cart(this.rotation + 45, 20, DEGREES);
		const p2 = polar_to_cart(this.rotation + 135, 20, DEGREES);
		const p3 = polar_to_cart(this.rotation + 225, 20, DEGREES);
		const p4 = polar_to_cart(this.rotation + 315, 20, DEGREES);

		return new Float32Array([
			p1.x + this.position.x, p1.y + this.position.y,
			p2.x + this.position.x, p2.y + this.position.y,
			p4.x + this.position.x, p4.y + this.position.y,
			p3.x + this.position.x, p3.y + this.position.y
		]);
	}
}


export default Bug;
