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
		return new Float32Array([
			this.position.x - 20, this.position.y - 20,
			this.position.x + 20, this.position.y - 20,
			this.position.x - 20, this.position.y + 20,
			this.position.x + 20, this.position.y + 20
		]);
	}
}


export default Bug;
