import { randomUUID } from 'node:crypto';
import mongoose, { Schema } from 'mongoose';

const schema = new Schema(
	{
		uuid: {
			type: String,
			required: true,
			unique: true,
			default: () => randomUUID(),
			select: false,
		},

		email: {
			type: String,
			index: true,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},

		gravatar: {
			type: String,
			required: false,
			default: null,
		},

		activatedAt: {
			type: Number,
			required: false,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

export const User = mongoose.model('User', schema);
