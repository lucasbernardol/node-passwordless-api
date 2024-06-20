import { promisify } from 'node:util';

import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const verify = promisify(jwt.verify);

const JWT_SECRET_MAGIC_TOKEN = process.env.JWT_SECRET_MAGIC_TOKEN;

export function verifyMagicLink() {
	return async (request, response, next) => {
		try {
			const { token } = request.query;

			if (!token) {
				return response
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: 'Token not provided!' });
			}

			const payload = await verify(token, JWT_SECRET_MAGIC_TOKEN);

			request.tokenId = payload.tokenId;

			return next();
		} catch (error) {
			return next(error);
		}
	};
}
