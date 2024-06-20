import { StatusCodes } from 'http-status-codes';

import UserServices from '@services/UserServices';

export class UserController {
	async me(request, response, next) {
		try {
			const userId = request.userId;

			const user = await UserServices.me(userId);

			return response.status(StatusCodes.OK).json(user);
		} catch (error) {
			return next(error);
		}
	}

	async login(request, response, next) {
		try {
			const { email } = request.body;

			await UserServices.magicLink({ email });

			return response.status(StatusCodes.ACCEPTED).end();
		} catch (error) {
			return next(error);
		}
	}

	async verify(request, response, next) {
		try {
			const tokenId = request.tokenId;

			const { user, accessToken: token } = await UserServices.verify({
				tokenId,
			});

			return response.status(StatusCodes.OK).json({ user, token });
		} catch (error) {
			return next(error);
		}
	}
}

export default new UserController();
