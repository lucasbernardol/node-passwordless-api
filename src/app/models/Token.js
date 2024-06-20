import { randomUUID } from 'node:crypto';
import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
	{
		uuid: {
			type: String,
			required: true,
			default: () => randomUUID(),
			select: false,
		},

		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},

		expiredAt: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export const Token = mongoose.model('Token', schema);
