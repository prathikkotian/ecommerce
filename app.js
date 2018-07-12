var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var updateContactRouter = require('./routes/updateContact');
var addProductRouter = require('./routes/addProduct');
var modifyProductRouter = require('./routes/modifyProduct');
var logoutRouter = require('./routes/logout');
var viewUsersRouter = require('./routes/viewUsers');
var viewProductsRouter = require('./routes/viewProducts');
var buyProductsRouter = require('./routes/buyProducts');
var getRecommendationsRouter = require('./routes/getRecommendations');
var productsPurchasedRouter = require('./routes/productsPurchased');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'pug');
//session properties
app.use(sessions({
  secret:'kfebwfwkjb5654fvfwe',
  rolling: false,	
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 900000 }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// route post requests
app.use('/login', loginRouter);
app.use('/registerUser', registerRouter);
app.use('/updateInfo', updateContactRouter);
app.use('/addProducts', addProductRouter);
app.use('/modifyProduct', modifyProductRouter);
app.use('/viewUsers', viewUsersRouter);
app.use('/viewProducts', viewProductsRouter);
app.use('/buyProducts', buyProductsRouter);
app.use('/getRecommendations', getRecommendationsRouter);
app.use('/productsPurchased', productsPurchasedRouter);
app.use('/logout', logoutRouter);

app.get('/ping.html', function(req, res){
	response.writeHead(200, {
            'Content-Type': 'text/plain',
            'Content-Length': 2
        });
        response.write('OK');
        response.end();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if(err) throw err;
});

module.exports = app;
