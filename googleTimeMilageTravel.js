var EntranceIndex = 0;
var entrancePoints = new Array();
var DirectionsText = '';
var DirectionsArray = new Array(); 
var stopszone = new Array();
var StopNumber = 1;
function getEstimatedTravelTime(AddressArray)
{
	//alert(AddressArray);
	if (AddressArray == ',' || AddressArray == 'false,')
	{
		//alert('going to final submit');
		finalSubmit();
		return;
	}
	var directions = new GDirections(); 
	GEvent.addListener(directions, "load", function() 
	{ 
	 	var Time = directions.getDuration().seconds/3600; 
		Time = Math.round(Time*100);
		Time = Time/100; var k = 0;		
		Ext.getCmp('hours').setValue(Time);
		var matchPoint = '';
				
		stopszone[0] = Ext.getCmp('FromCode').getValue(); 
		var tozone = Ext.getCmp('ToCode').getValue(); 
		if(directions.getNumRoutes()>1){
			for(i=1;i<directions.getNumRoutes();i++){
				stopszone.push(Ext.getCmp('Stop'+i+'Code').getValue());	
				//alert('stopI:' + i+ ':' + Ext.getCmp('Stop'+i+'Code').getValue());
			}
		} 
		stopszone.push(tozone);
		
		//alert('here1');
		
		for (i=0;i<directions.getNumRoutes();i++)
		{
			var tempRoute = directions.getRoute(i); 
			var tRoute = '';
			for (j=0;j<tempRoute.getNumSteps();j++)
			{
				if(tempRoute.getStep(j).getDescriptionHtml().match('Toll road')){
					k++;
				} 
				tRoute+=tempRoute.getStep(j).getDescriptionHtml();				
			}	
			DirectionsArray[i]=tRoute;
			var EntranceTollsStoreCount = EntranceTollsStore.getCount();
			var FromZoneNumber = i; //alert('FromZoneNumber: ' + FromZoneNumber);
			var ToZoneNumber = i+1;// alert('ToZoneNumber: ' + ToZoneNumber);
			var diff =0; 
			if(stopszone[FromZoneNumber].substr(0,1)==stopszone[ToZoneNumber].substr(0,1))
				if(stopszone[FromZoneNumber].substr(0,2)==stopszone[ToZoneNumber].substr(0,2));
				else diff++;
			else diff++;
		//	alert('route iteration: ' + i);
		//	alert('diff: ' + diff);
			

			if(diff>0){
				for(j=0;j<EntranceTollsStoreCount;j++){	
					var RouteName = EntranceTollsStore.getAt(j).get('name');
					RouteName = RouteName.split(';');
					var tempArray = new Array();
					var RouteNameCount = RouteName.length;
					for(l=0;l<RouteNameCount;l++){
					    index = DirectionsArray[i].indexOf(RouteName[l]);
					    var temproute = EntranceTollsStore.getAt(j).get('route');
					    var RouteCount = temproute.length;
					    if(DirectionsArray[i].indexOf(RouteName[l])!=-1 /* && matchPoint!=RouteName[l]*/){ 
						matchPoint = RouteName[l];
						tempArray['index'] = i;
						tempArray['sort'] = 0;
						tempArray['name'] = RouteName[l]; 
						tempArray['route'] = EntranceTollsStore.getAt(j).get('route');
						tempArray['latitude'] = EntranceTollsStore.getAt(j).get('latitude');
						tempArray['longtitude'] = EntranceTollsStore.getAt(j).get('longtitude');
						tempArray['zone'] = '';
						tempArray['tolls_day'] = EntranceTollsStore.getAt(j).get('tolls_day');
						entrancePoints.push(tempArray);
						l = RouteNameCount; //????????????????
					    }					
					}       
				}
			}
			DirectionsText+=DirectionsArray[i];			

		}
		//alert('here2');
		entrancePoints = sortArray(entrancePoints);
		getEntrancePointCodeZones(entrancePoints);
		
	});
	var AddressString = "from: " + AddressArray[0]; 
	for(i=1;i<AddressArray.length;i++){
		if (AddressArray[i] != '')
			AddressString+=" to: " + AddressArray[i];
	} 
	directions.load(AddressString, {'getSteps':true});
	//directions.loadFromWaypoints(AddressArray, {'getSteps':true});
}

