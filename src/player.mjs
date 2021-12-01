import Vec2 from "./include/vec2.mjs";

import VoidInfo from "./void.mjs";
import Game from "./game.mjs";


const RADIANS = 1;
const DEGREES = 2;

function polar_to_cart(angle, radius, mode=RADIANS) {
	if(mode === DEGREES) angle = angle * Math.PI / 180;
	return new Vec2(Math.cos(angle) * radius, Math.sin(angle) * radius);
}

function dist(v1, v2) {
	return Math.sqrt((v1.x - v2.x) ** 2 + (v2.y - v1.y) ** 2);
}

function point_box_collision(point, box) {
	if(point.x > box.x && point.x < box.x + box.width && point.y > box.y && point.y < box.y + box.height)
		return true;

	return false;
}


class Player {
	static Modifiers = {
		NONE: 0,
		NO_CONTROL: 1,
		REVERSE_CONTROLS: 2
	};

	modifier = Player.NONE;
	dead = false;

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

	is_passing(pass_zone) {
		return (this.position.x > pass_zone.x && this.position.x < pass_zone.x + pass_zone.width) &&
			(this.position.y > pass_zone.y && this.position.y < pass_zone.y + pass_zone.height);
	}

	update(walls, voids) {
		if(this.modifier !== Player.Modifiers.NO_CONTROL) {
			let apply_vel = 0; // Forwards / backwards velocity
			let apply_rot = 0; // Rotational velocity

			if(this.#keys.forward)
				apply_vel += 0.1;
			if(this.#keys.backward)
				apply_vel -= 0.1;

			if(this.#keys.rot_left)
				apply_rot -= 0.25;
			if(this.#keys.rot_right)
				apply_rot += 0.25;

			if(this.modifier === Player.Modifiers.REVERSE_CONTROLS) {
				apply_vel = -apply_vel;
				apply_rot = -apply_rot;
			}

			this.velocity.add(polar_to_cart(this.rotation - 90, apply_vel, DEGREES).div(3));
			this.rot_vel += apply_rot;
		}

		this.velocity.add(VoidInfo.force_from(this.position));

		this.position.x += this.velocity.x * 2.4;
		let points = this.get_points();

		for(let p = 0; p < 8; p += 2)
			if(this.collide_walls(new Vec2(points[p], points[p + 1]), [1, 0], walls)) break;

		this.position.y += this.velocity.y * 2.4;
		points = this.get_points();

		for(let p = 0; p < 8; p += 2)
			if(this.collide_walls(new Vec2(points[p], points[p + 1]), [0, 1], walls)) break;

		for(let v in voids) {
			if(dist(this.position, voids[v]) < voids[v].size) {
				this.dead = true;
				return;
			}
		}

		this.rotation = (this.rotation + this.rot_vel) % 360;

		if(this.rotation < 0)
			this.rotation += 360;

		if(this.bug) {
			this.bug.position.x = this.position.x;
			this.bug.position.y = this.position.y;
		}

		this.velocity.div(1.015);
		this.rot_vel /= 1.06;
	}

	random_modifier() {
		const names = Object.keys(Player.Modifiers);
		return Player.Modifiers[names[Math.floor(Math.random() * names.length)]];
	}

	// Collide with the edges of the screen and walls
	collide_walls(point, vel_mult, walls) {
		// const vel = this.velocity.copy().mult(vel_mult[0], vel_mult[1]);

		// Placed walls
		for(let w in walls) {
			if(point_box_collision(point, walls[w])) {
				if(this.position.x < walls[w].x) {
					this.velocity.x *= -0.8;
					this.position.x += walls[w].x - point.x;
				}
				if(this.position.x > walls[w].x + walls[w].width) {
					this.velocity.x *= -0.8;
					this.position.x += walls[w].x + walls[w].width - point.x;
				}

				if(this.position.y < walls[w].y) {
					this.velocity.y *= -0.8;
					this.position.y += walls[w].y - point.y;
				}
				if(this.position.y > walls[w].y + walls[w].height) {
					this.velocity.y *= -0.8;
					this.position.y += walls[w].y + walls[w].height - point.y;
				}

				return true;
			}
		}

		// Edges of the screen
		let edge_collision = [false, false];

		if(point.x < 0) {
			edge_collision[0] = true;
			this.position.x -= point.x;
		}
		else if(point.x > window.innerWidth) {
			edge_collision[0] = true;
			this.position.x -= point.x - window.innerWidth;
		}
		if(point.y < 0) {
			edge_collision[1] = true;
			this.position.y -= point.y;
		}
		else if(point.y > window.innerHeight) {
			edge_collision[1] = true;
			this.position.y -= point.y - window.innerHeight;
		}

		if(edge_collision[0]) {
			this.velocity.x *= -0.8;
			return true;
		}
		if(edge_collision[1]) {
			this.velocity.y *= -0.8;
			return true;
		}

		return false;
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
			case 'Escape':
				Game.to_menu();
				break;
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

	get_points_health() {
		return new Float32Array([
			this.position.x - 20, this.position.y + 24,
			this.position.x + 20, this.position.y + 24,
			this.position.x - 20, this.position.y + 28,
			this.position.x + 20, this.position.y + 28,
		]);
	}
}


export default Player;
