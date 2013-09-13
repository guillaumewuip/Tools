Access a private ics with NodeJS
=====

A NodeJS module to access a private ics with NodeJS.

The function will load the ics by using the http authentification method.
"http://username:password@mySite.com/myPrivateIcs.ics"

##How to use the plugin

```

var ics = require('./ics/ics');

var params : {
	username : 'user',
	password : "123456",
	url      : "mySite.com/myPrivateIcs.ics" //Without "http://" !
};

//Http protocol
ics.returnHttpICS(params, function(icsContent) {
	if(typeof icsContent === 'string') {
		//Some stuff
	} else {
		//error
		console.log("Error : " + icsContent); //status code
	}
});

//Https protocol
ics.returnHttpsICS(params, function(icsContent) {
	if(typeof icsContent === 'string') {
		//Some stuff
	} else {
		//error
		console.log("Error : " + icsContent); //status code
	}
}):

````