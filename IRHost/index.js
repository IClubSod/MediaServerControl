// Process command line, ensure that a serial device is given
var serialDevice = process.argv[2];

if (serialDevice === null) {
	console.log('Please provide the path to the serial device as a command line argument');
	process.exit(1);
}

// Requires
var SerialPort = require('serialport').SerialPort;
var Express = require('express');
var Url = require('url');
var BodyParser = require('body-parser');

// Initialize the serial port first, then the express server
var app = null;
var serialPort = new SerialPort(serialDevice, { baudrate: 9600 });

serialPort.on('open', function () {
	console.log('Serial device: ' + serialDevice + ' opened, starting server...');
	app = Express();
	app.use(BodyParser.urlencoded({ extended: true }));
	app.post('/send', function (req, res) {
		var command = req.body.command;
		if (command && command.length > 0)
		{
			serialPort.write('\n' + command);
			console.log('Sent command:' + command);
			res.send('Command:' + command + ' successfully received!');
		}
		else {
			res.send('Error: Invalid command received!');
		}
	});
	
	var server = app.listen(3000, function () {
		var host = server.address().address;
		var port = server.address().port;
		
		console.log('Server started listening at http://%s:%s', host, port);
	});
});

var serialBuffer = "";

serialPort.on('data', function (data) {
	serialBuffer += data;
	if (serialBuffer.length > 255 || serialBuffer.indexOf('\n') > -1) {
		process.stdout.write('[' + serialDevice + ']> ' + serialBuffer);
		serialBuffer = "";
	}
});

serialPort.on('error', function () {
	console.log('Error opening serial device (check device path), shutting down...');
	process.exit(0);
});


