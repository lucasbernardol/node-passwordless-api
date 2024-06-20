export function clientURL(token) {
	return {
		client: `${process.env.CLIENT_HOST}/authenticate/?token=${token}`,
		internal: `${process.env.HOST}/api/users/authenticate/?token=${token}`,
	};
}
