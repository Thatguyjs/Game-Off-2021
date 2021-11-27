// Apply forces from voids to movable objects

import Vec2 from "./include/vec2.mjs";


const VoidInfo = {
	voids: [],

	// Returns the directional force from all voids
	force_from(position) {
		let force = new Vec2();

		for(let v in this.voids) {
			const dist = (new Vec2(this.voids[v].x, this.voids[v].y)).sub(position);
			if(dist.mag() > this.voids[v].range) continue;

			const strength = (this.voids[v].range - dist.mag()) / this.voids[v].range;
			force.add(dist.normalize().mult(this.voids[v].strength * 0.1 * strength));
		}

		return force;
	}
};


export default VoidInfo;
