import Vec2 from "./include/vec2.mjs";
import Game from "./game.mjs";


const RADIANS = 1;
const DEGREES = 2;

function polar_to_cart(angle, radius, mode=RADIANS) {
	if(mode === DEGREES) angle = angle * Math.PI / 180;
	return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}


class Player {
	// Each point is described by an angle and radius
	#points = [
		270, 17, // Front
		135, 17, // Back left
		45, 17, // Back right
		90, 8 // Back center
	];

	#keys = {
		forward: false,
		backward: false,
		rot_left: false,
		rot_right: false,
		interact: false
	};

	bug = null; // Bug that the player is carrying

	constructor(position, rotation, velocity) {
		this.position = position ?? new Vec2();
		this.rotation = rotation ?? 0;
		this.rot_vel = 0;
		this.velocity = velocity ?? new Vec2();

		window.addEventListener('keydown', this.#keydown.bind(this));
		window.addEventListener('keyup', this.#keyup.bind(this));
	}

	destroy() {
		window.removeEventListener('keydown', this.#keydown.bind(this));
		window.removeEventListener('keyup', this.#keyup.bind(this));
	}

	update(void_info) {
		let apply_vel = 0; // Forwards / backwards velocity

		if(this.#keys.forward)
			apply_vel += 0.1;
		if(this.#keys.backward)
			apply_vel -= 0.1;

		this.velocity.add(polar_to_cart(this.rotation - 90, apply_vel, DEGREES).div(3));

		if(this.#keys.rot_left)
			this.rot_vel -= 0.25;
		if(this.#keys.rot_right)
			this.rot_vel += 0.25;

		// if(this.velocity.mag() > 1)
		// 	this.velocity.normalize();

		const void_dist = (new Vec2(
			void_info.position.data[0] - this.position.x,
			void_info.position.data[1] - this.position.y
		));

		const void_force = (window.innerWidth - void_dist.mag()) / window.innerWidth;
		const force_dir = polar_to_cart(Math.atan2(void_dist.y, void_dist.x), 0.023);

		if(void_dist.mag() < void_info.size.data[0] + 8)
			force_dir.mult(2);

		if(void_dist.mag() < window.innerHeight)
			this.velocity.add(force_dir.mult(void_force));

		this.position.add(this.velocity.copy().mult(2.4));
		this.rotation = (this.rotation + this.rot_vel) % 360;

		if(this.rotation < 0)
			this.rotation += 360;

		const points = this.get_points();
		for(let p = 0; p < 8; p += 2) {
			const x_result = this.collide_walls(new Vec2(points[p], points[p + 1]), 'x');
			if(x_result[0]) {
				this.velocity.x = -this.velocity.x * 0.8;
				this.position.x += x_result[1];
			}

			const y_result = this.collide_walls(new Vec2(points[p], points[p + 1]), 'y');
			if(y_result[0]) {
				this.velocity.y = -this.velocity.y * 0.8;
				this.position.y += y_result[1];
			}
		}

		if(this.bug) {
			this.bug.position.x = this.position.x;
			this.bug.position.y = this.position.y;
		}

		this.velocity.div(1.015);
		this.rot_vel /= 1.06;
	}

	// Collide with the edges of the screen
	collide_walls(point, axis) {
		if(axis === 'x') {
			if(point.x < 0)
				return [true, -point.x];
			if(point.x > window.innerWidth)
				return [true, window.innerWidth - point.x];
		}
		else {
			if(point.y < 0)
				return [true, -point.y];
			if(point.y > window.innerHeight)
				return [true, window.innerHeight - point.y];
		}

		return [false];
	}


	#keydown(ev) {
		switch(ev.code) {
			case 'ArrowUp':
			case 'KeyW':
				this.#keys.forward = true;
				break;
			case 'ArrowDown':
			case 'KeyS':
				this.#keys.backward = true;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				this.#keys.rot_left = true;
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.#keys.rot_right = true;
				break;
			case 'KeyE':
			case 'Space':
				if(!this.#keys.interact) {
					if(!this.bug) Game.pickup_bug();
					else Game.drop_bug();
				}
				this.#keys.interact = true;
				break;
		}
	}

	#keyup(ev) {
		switch(ev.code) {
			case 'ArrowUp':
			case 'KeyW':
				this.#keys.forward = false;
				break;
			case 'ArrowDown':
			case 'KeyS':
				this.#keys.backward = false;
				break;
			case 'ArrowLeft':
			case 'KeyA':
				this.#keys.rot_left = false;
				break;
			case 'ArrowRight':
			case 'KeyD':
				this.#keys.rot_right = false;
				break;
			case 'KeyE':
			case 'Space':
				this.#keys.interact = false;
				break;
		}
	}


	get_points() {
		const p0 = polar_to_cart(this.#points[0] + this.rotation, this.#points[1], DEGREES);
		const p1 = polar_to_cart(this.#points[2] + this.rotation, this.#points[3], DEGREES);
		const p2 = polar_to_cart(this.#points[4] + this.rotation, this.#points[5], DEGREES);
		const p3 = polar_to_cart(this.#points[6] + this.rotation, this.#points[7], DEGREES);
		const points = new Float32Array(8);

		points[0] = p0.x + this.position.x; // Front
		points[1] = p0.y + this.position.y;
		points[2] = p1.x + this.position.x; // Back left
		points[3] = p1.y + this.position.y;
		points[4] = p2.x + this.position.x; // Back right
		points[5] = p2.y + this.position.y;
		points[6] = p3.x + this.position.x; // Back center
		points[7] = p3.y + this.position.y;

		return points;
	}
}


export default Player;
