
/**
 * Content :
 *
 * - init
 * - function download
 * - private functions
 */


/**
 * $Init
 */

var winston      = require('winston'), //Log
	JSFtp        = require("jsftp"),
	fs           = require('fs'),
	EventEmitter = require('events').EventEmitter;


var controller = new EventEmitter();


//Init Winston
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: 'ftp.log' })
	]
});

var defaultPath = "";



/**
 * Config
 * Configure general directory of all the backup
 * ie :
 * 
	.../defaultPath/
	|
	|	.../defaultPath/server1/
	|	|	.../defaultPath/server1/7-8-2013/
	|	|	|	.../defaultPath/server1/7-8-2013/file1.zip
	|	|	|	.../defaultPath/server1/7-8-2013/file2.zip
	|	|	.../defaultPath/server1/8-8-2013/
	|	|	|	.../defaultPath/server1/8-8-2013/file1.zip
	|	|	|	.../defaultPath/server1/8-8-2013/file2.zip
	|
	|	.../defaultPath/server2/
	|	|	.../defaultPath/server2/7-8-2013/
	|	|	|	.../defaultPath/server2/7-8-2013/backup.log
	|	|	.../defaultPath/server2/8-8-2013/
	|	|	|	.../defaultPath/server2/8-8-2013/backup.log
 *
 * 	   
 */

function config(path, next) {

	defaultPath = path;

	if(next) next();

};

controller.config = function(path, next) {
	config(path, next);	
}


/**
 * $Download
 * Function download
 * 
 * @param  {array of object}   servers 	Must be like :

 	var servers = [
		//Server 1
		{
			name        : 'foglo', //the name of the server (use to make dir)
			ftp         : "myFtpServer.com", //the ftp server
			port        : 21, //the port

			username    : 'username',
			password    : '123456',

			backupDir   : 'public_html/Backup', //The directory where the files are save on the server
			//The files to download
			backupFiles : [
				"myLog.log",
				"myArchive.sql.gz",
				"myArchive2.zip"
			],
			downloadDir : 'foglo' //The directory to save the files locally
			},
		//Server 2
		{
			...
		}
 	];

 * @return {void}
 */	
function download(servers) {


	var files = []; //The files to download

	/*
	 * For each server, we save the files to download
	 */
	for(var i = 0; i < servers.length; i++) {

		var date = new Date();

		var server = servers[i];

		//Ftp connection
		var ftp = new JSFtp({
			host: server.ftp,
			port: server.port, 
			user: server.username, 
			pass: server.password 
		});

		/*
		 * We add each file in var files.
		 */
		server.backupFiles.forEach(function(file){

			files.push({
				name        : file, //the name of the file
				backupDir   : server.backupDir, //Where is the file ?
				downloadDir : server.downloadDir+"/"+date.getDate()+"-"+date.getMonth()+'-'+date.getFullYear(), //Where to download ?
				ftp         : ftp //the ftp connection
			})

		});
		
		//We create the directory of the day in the server's directory if it doesn't already exist 
		fs.mkdir(defaultPath +'/'+ server.name+"/"+date.getDate()+"-"+date.getMonth()+'-'+date.getFullYear());

	}

	//Start to download each file one by one
	down(files);
	
}

controller.download = function(servers) {
	download(servers);	
}





/**
 * $Private
 */


/**
 * Download all the files
 * 
 * @param  {object} files 	All the files to download
 * @return {void}
 */
function down(files) {
	var file = files[0]; //The file

	//Download
	get(file, function() {
		//Once it's done, we delete it from the queue
		files.shift();
		//Download the next file
		if(files.length > 0)
			down(files);
		else {
			logger.info("All files downloaded.");
			controller.emit("End");
		}
	});
}


/**
 * Download a file
 * @param  {object}   file 	the file to download
	var file = {
		name        : file, //the name of the file
		backupDir   : server.backupDir, //Where is the file
		downloadDir : server.downloadDir, //Where to download it ?
		ftp         : ftp // new JSFtp({...}); //the ftp connection
	}

 * @param  {function} 	next	The function to chain
 * @return void
 */
function get(file, next) {

	logger.info("Download : ", file.backupDir+'/'+file.name);
	controller.emit("Download", "start", file.backupDir+'/'+file.name);

	file.ftp.get(

		file.backupDir +'/'+ file.name,
		defaultPath +'/'+ file.downloadDir +'/'+ file.name, 

		function(hadErr) {
		    if (hadErr)  {
		      logger.error('There was an error retrieving the file ' + file.name);
		      controller.emit("Download", "error", file.backupDir+'/'+file.name)
		    }
		    else {
		      logger.info('Done ' +file.backupDir+'/'+file.name+ '!');
		      controller.emit("Download", "end", file.backupDir+'/'+file.name)
		    }

			if(next) 
				next();
		}
	);
}





//Exports the module

module.exports = controller;

