var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.engine('html',require('ejs').renderFile);

app.set('views','./client')

app.use('/js', express.static(path.join(__dirname, './lib/js')))
app.use('/img', express.static(path.join(__dirname, './lib/images/')))

app.get('/',function(req,res){
	res.render("index.html");
    //res.send("hello world")
})

const general = io.of('/general').clients();
let users=[];


general.on('connection',function(socket){
    
    socket.join('general');
    
    socket.on('login',function(_user){
        
        const _id=socket.id;
        
        general.connected[_id].emit('welcome',{'me':{'users':users,'id':_id},"others":users});
        
        users.push({
            id:_id,
            username:_user.uname,
            avtaar:_user.avtaarid
        })
        
        room=general.sockets
        
        general.emit('userlogin',users[users.length-1])
        
    })
    
    
    socket.on('disconnect',function(_d){
        
        console.log('user disconnected');  
    })
    
    socket.on('msgonserver',function(msg){
        
        general.emit('msgonclient',msg)
    })
    
})


http.listen(port,function(req,res){
	console.log("app ruuning on PORT "+port)
})


app.use(function(req,res){
	res.send('404');
})