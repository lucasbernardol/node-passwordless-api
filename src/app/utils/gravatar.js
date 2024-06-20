import Gravatar from 'gravatar';

export const options = {
	rating: 'g',
	size: 128,
	default: 'mp',
	protocol: 'https',
};

export function gravatar(email) {
	return Gravatar.url(email, options);
}
