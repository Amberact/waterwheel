var socket = require('socket.io-client')('http://192.168.5.154:80');
console.log(111)
socket.emit('register',"111")
var serverEncrypt =require('./lib/endecrype').serverEncrypt
var serverDecrypt =require('./lib/endecrype').serverDecrypt


socket.on('register1', function(msg){
	let user=JSON.parse(serverDecrypt(msg))
	console.log(user)
	socket.emit('statuson',msg)
});



socket.on('resourceadded', function(msg){
	console.log(msg)
});