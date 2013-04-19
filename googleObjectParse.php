<?php

//$googleObject = '[{"address_components":[{"long_name":"John F. Kennedy International Airport","short_name":"John F. Kennedy International Airport","types":["establishment"]},{"long_name":"Van Wyck Expy","short_name":"Van Wyck Expy","types":["route"]},{"long_name":"Queens","short_name":"Queens","types":["sublocality","political"]},{"long_name":"Jamaica","short_name":"Jamaica","types":["locality","political"]},{"long_name":"Queens","short_name":"Queens","types":["administrative_area_level_2","political"]},{"long_name":"New York","short_name":"NY","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"11430","short_name":"11430","types":["postal_code"]}],"formatted_address":"John F. Kennedy International Airport (JFK), Van Wyck Expy, Queens, NY 11430, USA","geometry":{"bounds":{"ca":{"b":40.62106379999999,"f":40.6647234},"ea":{"b":-73.8232362,"f":-73.74837980000001}},"location":{"Xa":40.6433507,"Ya":-73.78896889999999},"location_type":"APPROXIMATE","viewport":{"ca":{"b":40.62106379999999,"f":40.6647234},"ea":{"b":-73.8232362,"f":-73.74837980000001}}},"types":["airport","transit_station","establishment"]}]';

//$googleObject = '[{"address_components":[{"long_name":"404","short_name":"404","types":["street_number"]},{"long_name":"Willow Ave","short_name":"Willow Ave","types":["route"]},{"long_name":"Garwood","short_name":"Garwood","types":["locality","political"]},{"long_name":"Union","short_name":"Union","types":["administrative_area_level_2","political"]},{"long_name":"New Jersey","short_name":"NJ","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"07027","short_name":"07027","types":["postal_code"]}],"formatted_address":"404 Willow Ave, Garwood, NJ 07027, USA","geometry":{"location":{"Xa":40.65088799999999,"Ya":-74.325493},"location_type":"ROOFTOP","viewport":{"ca":{"b":40.6495390197085,"f":40.6522369802915},"ea":{"b":-74.32684198029153,"f":-74.32414401970851}}},"types":["street_address"]}] ';

//$googleObject = '[{"address_components":[{"long_name":"60","short_name":"60","types":["street_number"]},{"long_name":"Wall St","short_name":"Wall St","types":["route"]},{"long_name":"Lower Manhattan","short_name":"Lower Manhattan","types":["neighborhood","political"]},{"long_name":"Manhattan","short_name":"Manhattan","types":["sublocality","political"]},{"long_name":"New York","short_name":"New York","types":["locality","political"]},{"long_name":"New York","short_name":"New York","types":["administrative_area_level_2","political"]},{"long_name":"New York","short_name":"NY","types":["administrative_area_level_1","political"]},{"long_name":"United States","short_name":"US","types":["country","political"]},{"long_name":"10005","short_name":"10005","types":["postal_code"]}],"formatted_address":"60 Wall St, New York, NY 10005, USA","geometry":{"location":{"Xa":40.7058819,"Ya":-74.00853990000002},"location_type":"ROOFTOP","viewport":{"ca":{"b":40.70453291970851,"f":40.7072308802915},"ea":{"b":-74.0098888802915,"f":-74.00719091970848}}},"types":["street_address"]}] ';

//print_r(geoObjectParse($googleObject));

function geoObjectParse($googleObject)
	{
	$Latitude = '';
	$Longitude = '';
	$HouseNumber = '';
	$Street = '';
	$County = '';
	$Country = '';
	$Zipcode = '';
	$City = '';
	$State = '';
	$tempCity = '';

	$googleObject = json_decode($googleObject, true);
	$googleObject = $googleObject[0];

	print_r($googleObject); echo "<BR><BR>";
	$Coordinate = $googleObject['geometry'];
	$Coordinate = $Coordinate['location'];
	$Latitude = $Coordinate['Xa'];
	$Longitude = $Coordinate['Ya'];

	$addressComponents = $googleObject['address_components'];
	for ($i=0;$i<count($addressComponents);$i++)
	{
		$record = $addressComponents[$i];
		$types = $record['types'];
		for ($k=0;$k<count($types);$k++)
		{
			if ($types[$k] == 'route')
			{
				$Street = $record['long_name'];
			}
			if ($types[$k] == 'sublocality')
			{
				$City = $record['long_name'];
			}
			if ($types[$k] == 'administrative_area_level_1')
			{
				$State = $record['short_name'];
			}
			if ($types[$k] == 'country')
			{
				$Country = $record['short_name'];
			}
			if ($types[$k] == 'postal_code')
			{
				$Zipcode = $record['short_name'];
			}
			if ($types[$k] == 'administrative_area_level_2')
			{
				$County = $record['short_name'];
			}
			if ($types[$k] == 'street_number')
			{
				$HouseNumber = $record['short_name'];
			}
			if ($types[$k] == 'locality')
			{
				$tempCity = $record['short_name'];
			}
		}
		print_r($record); echo "<BR><BR>";
	}
	if ($City == '')
		$City = $tempCity;

	$tempArray['Latitude'] = $Latitude;
	$tempArray['Longitude'] = $Longitude;
	$tempArray['FormattedAddress'] = $googleObject['formatted_address'];
	$tempArray['HouseNumber'] = $HouseNumber;
	$tempArray['Street'] = $Street;
	$tempArray['County'] = $County;
	$tempArray['Country'] = $Country;
	$tempArray['Zipcode'] = $Zipcode;
	$tempArray['City'] = $City;
	$tempArray['State'] = $State;

	return $tempArray;
}
?>
