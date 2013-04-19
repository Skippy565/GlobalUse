<?php

function buildResponse($Status, $Message, $Data)
{
	$retArray = array();
	$tempArray = array();
	$tempArray['Status'] = $Status;
	$tempArray['Message'] = $Message;
	
	$retArray['Result'] = $tempArray;
	$retArray['Data'] = $Data;
	
	return $retArray;
}

?>
