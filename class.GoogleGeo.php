<?php


function buildStaticMap($center, $markers=array(), $width=400, $height=400, $zoom=12, $directions=null) {
        $strMarkers = "";
        foreach($markers as $marker) {
            if (!empty($strMarkers)) $strMarkers .= '|';
            $strMarkers .= urlencode($marker);
        }
        if ($width > 640) $width = 640;
        if (!empty($center)) {
            $center = "&center=".$center;
        }
        if (!empty($strMarkers)) {
            $strMarkers = "&markers=".$strMarkers;
        }
        if ($zoom > 0) {
            $zoom = "&zoom=$zoom";
        }
	
        $steps = "";
        if (!empty($directions)) {
            foreach($directions['Directions']['Routes'][0]['Steps'] as $step) {
                $lat = $step['Point']['coordinates'][1];
                $lon = $step['Point']['coordinates'][0];
                if (!empty($steps)) $steps .= "|";
                $steps .= $lat.",".$lon;
            }
            if (!empty($steps)) {
                $steps .= "|".$directions['Directions']['Routes'][0]['End']['coordinates'][1].",".$directions['Directions']['Routes'][0]['End']['coordinates'][0];
                $steps = "&path=rgb:0x0000ff,weight:5|".$steps;
            }
        }

        $staticMap = "http://maps.google.com/staticmap?maptype=mobile&size=".$width."x$height&maptype=roadmap&key=".$GoogleMapsAPIKey."&sensor=false$strMarkers$center$zoom$steps";
        return $staticMap;
    }
 
function retrieveDirections ($from, $to) {
	include('../INSTALL/KeysFile.php');
	$retArray = array();
	$from = str_replace(' ', '%20', $from);
	$to = str_replace(' ', '%20', $to);	
        $url = 'http://maps.google.com/maps/nav?&output=json&q='.$from.'%20to%20'.$to.'&key='.$GoogleMapsAPIKey;       
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$response = curl_exec($ch);
	if(curl_errno($ch)){
		  $errno = curl_errno($ch);
		  $error = curl_error($ch);
		 
	}else{
		$response = json_decode(utf8_encode($response), true);
		curl_close($ch);
		$directions = $response['Directions']['Routes'][0]['Steps'];
		for($i=0;$i<sizeof($directions);$i++){
			$retArray[]=array('lng'=>$directions[$i]['Point']['coordinates'][0], 'lat'=>$directions[$i]['Point']['coordinates'][1]);
		}
		//var_dump($retArray);
       		return $retArray;
	}
   }

