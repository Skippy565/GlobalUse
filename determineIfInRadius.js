function determineIfInRadius(lat1, lon1, lat2, lon2, Radius)
{
	if (typeof(Number.prototype.toRad) === 'undefined')
	{
		Number.prototype.toRad = function()
		{
			return this * Math.PI / 180;
		}
	}
	var R = 6371; // km
	var dLat = parseFloat(lat2-lat1).toRad();
	var dLon = parseFloat(lon2-lon1).toRad();
	var lat1 = parseFloat(lat1).toRad();
	var lat2 = parseFloat(lat2).toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;

	var distance = parseFloat(d)/1.6;

	if (distance <= Radius)
	{
		return true;
	}
	else
	{
		return false;
	}
}
