var express = require('express');
var app = express();
var port = process.env.port || 3000;

app.get('/',function(req,res){
    res.send("Index page")
})

app.listen(port,function(req,res){
    console.log('app running on port '+port)
})