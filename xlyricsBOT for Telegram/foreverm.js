var forever = require('forever-monitor');

var child = new(forever.Monitor)('http-json.js', {
    max: 10000,
    silent: true,
    minUptime:10,
    spinSleepTime:10,
    options: []
});

child.on('exit', function() {
    console.log('app.js has exited');
});

child.start();