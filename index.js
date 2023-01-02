let page;

const parseHeaders = async (req, res, next) => {
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

const auth = (req, res, next) => {
	if (req.user === null) return res.sendFile(page);
	next();
}

/**
 * @param app Express application instance
 * @param {Object} options Optional parameters
 * @param {Boolean} [options.allRoutes] Whether auth should be applied on all routes or not
 * @param {String} [options.authPage] Path to custom auth page file
 * @returns {(undefined|function)} undefined if allRoutes = true, otherwise an auth middleware to be used on specific routes
 */
module.exports = (app, { allRoutes = false, authPage = __dirname + '/login.html' } = { allRoutes: false, authPage: __dirname + '/login.html' }) => {
	if (!app) throw "app parameter not defined";
	page = authPage;
	app.use(parseHeaders);
	return allRoutes ? app.use(auth) : auth;
}