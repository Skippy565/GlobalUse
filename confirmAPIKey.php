<?php

function confirmAPIKey($key, $baseURL)
{
	include_once('../dbConnect.php');
	$db = connectToDB();
	
	$query = "SELECT KeyToken FROM APIKeys WHERE baseURL='".$baseURL."' and Active='1'";
	if ($result = mysql_query($query))
	{
		$confirmedFlag = false;
		while ($row = mysql_fetch_array($result))
		{
			if ($key == $row['KeyToken'])
			{
				$confirmedFlag = true;
				break;
			}
		}
		return $confirmedFLag;
	}
	else
	{
		return false;
	}
}

?>