function getAddressDetails($FromAddress, $ToAddress, $RateBook_ID)
{
	include_once('getPrice.php');
	
	$FromCode = '';
	$FromType = '';
	$FromState = '';
	$FromCounty = '';
	$FromCity = '';
	$FromRegion ='';
	$FromBuildingNo = '';
	$FromStreet = '';
	$FromArea = '';
	$FromZip = '';

	$ToCode = '';
	$ToType = '';
	$ToState = '';
	$ToCounty = '';
	$ToCity = '';
	$ToRegion = '';
	$ToBuildingNo = '';
	$ToStreet = '';
	$ToArea = '';
	$ToZip = '';

	$results = getHoursAPI($FromAddress, $ToAddress);
	//echo $results."<BR><BR>";
	$results = explode('|', $results);

	$FromZip = $results[1];
	$FromState = $results[2];
	$FromCity = $results[3];

	$FromAddress1 = str_replace(',', '', $FromAddress);
	$FromAddress1 = explode($FromCity, $FromAddress1);
	$FromAddress1 = $FromAddress1[0];
	$FromAddress1 = explode(' ', $FromAddress1);
	$FromBuildingNo = $FromAddress1[0];

	for ($i=1;$i<count($FromAddress1);$i++)
	{
		if ($FromAddress1[$i] != '')
			$FromStreet .= $FromAddress1[$i].' ';
	}

	$ToZip = $results[4];
	$ToState = $results[5];
	$ToCity = $results[6];

	$ToAddress1 = str_replace(',', '', $ToAddress);
	$ToAddress1 = explode($ToCity, $ToAddress1);
	$ToAddress1 = $ToAddress1[0];
	$ToAddress1 = explode(' ', $ToAddress1);
	$ToBuildingNo = $ToAddress1[0];

	for ($i=1;$i<count($ToAddress1);$i++)
	{
		if ($ToAddress1[$i] != '')
			$ToStreet .= $ToAddress1[$i].' ';
	}

	$FromResult = getCode($FromAddress, $RateBook_ID, $FromZip, $FromState, $FromCity);

	$FromResult = explode(',', $FromResult);
	$FromCode = $FromResult[0];
	if (count($FromResult) == 5)
	{
		$FromType = 3;
		$FromCounty = $FromResult[3];
		$FromRegion = $FromState;	
	}
	else
	if (substr($FromCode, 0,1) == 'M')
	{
		$FromType = 1;
		$FromRegion = 'M';
		$FromCounty = 'Manhattan';
	}
	else
	if (substr($FromCode, 0,2) == 'SI' || substr($FromCode, 0,2) == 'BK' || substr($FromCode, 0,2) == 'BX' || substr($FromCode, 0,2) == 'QU')
	{
		if (substr($FromCode, 0,2) == 'SI')
		{
			$FromType = 1;
			$FromRegion = 'SI';
		}
		else
		if (substr($FromCode, 0,2) == 'QU')
		{
			$FromType = 1;
			$FromRegion = 'QU';
			$FromCounty = 'Queens';
		}
		else
		if (substr($FromCode, 0,2) == 'BX')
		{
			$FromType = 1;
			$FromRegion = 'BX';
			$FromCounty = 'Bronx';
		}
		else
		if (substr($FromCode, 0,2) == 'BK')
		{
			$FromType = 1;	
			$FromRegion = 'BK';
			$FromCounty = 'Brooklyn';
		}
	}
	else
	{
			$FromCounty = $FromCode;
			$FromRegion = $FromCode;
			$FromType = 2;
	}
	

	$ToResult = getCode($ToAddress, $RateBook_ID, $ToZip, $ToState, $ToCity);

	$ToResult = explode(',', $ToResult);
	$ToCode = $ToResult[0];

	if (count($ToResult) == 5)
	{
		$ToType = 3;
		$ToCounty = $ToResult[3];
		$ToRegion = $ToState;		
	}
	else
	if (substr($ToCode,0,1) == 'M')
	{
		$ToType = 1;
		$ToRegion = 'M';
		$ToCounty = 'Manhattan';
		$ToCity = 'New York';
	}
	else
	if (substr($ToCode, 0,2) == 'SI' || substr($ToCode, 0,2) == 'BK' || substr($ToCode, 0,2) == 'BX' || substr($ToCode, 0,2) == 'QU')
	{
		if (substr($ToCode,0,1) == 'SI')
		{
			$ToType = 1;
			$ToRegion = 'SI';
			$ToCity = 'New York';
		}
		else
		if (substr($ToCode,0,2) == 'QU')
		{
			$ToType = 1;
			$ToRegion = 'QU';
			$ToCounty = 'Queens';
			$ToCity = 'New York';
		}
		else
		if (substr($ToCode,0,2) == 'BX')
		{
			$ToType = 1;
			$ToRegion = 'BX';
			$ToCounty = 'Bronx';
			$ToCity = 'New York';
		}
		else
		if (substr($ToCode,0,2) == 'BK')
		{
			$ToType = 1;	
			$ToRegion = 'BK';
			$ToCounty = 'Brooklyn';
			$ToCity = 'New York';
		}
	}
	else
	{
			$ToCounty = $ToCode;
			$ToRegion = $ToCode;
			$ToType = 2;
	}

	$retArray['FromCode'] = $FromCode;
	$retArray['FromType'] = $FromType;
	$retArray['FromState'] = $FromState;
	$retArray['FromCounty'] = $FromCounty;
	$retArray['FromCity'] = $FromCity;
	$retArray['FromRegion'] = $FromRegion;
	$retArray['FromBuildingNo'] = $FromBuildingNo;
	$retArray['FromStreet'] = $FromStreet;
	$retArray['FromArea'] = $FromArea;
	$retArray['FromZip'] = $FromZip;

	$retArray['ToCode'] = $ToCode;
	$retArray['ToType'] = $ToType;
	$retArray['ToState'] = $ToState;
	$retArray['ToCounty'] = $ToCounty;
	$retArray['ToCity'] = $ToCity;
	$retArray['ToRegion'] = $ToRegion;
	$retArray['ToBuildingNo'] = $ToBuildingNo;
	$retArray['ToStreet'] = $ToStreet;
	$retArray['ToArea'] = $ToArea;
	$retArray['ToZip'] = $ToZip;

	//echo "<BR><BR>The Final values are : <BR>";
	//print_r($retArray);
	return $retArray;
}
	
?>
