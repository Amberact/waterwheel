var setClientPublic=require('./endecrype').setClientPublic

function doRegister(data){
	return setClientPublic(data)
}
