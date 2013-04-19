<?php
include_once('../dbConnect.php');
$db = connectToDB();

$tollsHoldingArray = array();
$tollsNameHoldingArray = array();
$rateBookHoldingArray = array();
$rateBookNameHoldingArray = array();

function containsLatLng($Lat, $Long, $RateBook_ID, $Tolls)
{
	if (!$Tolls)
		$query = "SELECT ZoneName, Coordinate FROM ZoneByGPSpricing WHERE RateBook_ID = '".$RateBook_ID."' ORDER BY ID, ZoneName";
	else
		$query = "SELECT Name as ZoneName, CONCAT('(',GPSCoordinate, ')') as Coordinate FROM tollZones ORDER BY ID, Name";
	
	if (($Tolls && count($tollsHoldingArray) == 0) || (!$Tolls && count($rateBookHoldingArray) == 0))
	{
		if (!$result = mysql_query($query))
			die(mysql_error());
	
		$polygonArray= array();
		$polygonNameArray = array();
		$tempCoordinateArray = array();
		$i=0;
		$tempZone = '';
		$index=0;
		while ($row = mysql_fetch_array($result))
		{
			$polygonNameArray[count($polygonNameArray)] = $row['ZoneName'];
			if ($i == 0)
				$tempZone = $row['ZoneName'];
			if ($tempZone == $row['ZoneName'])
			{
				$tempCoordinateArray[count($tempCoordinateArray)] = $row['Coordinate'];
			}
			else
			{
				//echo "$tempZone is not the same as ".$row['ZoneName']."<BR>";
				$polygonArray[$index] = $tempCoordinateArray;
				$tempZone = $row['ZoneName'];
				$tempCoordinateArray = array();
				$tempCoordinateArary = $row['Coordinate'];
				$index++;
			}
			$i++;
		}
		$polygonArray[$index] = $tempCoordinateArray;
		if ($Tolls)
		{
			$tollsHoldingArray = $polygonArray;
			$tollsNameHoldingArray = $polygonNameArray;
		}
		else
		{
			$rateBookHoldingArray = $polygonArray;
			$rateBookNameHoldingArray = $polygonNameArray;
		}
	}
	else
	{
		if ($Tolls)
		{
			$polygonArray = $tollsHoldingArray;
			$polygonNameArray = $tolsNameHoldingArray;
		}
		else
		{
			$polygonArray = $rateBookHoldingArray;
			$polygonNameArray = $rateBookNameHoldingArray;
		}
	}
	$indexCount=0;

	for($i=0; $i < count($polygonArray); $i++) 
	{
		//echo "in outter loop for polygon ".$polygonNameArray[$indexCount]."<BR>";
		$inPoly = false;
		$k = count($polygonArray[$i])-1;
		for ($j=0;$j<count($polygonArray[$j]);$j++)
		{
			$indexCount++;
			$Polygon = $polygonArray[$i];
			$Coordinate = $Polygon[$j];
			$Coordinate = str_replace('(', '', $Coordinate);
			$Coordinate = str_replace(')', '', $Coordinate);
			$Coordinate = str_replace(' ', '', $Coordinate);
			$vertecies = explode(',', $Coordinate);
			//print_r($vertecies);
			$vertex1Lat = $vertecies[0];
			$vertex1Long = $vertecies[1];

			$Coordinate2 = $Polygon[$k];
			$coordinate2 = str_replace('(', '', $Coordinate2);
			$Coordinate2 = str_replace(')', '', $Coordinate2);
			$Coordinate2 = str_replace(' ', '', $Coordinate2);

			$verticies2 = explode(',', $Coordinate2);
			print_r($vertecies2);
			$vertex2Lat = $verticies2[0];
			$vertex2Lat = str_replace('(', '', $vertex2Lat);
			$vertex2Long = $verticies2[1];
			
			//echo "vertex1Long is ".$vertex1Long." and vertex 1 Lat is ".$vertex1Lat."<BR>";
			//echo "vertex2Long is ".$vertex2Long." and vertex 2 Lat is ".$vertex2Lat."<BR>";

			if ($vertex1Long < $Long && $vertex2Long >= $Long || $vertex2Long < $Long && $vertex1Long >= $Long)
			{
				if ($vertex1Lat + ($Long - $vertex1Long)/ ($vertex2Long - $vertex1Long)*($vertex2Lat - $vertex1Lat) < $Lat)
				{
					$inPoly = !$inPoly;
				}
			}
			$k = $j;
			/*var vertex1 = this.getVertex(i);
			var vertex2 = this.getVertex(j);
	
			if (vertex1.lng() < latLng.lng() && vertex2.lng() >= latLng.lng() || vertex2.lng() < latLng.lng() && vertex1.lng() >= latLng.lng())	 {
				if (vertex1.lat() + (latLng.lng() - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < latLng.lat()) {
					inPoly = !inPoly;
				}
			}
	
			j = i;*/
		}

		if ($inPoly == true)
		{
			//echo "found in polygon ".$polygonNameArray[$indexCount]."<BR>";
			//$indexCount = $indexCount - 1;
			return $polygonNameArray[$indexCount];
			break;
		}
		else
		{
			//echo "Not found in polygon ".$polygonNameArray[$indexCount++]."<BR>";
		}
	}
}

?>
