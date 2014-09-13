<?php

if (file_exists('dbConnect.php'))
	include_once('dbConnect.php');
else
if (file_exists('../dbConnect.php'))
	include_once('../dbConnect.php');

$db = connectToDb();

include_once('getFiles/is_date.php');
include_once('getFiles/is_datetime.php');

foreach ($_REQUEST as $key=>$value)
{
	$tempKey = strtolower($key);
	$key = strToLower($key);
	if (is_date($value))
	{
		$$key =  date('Y-m-d', strToTime($value));
		if (strstr($key, '_'))
		{
			$key = str_replace('_', '', $key);
			$$key =  date('Y-m-d H:i:s', strToTime($value));
		}		
	}
	else
	if (is_datetime($value))
	{
		$$key =  date('Y-m-d H:i:s', strToTime($value));
		if (strstr($key, '_'))
		{
			$key = str_replace('_', '', $key);
			$$key =  date('Y-m-d H:i:s', strToTime($value));
		}
	}
	else
	if (is_numeric($value) && strlen($value) < 10)
	{
		if (!strstr($value, '.'))
		{
			$startLength = strlen($value);
			//value is an integer
			$value = intval($value);
			if (strlen($value) < $startLength)
			{
				for ($i=strlen($value); $i<$startLength; $i++)
				{
					$value = '0'.$value;
				}
			}
			$$key = $value;
			if (strstr($key, '_'))
			{
				$key = str_replace('_', '', $key);
				$$key = $value;
			}
		}
		else
		{
			//value is a float
			$$key = floatval($value);
			if (strstr($key, '_'))
			{
				$key = str_replace('_', '', $key);
				$$key = floatval($value);
			}
		}
	}
	else
	{
		//value is a string
		$key = strToLower($key);
		$value = strToLower($value);
	
		$$key = mysql_real_escape_string($value);
		if (strstr($key, '_'))
		{
			$key = str_replace('_', '', $key);
			$$key = mysql_real_escape_string($value);
		}
	}
}
?>
