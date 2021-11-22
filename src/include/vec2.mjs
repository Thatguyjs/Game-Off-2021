class Vec2 {
	constructor(x, y) {
		this.x = x ?? 0;
		this.y = y ?? x ?? 0;
	}


	add(x, y) {
		if(x instanceof Vec2)
			return this.add(x.x, x.y);

		this.x += x;
		this.y += y ?? x;
		return this;
	}

	sub(x, y) {
		if(x instanceof Vec2)
			return this.sub(x.x, x.y);

		this.x += x;
		this.y += y ?? x;
		return this;
	}

	mult(x, y) {
		if(x instanceof Vec2)
			return this.mult(x.x, x.y);

		this.x *= x;
		this.y *= y ?? x;
		return this;
	}

	div(x, y) {
		if(x instanceof Vec2)
			return this.div(x.x, x.y);

		this.x /= x;
		this.y /= y ?? x;
		return this;
	}

	pow(x, y) {
		if(x instanceof Vec2)
			return this.pow(x.x, x.y);

		this.x **= x;
		this.y **= y ?? x;
		return this;
	}

	abs() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		return this;
	}

	mag() {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	normalize() {
		const mag = this.mag();
		if(mag === 0) return this;

		this.x /= mag;
		this.y /= mag;
		return this;
	}


	copy() {
		return new Vec2(this.x, this.y);
	}
}


export default Vec2;
