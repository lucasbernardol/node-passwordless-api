import { promisify } from 'node:util';

import dayjs from 'dayjs';

import jwt from 'jsonwebtoken';

import { User } from '@models/User';
import { Token } from '@models/Token';

import { gravatar } from '@utils/gravatar';
import { clientURL } from '@utils/clientURL';

const sign = promisify(jwt.sign);

const JWT_SECRET_MAGIC_TOKEN = process.env.JWT_SECRET_MAGIC_TOKEN;
const JWT_SECRET_ACCESS_TOKEN = process.env.JWT_SECRET_ACCESS_TOKEN;

const TOKEN_EXPIRES = 1 * 60 * 60; // 1 hour (seconds)

export class UserServices {
	async magicLink({ email }) {
		const gravatarUrl = gravatar(email);

		const account = await User.findOneAndUpdate(
			{ email },
			{
				email,
				gravatar: gravatarUrl,
			},
			{
				upsert: true,
				new: true,
			},
		);

		await Token.deleteMany({ user: account._id });

		const tokenExpiresAt = dayjs().add(TOKEN_EXPIRES, 'seconds').unix();

		const token = await Token.create({
			user: account._id,
			expiredAt: tokenExpiresAt,
		});

		const magicLinkToken = await sign(
			{ tokenId: token._id },
			JWT_SECRET_MAGIC_TOKEN,
			{
				expiresIn: TOKEN_EXPIRES,
			},
		);

		const magicLink =
			process.env.NODE_ENV !== 'development'
				? clientURL(magicLinkToken).client
				: magicLinkToken;

		// Send email
		//await sendMail({ email, magicLink })

		console.log({ magicLink });
	}

	async verify({ tokenId }) {
		// const token = await Token.findById(tokenId).populate('userId');
		const token = await Token.findOne({ _id: tokenId }).populate('user');

		if (!token) {
			throw new Error('Token not found!');
		}

		const userId = token.user._id;

		await Token.deleteMany({ user: userId });

		if (!token.user.activatedAt) {
			await User.updateOne(
				{
					_id: userId,
				},
				{
					$set: {
						activatedAt: dayjs().unix(),
					},
				},
			);
		}

		const accessToken = await sign({ userId }, JWT_SECRET_ACCESS_TOKEN, {
			expiresIn: 1 * 24 * 60 * 60, // 1 day (seconds)
		});

		return {
			user: token.user,
			accessToken,
		};
	}

	async me(userId) {
		const user = await User.findById(userId);

		if (!user) {
			throw new Error('Invalid account');
		}

		return user;
	}
}

export default new UserServices();
