let path;

const parseHeaders = (headers) => {
	const user = {};

	for (const header in user, headers) {
		const value = headers[header];

		if (header.startsWith("x-replit-") && value && "string" == typeof value) {
			const property = header.replace("x-replit-user-", "").replace(/-(.)/g, (e, t) => t.toUpperCase());

			"roles" === property || "teams" === property ? user[property] = value.split(",") : user[property] = value;
		}
	}
	
	return (0 === Object.keys(user).length && user.constructor === Object) ? null : user;
}

const auth = (req, res, next) => {
  if (req.user) next();
	try {
		res.render(path);
	} catch(err) {
		res.sendFile(path);
	} 
}

/**
 * @module replit-auth
 * @param {object} app - An Express.js app instance.
 * @param {object} options - An options object.
 * @param {boolean} [options.allRoutes=true] - Whether to protect all routes with the middleware, or just specific ones.
 * @param {String} [options.customPage] Path to custom auth page file
 * @returns {(undefined|function)} - If allRoutes is true, returns undefined, otherwise returns the middleware function
 */
module.exports = (app, { allRoutes = true, customPage = __dirname + '/login.html' } = { allRoutes: true, customPage: __dirname + '/login.html' }) => {
	if (app.sockets) app.use((socket, next) => {
    socket.user = parseHeaders(socket.request.headers);
    return next();
  });
	if (!app) throw "app parameter not defined";
	path = customPage;
	app.use((req, res, next) => {
    req.user = parseHeaders(req.headers);
		next();
	});
	return allRoutes ? app.use(auth) : auth;
  

}