******************** Back-end Installations

Express: the main framework used
Mongoose: use to connect and interact with MongoDB (datebase)
Passport: used for authentication
Passport-jwt: used with passport for json web tokens
jsonwebtoken: used to actually generate the token for authentication
body-parser: take in data through our request to use as we please
bcryptjs: security feature to hash stored passwords 
validator: for validations (Express Validator is an Express middleware library that you can incorporate in your apps for server-side data validation)

dev dependencies
nodemon: constantly watch node application automatically updating changes


*HTP client used: insomnia (great for backend APIs = checks end-points)
*Registration through API: MongoDB Atlas
*JWT token allows user to access a protected route. Passport will validate it and extract user data from it

https://github.com/validatorjs/validator.js

https://github.com/emerleite/node-gravatar

https://getbootstrap.com/

https://fontawesome.com/

**************NOTES:
* to run back-end server "npm run server" for nodemon
* to run front-end client "npm start"

*Concurrently command to run both at once ""
* dev "npm run dev" command runs both react and server. (may need to be in server side to run -?)


   
***************** Front-end Installations | notes
* npm i -g create-react-app (global setup)
* client folder = front end
* setup proxy to connect to backend without having to add local host:8000 to request 
* create react app runs on port 3000 can cd in client folder and run "npm start"

*install concurrently to run both server and client together npm i concurrently
* in server package.json added "client-install" script: will go into client folder for you and install react dependencies. so when you take from github you do not have to do this.
*dev command runs both react and server: "npm run dev"

