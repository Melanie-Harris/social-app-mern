const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

const app = express(); //initializes express framework

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI; //requiring keys and the mongoDB Atlas connection

// connect to MongoDB through mongoose
mongoose
.connect(db)
.then(()=> console.log('Yay! MongoDB is connected. You go girl!'))//if it connects successfully to this
.catch(error => console.log(error)); // if something goes wrong do this. call error then console.log the error


app.get('/', (req, res)=> res.send('hello, said Melanie')); // simple route to homepage. takes in a request & response. res.send is the message that sent to be displayed

// Used Routes
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);



//Runs server. Terminal command use "npm run server" for use of nodemon
const port = process.env.PORT || 8000; // Heroku requires process.env.PORT

app.listen(port, ()=> console.log(`Server running on port ${port}`));

