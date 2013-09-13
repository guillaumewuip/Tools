<?php  




  /* HMS_BACKUP.PHP 
     Holomarcus MySQL Database Backup    
     
     Version 1.0 - August 15th, 2003 
     Changelog: see bottom of script. 
      
     (c)2003 Holomarcus (http://www.holomarcus.nl)
     Modified & Distributed by Custom Request (http://customrequest.com)  
     You can distribute this script and use it freely as 
     long as this header is not edited in this script. 
      
     With HMS_BACKUP you can make a backup of your MySQL-database. 
     This backup can be sent by e-mail or uploaded through FTP. 
      
     This script doesn't need privileges to execute *nix commands. 
     It's 100% pure PHP. 
      
     The script needs write-privileges on the directory it resides in! 
      
     Change the necessary settings below... 
  */ 


/* -------------- *\
    $SETTINGS
\* -------------- */


  //Database
  $dbhost        = 'localhost'; // hostname usually localhost 
  $dbuser        = 'user'; // username for MySQL database 
  $dbpass        = '1234'; // Password for MySQL database 
  $dbnames       = array('database1', 'database2'); // MySQL Database Name 

  $archiveDtbName = "backup_dtb_";



  //Files
  $dirToSave = array(
    $_SERVER["HOME"]."/public_html/mydir1", 
    $_SERVER["HOME"]."/public_html/mydir2/mydir3"
  );

  $archiveFilesName = "backup_files";




  //Email
  $info_email    = 'yes';  //Yes to just received an ifo email
  $send_to       = 'mail@mail.com';   // email address for backup file
  $send_from     = 'mail@mail.com'; // email address sending the email, doesn't matter can be same as above
  $subject       = "Backup site done."; // this is the subject of the email being sent to you







/**
 * Sauvegarde databases
 */


$path = make_dir(); 

print "MySQL Database Backup...\n\r";

foreach ($dbnames as $dbname) 
{

  print "Starting Process with $dbname ...\n\r";

  //Connexion à la dtb
  $db = mysql_connect("$dbhost","$dbuser","$dbpass"); 
  mysql_select_db("$dbname",$db); 
   

  $result = false;
  $result = mysql_query("show tables from $dbname"); 

  $newfile = '';

  while (list($table) = mysql_fetch_row($result)) { 
    $newfile .= get_def($table); 
    $newfile .= "\n\n"; 
    $newfile .= get_content($table); 
    $newfile .= "\n\n"; 
    $i++; 
    if ($echo_status == 'yes') { 
      print "Dumped table $table...\n\r"; 
    } 
  } 

  //Création du fichier sql
  $file_name = $archiveDtbName . $dbname . ".sql"; 
  $file_path = $path . $file_name; 

  //Compression
  $file_name .= ".gz"; 
  $file_path .= ".gz"; 
  $zp = gzopen($file_path, "wb9"); 
  gzwrite($zp, $newfile); 
  gzclose($zp); 

  if ($echo_status == 'yes') { 
    print "Gzip-file is created...\n\r"; 
  } 


}

print "MySQL Database Backup Done ! \n\r";
print "\n\r";






/**
 * Sauvegarde fichiers
 */


print "Files Backup ... \n\r";

require_once('pclzip.lib.php');
$archive = new PclZip($archiveFilesName . ".zip");


$archive->create($dirToSave);


print "Files Backup Done ! \n\r";
print "\n\r";






/**
 * Info
 */


if($info_email) {
  mail($send_to, $subject, $subject); 
}









/**
 * Fonctions diverses
 */


//Pour dtb


function make_dir() { 
  $page = split("/", getenv('SCRIPT_NAME')); 
  $n = count($page)-1; 
  $page = $page[$n]; 
  $page = split("\.", $page, 2); 
  $extension = $page[1]; 
  $page = $page[0]; 
  $script = "$page.$extension"; 
  $base_url = "http://".$_SERVER['SERVER_NAME']; 
  $directory = $_SERVER['PHP_SELF']; 
  $url_base = "$base_url$directory"; 

  $url_base = ereg_replace("$script", '', "$_SERVER[PATH_TRANSLATED]");

  $path = $url_base; 

  return $path; 
} 

function get_def($table) {

  $def = ""; 
  $def .= "DROP TABLE IF EXISTS $table;\n"; 
  $def .= "CREATE TABLE $table (\n"; 
  $result = mysql_query("SHOW FIELDS FROM $table") or die("Table $table not existing in database");

  while($row = mysql_fetch_array($result)) { 
    $def .= "    $row[Field] $row[Type]"; 
    if ($row["Default"] != "") $def .= " DEFAULT '$row[Default]'"; 
    if ($row["Null"] != "YES") $def .= " NOT NULL"; 
    if ($row[Extra] != "") $def .= " $row[Extra]"; 
    $def .= ",\n"; 
  } 

  $def = ereg_replace(",\n$","", $def); 
  $result = mysql_query("SHOW KEYS FROM $table"); 

  while($row = mysql_fetch_array($result)) { 
    $kname=$row[Key_name]; 

    if(($kname != "PRIMARY") && ($row[Non_unique] == 0)) 
      $kname="UNIQUE|$kname"; 
    
    if(!isset($index[$kname])) 
      $index[$kname] = array(); 

    $index[$kname][] = $row[Column_name]; 
  } 

  while(list($x, $columns) = @each($index)) { 
    $def .= ",\n"; 
    if($x == "PRIMARY") $def .= "   PRIMARY KEY (" . implode($columns, ", ") . ")"; 
    else if (substr($x,0,6) == "UNIQUE") $def .= "   UNIQUE ".substr($x,7)." (" . implode($columns, ", ") . ")"; 
    else $def .= "   KEY $x (" . implode($columns, ", ") . ")"; 
  } 

  $def .= "\n);"; 
  return (stripslashes($def)); 
} 

function get_content($table) { 
  $content=""; 
  $result = mysql_query("SELECT * FROM $table"); 
  while($row = mysql_fetch_row($result)) { 
    $insert = "INSERT INTO $table VALUES ("; 
    for($j=0; $j<mysql_num_fields($result);$j++) { 
      if(!isset($row[$j])) $insert .= "NULL,"; 
      else if($row[$j] != "") $insert .= "'".addslashes($row[$j])."',"; 
      else $insert .= "'',"; 
    } 
    $insert = preg_replace("/,$/" , "" , $insert); 
    $insert .= ");\n"; 
    $content .= $insert; 
  } 
  return $content; 
} 