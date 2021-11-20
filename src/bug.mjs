class Bug {
	constructor(position, rotation, velocity) {
		this.position = position;
		this.rotation = rotation;
		this.velocity = velocity;
	}


	get_points() {
		return new Float32Array(
			this.position.x - 20, this.position.y - 20,
			this.position.x + 20, this.position.y - 20,
			this.position.x - 20, this.position.y + 20,
			this.position.x + 20, this.position.y + 20
		);
	}
}


export default Bug;
