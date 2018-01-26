var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
//var http = require('http').Server(app)
//var io = require('socket.io')(http);
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.engine('html',require('ejs').renderFile);

//app.set('views','./client')

//app.use('/js', express.static(path.join(__dirname, './lib/js')))
//app.use('/img', express.static(path.join(__dirname, './lib/images')))

app.get('/',function(req,res){
	//res.render("index.html");
    res.send("hello world")
})

app.listen(port,function(req,res){
    console.log("app listening on port "+port);
})

/*
http.listen(port,function(req,res){
	console.log("app ruuning on PORT "+port)
})
*/

app.use(function(req,res){
	res.send('404');
})