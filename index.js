let path;

const parseHeaders = (req, res, next) => {
	let user = {};
	const { headers } = req;

	for (const header in req.user = user, headers) {
		const value = headers[header];

		if (header.startsWith("x-replit-") && value && "string" == typeof value) {
			const property = header.replace("x-replit-user-", "").replace(/-(.)/g, (e, t) => t.toUpperCase());

			"roles" === property || "teams" === property ? user[property] = value.split(",") : user[property] = value;
		}
	}
	
	if (0 === Object.keys(user).length && user.constructor === Object) req.user = null;
	next();
}

const auth = (req, res, next) => req.user === null ? (res.render ? res.render(path) : res.sendFile(path)) : next();

/**
 * @module replit-auth
 * @param {object} app - An Express.js app instance.
 * @param {object} options - An options object.
 * @param {boolean} [options.allRoutes=true] - Whether to protect all routes with the middleware, or just specific ones.
 * @param {String} [options.customPage] Path to custom auth page file
 * @returns {(undefined|function)} - If allRoutes is true, returns undefined, otherwise returns the middleware function
 */
module.exports = (app, { allRoutes = true, customPage = __dirname + '/login.html' } = { allRoutes: true, customPage: __dirname + '/login.html' }) => {
	if (!app) throw "app parameter not defined";
	path = customPage;
	app.use(parseHeaders);
	return allRoutes ? app.use(auth) : auth;
}