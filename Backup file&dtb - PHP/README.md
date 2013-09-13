Backup server's files and databases in PHP
=====

Create archives of databese and files on the server.


##Edit your params 

```

//Database
$dbhost        = 'localhost'; // hostname usually localhost 
$dbuser        = 'user'; // username for MySQL database 
$dbpass        = '1234'; // Password for MySQL database 
$dbnames       = array('database1', 'database2'); // MySQL Database Name 

$archiveDtbName = "backup_dtb_";
```

```
//Files
$dirToSave = array(
$_SERVER["HOME"]."/public_html/mydir1", 
$_SERVER["HOME"]."/public_html/mydir2/mydir3"
);

$archiveFilesName = "backup_files";
```

```
//Email
$info_email    = 'yes';  //Yes to just received an ifo email
$send_to       = 'mail@mail.com';   // email address for backup file
$send_from     = 'mail@mail.com'; // email address sending the email, doesn't matter can be same as above
$subject       = "Backup site done."; // this is the subject of the email being sent to you
```

##Cron Job
You could set a cron Job to run the script automaticly.

```
//Every saturday at 3am
00	3	*	*	6	php -q /path/to/script/dtbBackup.php >> /path/to/script/backup.log
```

