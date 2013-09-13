

/**
 * imapToimap
 *
 * Duplicate new mails from one imap server (imap1) to a other (imap2)
 *
 * !! No Attachement for now
 */



/**
 * Content :
 *
 * - init
 * - Listen for email & duplicate to imap2
 */


/**
 * $Init
 */


var winston      = require('winston'), //Log
	inbox        = require("inbox"),
	MailParser   = require("mailparser").MailParser,
	EventEmitter = require('events').EventEmitter;

var controller = new EventEmitter();


var logger = new (winston.Logger)({
	transports: [
		//new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'imapToimap.log' })
	]
});




/**
 * $Listen
 * 
 * listen function
 * @param  {object}   servers  
 	
 	var servers = {
	 	imap1Server : {
			url  : "imaps.etu.univ-nantes.fr",
			port : 993,
			user : "E1234567",
			pass : "1234567"
	 	},
	 	imap2Server : {
			url  : "imap.gmail.com",
			port : false,
			user : "user@gmail.com",
			pass : "1234567"
		}
	}

 * @param  {Function} next        the function to chain
 * @return void
 */	
function listen(servers) {

	//Init
	var imap1Server = servers.imap1Server,
		imap2Server = servers.imap2Server;

	// console.log(imap1Server);
	// console.log(imap2Server);

	//Imap1
	var imap1 = inbox.createConnection(
		imap1Server.port, 
		imap1Server.url, 
		{
		    secureConnection: true,
		    auth:{
		        user: imap1Server.user,
		        pass: imap1Server.pass
		    }
	});
	imap1.connect();

	//On imap1 connection 
	imap1.on("connect", function() {

	    logger.info('Connected to imap1 '+ imap1Server.user +'.');
		controller.emit("Connection", "imap1", imap1Server.user);

		//Open Inbox
		imap1.openMailbox('INBOX', function(err, info) {

			//err
			if(err) {
				logger.error(err);
				controller.emit("Error", err);
			}

			//It's ok
			else {
			
				//console.log(info);

				//On new messsage 
				imap1.on("new", function(message) {
					
			        logger.info("New incoming message "+ message.title +" for "+ imap1Server.user);
			        controller.emit("New", message.title, imap1Server.user);


			        //Init mailparser
			        var mailparser = new MailParser();

			        //Push content stream into mailparser
			        imap1.createMessageStream(message.UID).pipe(mailparser, {end: true});

			        //When all the content is read
			        mailparser.on("end", function(mail_object) {

			        	logger.info("End parse mail.");

			        	/**
			        	 * Connection imap2
			        	 */

						//Imap2
						var imap2 = inbox.createConnection(
							imap2Server.port, 
							imap2Server.url, 
							{
							    secureConnection: true,
							    auth:{
							        user: imap2Server.user,
							        pass: imap2Server.pass
							    }
						});
			        	imap2.connect();

			        	//On imap2 connection
						imap2.on('connect', function() {

							logger.info('Connected to imap2 '+ imap2Server.user +'.');
							controller.emit("Connection", "imap2", imap2Server.user);
				        	
				        	/**
				        	 * Extract some info from imap1's mail
				        	 */

						    //From ?
						    var from = "";
						    mail_object.from.forEach(function(f) {
						    	from += f.name +" <"+ f.address +">, ";
						    });

						    //To ?
					        var to = "";
				        	mail_object.to.forEach(function(t) {
					        	to += t.name +" <"+ t.address +">, ";
					        });

					        //CC ?
					        var cc = "";
					        if(typeof mail_object.cc != 'undefined' ) {
				        	 	mail_object.cc.forEach(function(c) {
					        		cc += c.name +" <"+ c.address +">, ";
					        	});
					        }
				       			    
				        	// console.log(from);
				        	// console.log(to);
				        	// console.log(cc);


				        	/**
				        	 * Duplicate the message in imap2
				        	 */
				        	
				        	logger.info("Opening imap2.")

			        	    imap2.openMailbox('INBOX', function(err, info) {

								var msg = "From: "+ from +"\r\n"
										+ "To: "+ to +"\r\n"
										+ "Delivered-To: "+ to +"\r\n"
										+ "Subject: "+mail_object.subject+"\r\n"
										+ "\r\n"
										+ mail_object.text
										+ "\r\n";

								imap2.storeMessage(msg, function(err, params) {
							        if(err) {
							        	logger.error(JSON.stringify(err));
							        	console.log(err);
							        	controller.emit("Error", err);
							        }
							        else {
							        	logger.info("Message "+ mail_object.subject +" send to imap2.")
							        	controller.emit("Send", mail_object.subject, imap2Server.user);
							        }
							        imap2.close();
							    });
							    
							});
						});

						//On imap2 close
						imap2.on('close', function (){
						    logger.info('imap2 '+ imap2Server.user +' disconnected.');
							controller.emit("Disconnection", "imap2", imap2Server.user);
						});

					});
			        
		   		});
			}

		});

	});

}

controller.listen = function(servers) {
	listen(servers);	
}


//Exports the module

module.exports = controller;



