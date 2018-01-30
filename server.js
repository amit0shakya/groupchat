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

//const general = io.of('/general').clients();
let users={};

io.on('connection',function(socket){
    
    var userid=""
    
    socket.join('general');
    
    socket.on('login',function(_user){
        
        userid=socket.id;
        
        io.sockets.connected[userid].emit('welcome',{'me':{'user':_user,'id':userid},"others":users});
        
        users[userid]={id:userid,username:_user.uname,avtaar:_user.avtaarid};
        
        io.emit('userlogin',users[userid]);
        
    })
    
    
    socket.on('disconnect',function(_d,_c){

        if(userid){
            let userdata =users[userid];
            io.emit('goodbye',users[userid])
            delete users[userid]
        }
        
    })
    
    socket.on('msgonserver',function(msg){
        
        io.emit('msgonclient',msg)
    })
    
})


http.listen(port,function(req,res){
	console.log("app ruuning on PORT "+port)
})


app.use(function(req,res){
	res.send('404');
})