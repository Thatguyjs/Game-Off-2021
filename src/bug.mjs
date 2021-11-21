import Vec2 from "./include/vec2.mjs";


class Bug {
	constructor(position, rotation, velocity) {
		this.position = position ?? new Vec2();
		this.rotation = rotation ?? 0;
		this.velocity = velocity ?? new Vec2();
	}

	update() {
		this.position.x += Math.random() - 0.5;
		this.position.y += Math.random() - 0.5;
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
