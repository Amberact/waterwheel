var endecrypt =require('./endecrype')
const uuid = require('node-uuid');

var uuidwhitelist=[]

function checkuuid(uuid){
	return true
}

function register(msg){
	console.log(endecrypt)
	if(!endecrypt.setClientPublic(msg))return false
	let newuser={}
	newuser.uuid = uuid.v4()
	uuidwhitelist.push(newuser.uuid)
	return endecrypt.serverEncrypt(JSON.stringify(newuser))
}

function statuson(msg,socket){
	try{
		let user=JSON.parse(endecrypt.serverDecrypt(msg))
		//console.log(user)
		if(uuidwhitelist[0]!==user.uuid) return false
		if(!uuid(msg)) return false
		storage.nasLogin(user.uuid,socket)
		return true
	}
	catch(e){
		console.log(e)
	}
}

function statusoff(socketid){
	storage.removeNas(socketid)
}

exports.register = register
exports.statuson = statuson
exports.statusoff = statusoff