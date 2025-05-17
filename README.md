## Process to create server using Bun

- Create a repo
- Initialize the repo
- node_modules, package.json
- Create a server
- Listen to port 4111
- Middleware
- How the express works works behind the seen
- Diffeerence Between app.use vs app.all

- Difference between JS-Object vs JSON Object
  -Explore schema option in the mongoose docs

- add required, unique,lowercase,min,minLenght, trim
- add default
- create a custom validate function for gender
- Improve the DB scheme - PUT all the appropriate validations on each field in Schema
- Add timestamp to the userschema
- API level validations on PATCH Request and SignUp POST Request
- DATA Sanitization - Add API validations for each field
- Install validator and explore the validator library functions and use it for password and URLs
- Never trust req.body
- validate data in signup API
- Install bcryptjs package
- Create a PasswordHased usin bcryptjs.hasg ans save user with hashed password
- Create a Login API
- Compare passwords and through errors if email or password is invalid.
- Install paeser
- just send a dummy cookie
- Create a GET "/profile" API and check if you get the cookie back.
- In Login API, after email and password validation, create a JWT Token and send it to user in cookies .
- Read the cookies inside your profile API's and find the logged in user.
- Added userAuth Middleware
- Add the userAuth middleware in profile API and a new sendconnectionRequest API.
- Set the expiry of JWT token and cookies to 7 days,
- Creating a userSchema for password validation and getting the JWT.
- Exploring the API's of Tinder .
- Create a list of All API's that we can think of Dev Tinder.

- Explore the Docs for express router.
- Create routes folder for managing auth, profile,requests routers
- create authRouter, profileRouter, requestsRouter.
- use all the routes in the app.js file

- Creating the connection Request Schema add proper validation and indexes.

- Need to to read more about Indexes in Mongoose/MongoDB.
- Need to Read about $or and $and opequery operators in Mongoose/MongoDB.
- Need to read about schema.pre and schema.post middleware in Mongoose.

- Need to think - POST vs GET

- Read about ref and polpulate at https://mongoosejs.com

- Implemented feed logic implemented $and and $nin and $nan.
