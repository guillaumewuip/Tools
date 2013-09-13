Duplicate new mail from one imap server to an other - NodeJS plugin
===================================================================

## How to use it ?

```

var imapToImap = require('./imapToImap/imapToImap');

var listen = new imapToImap.listen({
	imap1Server : {
		url  : "imaps.server1.fr",
		port : 993,
		user : 'username',
		pass : "password"
 	},
 	imap2Server : {
		url  : "imap.server2.com",
		port : 993,
		user : 'username',
		pass : "password"
	}
});

```

## Listen to some events

```
imapToImap.on('Connection', function(server, user) {
	console.log(user + ' connected on '+ server);
});

imapToImap.on('New', function(msg, user) {
	console.log('New message '+ msg +' for '+ user);
});

imapToImap.on('Send', function(msg, user) {
	console.log('New message '+ msg +' for '+ user);
});

imapToImap.on('Disconnection', function(server, user) {
	console.log(user + ' disconnected on '+ server);
});

imapToImap.on('Error', function(err) {
	console.log(err);
});

```
