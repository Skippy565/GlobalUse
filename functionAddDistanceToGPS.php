<?php

function getBoundingBox($lat_degrees,$lon_degrees,$distance_in_miles) 
{

	$radius = 3963.1; // of earth in miles

	// bearings
	$due_north = 0;
	$due_south = 180;
	$due_east = 90;
	$due_west = 270;

	// convert latitude and longitude into radians
	$lat_r = deg2rad($lat_degrees);
	$lon_r = deg2rad($lon_degrees);

	// find the northmost, southmost, eastmost and westmost corners $distance_in_miles away
	// original formula from
	// http://www.movable-type.co.uk/scripts/latlong.html

	$northmost  = asin(sin($lat_r) * cos($distance_in_miles/$radius) + cos($lat_r) * sin ($distance_in_miles/$radius) * cos($due_north));
	$southmost  = asin(sin($lat_r) * cos($distance_in_miles/$radius) + cos($lat_r) * sin ($distance_in_miles/$radius) * cos($due_south));

	$eastmost = $lon_r + atan2(sin($due_east)*sin($distance_in_miles/$radius)*cos($lat_r),cos($distance_in_miles/$radius)-sin($lat_r)*sin($lat_r));
	$westmost = $lon_r + atan2(sin($due_west)*sin($distance_in_miles/$radius)*cos($lat_r),cos($distance_in_miles/$radius)-sin($lat_r)*sin($lat_r));


	$northmost = rad2deg($northmost);
	$southmost = rad2deg($southmost);
	$eastmost = rad2deg($eastmost);
	$westmost = rad2deg($westmost);

	// sort the lat and long so that we can use them for a between query
	if ($northmost > $southmost) {
		$lat1 = $southmost;
		$lat2 = $northmost;

	} else {
		$lat1 = $northmost;
		$lat2 = $southmost;
	}


	if ($eastmost > $westmost) {
		$lon1 = $westmost;
		$lon2 = $eastmost;

	} else {
		$lon1 = $eastmost;
		$lon2 = $westmost;
	}

	$retArray = array();
	$retArray['MaxLat'] = $lat2;
	$retArray['MaxLong'] = $lon2;
	$retArray['MinLat'] = $lat1;
	$retArray['MinLong'] = $lon1;

	return $retArray;
	
}

?>
