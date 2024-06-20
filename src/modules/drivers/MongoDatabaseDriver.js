import mongoose from 'mongoose';

export class MongoDatabaseDriver {
	#uri = process.env.DATABASE_URI;

	/**
	 * @type {import('mongoose').ConnectOptions}
	 */
	#options = {
		maxPoolSize: 10,
		minPoolSize: 5,
		autoIndex: true,
	};

	#events() {
		mongoose.connection.on('connected', this.#connectEvent);
		mongoose.connection.on('error', this.#errorEvent);
	}

	async connect() {
		try {
			this.#events();

			const connectionURI = this.#uri;

			const connection = await mongoose.connect(connectionURI, this.#options);

			return { connection };
		} catch (error) {}
	}

	#connectEvent() {
		console.log(`\nDATABASE: Connected!`);
	}

	#errorEvent(error) {
		console.log(error);
		return process.exit(1);
	}
}

export default new MongoDatabaseDriver();
