let path;

const parseHeaders = (headers) => {
  const user = {};

	for (const header in headers) {
    const val = headers[header];

    if (header.startsWith('x-replit-') && val && typeof val === 'string') {
      const prop = header.replace('x-replit-user-', '').replace(/-(.)/g, (e, t) => t.toUpperCase());

      switch (prop) {
        case 'id':
          user[prop] = +val;
          break;
        case 'roles':
        case 'teams':
          user[prop] = val.split(',');
          break;
        default:
          user[prop] = val;
      }
    }
  }

	return Object.keys(user).length === 0 ? null : user;
}

const auth = ({ user }, res, next) => {
  if (user) return next();

  try {
    res.render(path);
  } catch (err) {
    res.sendFile(path);
  }
};

/**
 * @module replit-auth
 * @param {object} app - An Express.js app instance.
 * @param {object} options - An options object.
 * @param {boolean} [options.allRoutes=true] - Whether to protect all routes with the middleware, or just specific ones.
 * @param {String} [options.customPage] Path to custom auth page file
 * @returns {(undefined|function)} - If allRoutes is true, returns undefined, otherwise returns the middleware function
 */
module.exports = function createAuthMiddleware(app, options = {}) {
  const { allRoutes = true, customPage = __dirname + '/login.html' } = options;

  app.use((req, res, next) => {
    req.user = parseHeaders(req.headers);
    next();
  });

  return allRoutes ? app.use(auth) : auth;
};