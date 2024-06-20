import { createServer } from 'node:http';
import MongoDatabaseDriver from '@modules/drivers/MongoDatabaseDriver';

import { app } from './app';

function createApplication() {
	const server = createServer(app);

	const PORT = process.env.PORT || 3333;

	return new Promise((resolve, _reject) => {
		server.listen(PORT, () => {
			console.log(`\nServer PORT: ${PORT}`);

			return resolve(server);
		});
	});
}

export default async function bootstrap() {
	await MongoDatabaseDriver.connect();

	await createApplication();
}
