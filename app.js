const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJWT = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJWT());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));


const api = process.env.API_URL;
const productsRoute = require('./routes/product');
const categoriesRoute = require('./routes/categories');
const orderRoute = require('./routes/orders');
const userRoute = require('./routes/users');

//Routes
app.use(`${api}/products`, productsRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/users`, userRoute);
app.use(`${api}/orders`, orderRoute);

mongoose.connect(process.env.CONNECTION_STRING, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'ntuma-app'
 } ).then(()=>{
    console.log('Database connection successful');
}).catch((err)=>{
    console.log(err);
});

//Development Server
// app.listen(3000, ()=>{
//     console.log("Server is now running http://localhost:3000");
// });

//Production Environment
const server = app.listen(process.env.PORT || 3000, function(){
    const port = server.address().port
    console.log("Server is running on port " + port);
})