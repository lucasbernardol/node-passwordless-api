import { promisify } from 'node:util';

import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

const verify = promisify(jwt.verify);

const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;

export function authenticate() {
	return async (request, response, next) => {
		try {
			// Bearer token
			const { authorization } = request.headers;

			if (!authorization) {
				return response
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: 'Token not provided!' });
			}

			const [, token] = authorization.split(/\s/); // whitespaces

			const payload = await verify(token, JWT_SECRET_ACCESS_TOKEN);

			request.userId = payload.userId;

			return next();
		} catch (error) {
			if (error.name === 'JsonWebTokenError') {
				return response
					.status(StatusCodes.UNAUTHORIZED)
					.json({ message: 'Invalid token' });
			}

			return next(error);
		}
	};
}
