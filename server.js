var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var http = require('http').Server(app)
var io = require('socket.io')(http);
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.engine('html',require('ejs').renderFile);

app.set('views','./client')

app.use('/js', express.static(path.join(__dirname, './lib/js')))
app.use('/img', express.static(path.join(__dirname, './lib/images')))

app.get('/',function(req,res){
	res.render("index.html");
})

var totalClients=0;
var users = [];

io.on('connection',function(socket){

	console.log('user connected')

	socket.on('join',function(data){
		totalClients++;
		console.log(data,"<<<username")
		users.push(data);
	})

	socket.on('userchat',function(data){
		console.log(data,"<<<Data")
		//socket.emit('servermsg', data);
		io.sockets.emit('servermsg', data);
	})

	socket.on('disconnect',function(){
		totalClients--;
		console.log('user disconnect');
	})

})

http.listen(port,function(req,res){
	console.log("app ruuning on PORT "+port)
})

app.use(function(req,res){
	res.send('404');
})