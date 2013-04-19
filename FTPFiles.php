<?php

function SFTPFile($FTPFile, $FTPDirectory, $FTPUsername, $FTPPassword, $FTPServer, $Port, $DestinationDirectory)
{
	//for SFTP
	$connection = ssh2_connect($FTPServer, $Port);
	$test = ssh2_auth_password($connection, $FTPUsername, $FTPPassword);
	if (!$test)
		die("Problem authorizing password");

	if (!$connection)
		die("Problem connecting");

	$sftp = ssh2_sftp($connection);

	if (!$sftp)
	{
		die ('problem setting ssh2_sftp : getting SFTP Subsystem');
	}

	if (is_file($FTPFile) || strpos($FTPFile, '.') > 0)
	{
		if (strpos($FTPFile, '|') > 0)
			$FTPFile = explode('|', $FTPFile);
		if (count($FTPFile) > 1)
		{
			for ($i=0;$i<count($FTPFile);$i++)
			{
				$destination_file = $FTPDirectory.'/'.$FTPFile[$i];
				if (!file_exists($destination_file))
				{
					die('file to send does not exists of '.$destination_file);
				}
				//$upload = ssh2_scp_send($connection, $destination_file, ($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile));
				$sftpStream = @fopen('ssh2.sftp://'.$sftp.($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile), 'w');

				try 
				{
					echo "trying";
					if (!$sftpStream) 
					{
						throw new Exception("Could not open remote file: ".($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile)."");
					}
					else
					{
						echo "remote file was opened<BR>";
					}

					$data_to_send = @file_get_contents($destination_file);

					if ($data_to_send === false) 
					{
						throw new Exception("Could not open local file: $destination_file.");
					}
					else
					{
						echo "local file was opened<BR>";
					}

					if ($upload = @fwrite($sftpStream, $data_to_send) === false) 
					{
						throw new Exception("Could not send data from file: $srcFile.");
					}
					else
					{
						echo "could not fwrite data<BR>";
					}

					fclose($sftpStream);
					$upload = true;
				    
				} 
				catch (Exception $e) 
				{
					die('Exception: ' . $e->getMessage());
					fclose($sftpStream);
				}

			}
		}
		else
		{
			if (gettype($FTPFile) == 'array')
				$destination_file = $FTPDirectory.'/'.$FTPFile[0];
			else
				$destination_file = $FTPDirectory.'/'.$FTPFile;

			if (!file_exists($destination_file))
			{
				die('file to send does not exists of '.$destination_file);
			}

			//$upload = ssh2_scp_send($connection, $destination_file, ($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile));
			$sftpStream = @fopen('ssh2.sftp://'.$sftp.($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile), 'w');

				try 
				{
					if (!$sftpStream) 
					{
						throw new Exception("Could not open remote file: ".($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile)."");
					}
					else
					{
						//echo "remote file was opened<BR>";
					}

					$data_to_send = @file_get_contents($destination_file);

					if ($data_to_send === false) 
					{
						throw new Exception("Could not open local file: $destination_file.");
					}
					else
					{
						//echo "local file was opened<BR>";
					}

					if (@fwrite($sftpStream, $data_to_send) === false) 
					{
						throw new Exception("Could not send data from file: $srcFile.");
					}
					else
					{
						//echo "could not fwrite data<BR>";
					}

					fclose($sftpStream);

					$upload = true;
				    
				} 
				catch (Exception $e) 
				{
					die('Exception: ' . $e->getMessage());
					fclose($sftpStream);
				}
		}
		if (!$upload)
			echo "{success:false, data:{'message':'file is [".$FTPFile."] directory is [".$FTPDirectory."] Username is [".$FTPUsername."] Passowrd is [".$FTPPassword."] server is [".$FTPServer."] destination file is [".($DestinationDirectory != '' ? $DestinationDirectory.'/'.$FTPFile : $FTPFile)."] <BR>'}}";
	}
	else
	{
		//sending an entire directory
		$dh = open_dir($FTPFile);
		$upload = true;
		while ($file = readdir($dh) && $upload)
		{
			$destination_file = $FTPDirectory.$FTPFile;
			$upload = ssh2_scp_send($connection, $destination_file.$file, $FTPFile.$file);
		}
	}

	if ($upload)
	{
		echo "{success:true}";
		return true;
	}
	else
	{
		echo "{success:false}";
		return false;
	}
	//undef $connection;

}

if (isset($_POST['SFTP']) && ($_POST['SFTP'] == true || $_POST['SFTP'] == '1'))
{
	$FTPFile = $_POST['FTPFile'];
	$FTPDirectory = $_POST['FTPDirectory'];
	$FTPUsername = $_POST['FTPUsername'];
	$FTPPassword = $_POST['FTPPassword'];
	$FTPServer = $_POST['FTPServer'];
	$Port = (isset($_POST['Port']) ? $_POST['Port'] : 22);
	//echo "file is [".$FTPFile."] directory is [".$FTPDirectory."] Username is [".$FTPUsername."] Passowrd is [".$FTPPassword."] server is [".$FTPServer."]";
	SFTPFile($FTPFile, $FTPDirectory, $FTPUsername, $FTPPassword, $FTPServer, $Port);
}
else
if (isset($_POST['FTPServer']))
{
	//for regular FTP
	$FTPFile = $_POST['FTPFile'];
	$FTPDirectory = $_POST['FTPDirectory'];
	$FTPUsername = $_POST['FTPUsername'];
	$FTPPassword = $_POST['FTPPassword'];
	$FTPServer = $_POST['FTPServer'];
	FTPFile($FTPFile, $FTPDirectory, $FTPUsername, $FTPPassword, $FTPServer, 21);
}

function FTPFile($FTPFile, $FTPDirectory, $FTPUsername, $FTPPassword, $FTPServer, $Port)
{
	$conn_id = ftp_connect($FTPServer);        // set up basic connection
	$login_result = ftp_login($conn_id, $FTPUsername, $FTPPassword) or die("<h2>You do not have access to this ftp server!</h2>");   // login with username and password, or give invalid user message

	if ((!$conn_id) || (!$login_result)) 
	{
	       // wont ever hit this, b/c of the die call on ftp_login
	       echo "FTP connection has failed! <br />";
	       exit;
	} 
	else 
	{
		 //    echo "Connected to $ftp_server, for user $ftp_user_name <br />";
	}
	ftp_pasv($conn_id, true);

	if (is_file($FTPFile) || strpos($FTPFile, '.') > 0)
	{
		//only uploading a single file
		$destination_file = $FTPDirectory.$FTPFile;
		echo "destination_file is ".$destination_file."\r\n";
		$upload = ftp_put($conn_id, $destination_file, $FTPFile, FTP_BINARY);  // upload the file	
		echo "upload is ".$updload."\r\n";
	}
	else
	{
		//uploading an entire directory
		$dh = open_dir($FTPFile);
		$upload = true;
		while ($file = readdir($dh) && $upload)
		{
			$destination_file = $FTPDirectory.$FTPFile;
			$upload = ftp_put($conn_id, $destination_file, $FTPFile.$file, FTP_BINARY);
		}
	}

	if (!$upload) 
	{  
		// check upload status
		echo "{success:false, data:{'message':'<h2>FTP upload of $FTPFile has failed!</h2> <br />'}}";
	} 
	else 
	{
		 echo "Uploading $myFileName Complete!<br /><br />";
	}

	ftp_close($conn_id); // close the FTP stream
}

?>
