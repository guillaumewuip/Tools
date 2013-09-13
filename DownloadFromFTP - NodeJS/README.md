Download files from FTP servers - NodeJS
=====

A NodeJS module to download files from FTP servers.

##Use to plugin
```
var ftp = require('./ftp/ftp');

var servers = [

	//Server 1
	{	
		name        : 'myServer1',
		ftp         : "server1.fr",
		port        : 21,
		username    : 'user',
		password    : '123456',
		backupDir   : 'path/on/ftp/server/Backup', //path where the files to download are

		//All the files to download (in the backupDir directory)
		backupFiles : [
			"backup.log",
			"backup_1.sql.gz",
			"backup_2.sql.gz",
			"backup_3.zip",
			...
		],
		downloadDir : 'myServer1BackupDir' //path where the file wil be downloaded locally (in a folder with the date)
	},

	//Server 2
	{	
		name       : 'myServer2',
		ftp        : "ftp.server2.fr",
		port       : 21,
		username   : 'user',
		password   : '123456',
		backupDir  : 'path/on/ftp/server/Backup', //path where the files to download are

		//All the files to download (in the backupDir directory)
		backupFiles : [
			...
		],
		downloadDir : 'myServer2BackupDir' //path where the file wil be downloaded locally (in a folder with the date)
	}
];


/**
 * Config
 * Configure general directory of all the backup
 * ie :
	.../defaultPath/
	|
	|	.../defaultPath/myServer1BackupDir/
	|	|	.../defaultPath/myServer1BackupDir/7-8-2013/
	|	|	|	.../defaultPath/myServer1BackupDir/7-8-2013/file1.zip
	|	|	|	.../defaultPath/myServer1BackupDir/7-8-2013/file2.zip
	|	|	.../defaultPath/myServer1BackupDir/8-8-2013/
	|	|	|	.../defaultPath/myServer1BackupDir/8-8-2013/file1.zip
	|	|	|	.../defaultPath/myServer1BackupDir/8-8-2013/file2.zip
	|
	|	.../defaultPath/myServer2BackupDir/
	|	|	.../defaultPath/myServer2BackupDir/7-8-2013/
	|	|	|	.../defaultPath/myServer2BackupDir/7-8-2013/backup.log
	|	|	.../defaultPath/myServer2BackupDir/8-8-2013/
	|	|	|	.../defaultPath/myServer2BackupDir/8-8-2013/backup.log
 *
 * 	   
 */
ftp.config(".../defaultPath/", function() {
	
	//Download the files one by one
	ftp.download(servers);
});

```

##Events
You could listen to some events :

```
ftp.on('Download', function(statut, file) {
	if(statut == "start")
		console.log("Download file " + file + " started.");
	else if (statut == "end")
		console.log("File " + file + " downloaded.");
	else if (statut == "error")
		console.log("Error with load file " + file);
})

ftp.on("End", function() {
	//End of all downloads
})
