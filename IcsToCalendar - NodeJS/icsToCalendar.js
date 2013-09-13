

/**
 * icsTpCalendar
 *
 * Bridge between a ics secured by id and password and any calendar
 *
 * !! Warning : the ics will be public for anyone knowing the url
 */



/**
 * Content :
 *
 * - init
 * - 
 */


/**
 * $Init
 */


var winston       = require('winston'), //Log
	https         = require('https'),
	http          = require('http'),
	StringDecoder = require('string_decoder').StringDecoder,
	EventEmitter  = require('events').EventEmitter;


var controller = new EventEmitter();


/**
 * returnHttpICS method
 *
 * Access a http url (no https, see returnHttpsICS).
 *
 * The function will load the ics by using the http authentification method.
 * "http://username:password@mySite.com/myPrivateIcs.ics"
 * 
 * @param  {object}   params :
 
	var params : {
		username : 'user',
		password : "123456",
		url      : "mySite.com/myPrivateIcs.ics" //Without "http://" !
	}

 * @param  {Function} next   function to chain with the ics content
 */	
function returnHttpICS(params, next) {

	var url = decodeURIComponent(params.url);

	http.get("http://"+ params.user +":"+ params.password +"@"+ url, function(res) {

		if(res.statusCode == 200) {

			var decoder = new StringDecoder('utf8');

			var textChunk = "";

			res.on('data', function(chunk) {
				textChunk += decoder.write(chunk);
			});

			res.on('end', function(){
				next(textChunk);
			});
		}
		else {
			next(res.statusCode)
		}


	}).on('error', function(e) {
		next(500);
	});;


}

controller.returnHttpICS = function(params, next) {
	returnHttpICS(params, next);	
}

/**
 * returnHttpICS method
 *
 * Access a https url.
 *
 * The function will load the ics by using the http authentification method.
 * "http://username:password@mySite.com/myPrivateIcs.ics"
 * 
 * @param  {object}   params :
 
	var params : {
		username : 'user',
		password : "123456",
		url      : "mySite.com/myPrivateIcs.ics" //Without "https://" !
	}

 * @param  {Function} next   function to chain with the ics content
 */	
function returnHttpsICS(params, next) {

	var url = decodeURIComponent(params.url);

	https.get("https://"+ params.user +":"+ params.password +"@"+ url, function(res) {

		if(res.statusCode == 200) {

			var decoder = new StringDecoder('utf8');

			var textChunk = "";

			res.on('data', function(chunk) {
				textChunk += decoder.write(chunk);
			});

			res.on('end', function(){
				next(textChunk);
			});
		}
		else {
			next(res.statusCode)
		}

	}).on('error', function(e) {
		next(500);
	});


}

controller.returnHttpsICS = function(params, next) {
	returnHttpsICS(params, next);	
}



//Exports the module

module.exports = controller;