function sortArray(array){
	var temp = new Array();
	for(i=0;i<array.length-1; i++){	
		array[i]['sort'] = DirectionsText.indexOf(array[i]['name']);	
		for(j=i+1;j<array.length;j++){
			array[j]['sort'] = DirectionsText.indexOf(array[j]['name']);
			if(array[i]['sort']>array[j]['sort']){
				temp = array[i];
				array[i] = array[j];
				array[j]=temp;
			}	
		}
	}
	//for(i = 0; i<array.length;i++){
	//	alert(i+ ' '+ array[i]['name'] + ', ' + array[i]['sort']);
	//}
	return array;
}

function getEntrancePointCodeZones(){ 
	//alert('gps: ' + Ext.getCmp('gpscoordinates').getValue());
	//alert('reszone: ' + Ext.getCmp('EntranceCode').getValue());
	//alert('EntranceIndex'+EntranceIndex);
	var entrancePointsCount = entrancePoints.length;// alert('entrancePointsCount' + entrancePointsCount);
	if(EntranceIndex<entrancePointsCount){	
		var l = EntranceIndex;
		var flag = 0;
		var route = entrancePoints[l]['route']; 
		route = route.split(';'); 
		var RouteCount = route.length; 
		var i = entrancePoints[l]['index'];
		for(k=0;k<RouteCount;k++){ //alert(route[k]+' '+DirectionsArray[i].indexOf(route[k])+' : '+entrancePoints[l]['name']+' '+DirectionsArray[i].indexOf(entrancePoints[l]['name'])+ ' : ' + entrancePoints[l]['name'].indexOf(route[k]) );
			if(entrancePoints[l]['name']=='Robert F Kennedy Bridge'){
				if(k!=0)						
					if(DirectionsArray[i].match(route[0])){
						if(DirectionsArray[i].match(route[k]) && DirectionsArray[i].indexOf(route[k])<DirectionsArray[i].indexOf(entrancePoints[l]['name'])) flag++;
					}
				}else{
					if(DirectionsArray[i].match(route[k]) && DirectionsArray[i].indexOf(route[k])<DirectionsArray[i].indexOf(entrancePoints[l]['name']) && entrancePoints[l]['name'].indexOf(route[k])==-1){ //alert('2: ' + route[k]);
						flag++;
					}
				}
			}
		//alert('flag: ' + flag);
		if(flag>0){ //alert(entrancePoints[l]['name']);
			var longtitude = entrancePoints[l]['longtitude'];
			var latitude = entrancePoints[l]['latitude'];
			var tolls_day = entrancePoints[l]['tolls_day'];
			var tolls_night = entrancePoints[l]['tolls_night'];
			var latlng = new GLatLng(latitude,longtitude);
			var geocoder = new GClientGeocoder();
			geocoder.getLocations(latlng, function(response){
				EntranceIndex++;	
				//alert('response: ' + response.Placemark[0].address);
				Ext.getCmp('gpscoordinates').setValue('('+latitude+','+longtitude+')'); //alert('gps: ' + Ext.getCmp('gpscoordinates').getValue());
				Ext.getCmp('EntranceAddress').setValue(response.Placemark[0].address);
				getAddressNoArea('Entrance');
				flag = 0;
				if (EntranceIndex == entrancePointsCount-1)
				{
					//alert('here');
					finalSubmit();
				}
			});
		}else{
			if(EntranceIndex<(entrancePointsCount-1)){
				Ext.getCmp('gpscoordinates').setValue('');
				Ext.getCmp('EntranceAddress').setValue('');
				EntranceIndex++;
				getAddressNoArea('Entrance');
			}
		}
	}
	else
	{
		if (Ext.getCmp('RunningFullProcess'))
		{
			if (Ext.getCmp('RunningFullProcess').getValue() == '1')
			{
				Ext.getCmp('getTotal').enable();
				Ext.getCmp('ConfirmStops').disable();
				Ext.getCmp('getTotal').handler.call();
			}
		}
		else
		{
			finalSubmit();
		}
	}
}

function getEstimatedTravelDistance(AddressArray)
{
	var directions = new GDirections();
	GEvent.addListener(directions, "load", function() 
	{
	    var Distance = directions.getDistance().meters/1609.344;
		Distance = Math.round(Distance*100);
		Distance=Distance/100;
		//alert("The distance is "+Distance+ " miles");
		Ext.getCmp('miles').setValue(Distance);
		getAPrice2();
	});

	directions.loadFromWaypoints(AddressArray);
}
