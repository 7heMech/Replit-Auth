A really optimized and small express middleware for repl authentication.

## Example
```js
const express = require('express');
const init = require("replit-auth");

const app = express();

const options = {
	authPage: false, // path to custom auth page, defaults to an optimized version of the replit auth page
	allRoutes: false // enforce auth on all routes
};

const auth = init(app, options); // undefined if allRoutes is true

app.get('/', (req, res) => {
  res.send("Hello Guest!");
});

// enforce auth on a single route
app.get('/user', auth, (req, res) => {
  res.send(`Hello ${req.user.name}!`);
});

app.listen(3000, () => console.log('Server started!'));
```

[Live Demo](https://replit.com/@7heMech/ReplAuth?embed=true#index.js)