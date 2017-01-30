
module.exports = function(socket) {
	socket.on('message', message=>{
		console.log(message);
		// websocketHandler(socket, message);
	});
}