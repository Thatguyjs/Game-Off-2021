import Vec2 from "./include/vec2.mjs";


const RADIANS = 1;
const DEGREES = 2;

function polar_to_cart(angle, radius, mode=RADIANS) {
	if(mode === DEGREES) angle = angle * Math.PI / 180;
	return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}


class Bug {
	constructor(position, rotation, velocity) {
		this.position = position ?? new Vec2();
		this.rotation = rotation ?? 0;
		this.velocity = velocity ?? new Vec2();
	}

	update() {
		this.velocity.x /= 1.01;
		this.velocity.y /= 1.01;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
	}


	get_points() {
		const p1 = polar_to_cart(this.rotation + 45, 20, DEGREES);
		const p2 = polar_to_cart(this.rotation + 135, 20, DEGREES);
		const p3 = polar_to_cart(this.rotation + 225, 20, DEGREES);
		const p4 = polar_to_cart(this.rotation + 305, 20, DEGREES);

		return new Float32Array([
			p1.x + this.position.x, p1.x + this.position.y,
			p2.x + this.position.x, p2.x + this.position.y,
			p3.x + this.position.x, p3.x + this.position.y,
			p4.x + this.position.x, p4.x + this.position.y,
		]);
	}
}


export default Bug;
