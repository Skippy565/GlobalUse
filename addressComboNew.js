Ext.define('AddressCombo',
{
	alias:'widget.addressCombo',
	extend:'Ext.form.field.ComboBox',
	queryMode:'remote',
	queryDelay:100000,
	queryParam:'Address',
	enableKeyEvents:true,
	valueField:'FormattedAddress',
	displayField:'FormattedAddress',
	recentResolve:false,
	typeAhead:false,
	autoSelect:false,
	forceSelection:false,
	width:375,
	plugins: ['clearbutton'],
	trigger2Cls: 'x-form-arrow-trigger addressArrow',
	listeners:
	{
		beforequery:function(event, options)
		{
			if (event.combo.getStore().isLoading())
			{
				Ext.Ajax.abort(event.combo.getStore().proxy.activeRequest);
				delete event.combo.getStore().proxy.activeRequest;
			}
		},
		expand:function(combo, options)
		{
			if (Ext.data.StoreManager.lookup('RecentAddressesStore'))
			{
				//not finding the store for some reason//
				if (combo.getRawValue() == '')
				{
					combo.getStore().removeAll();
					for (i=0;i<Ext.data.StoreManager.lookup('RecentAddressesStore').getCount();i++)
					{
						var address = Ext.data.StoreManager.lookup('RecentAddressesStore').getAt(i).get('Address');
						combo.getStore().loadData([['','',address,'','','','']],true);
					}
				}
				else
				{
					combo.getStore().load({params:{'Address':combo.getRawValue()}});
				}
			}			
		},
		focus:function(combo,options)
		{
			if (combo.getRawValue() == '')
			{
				combo.getStore().removeAll();
				if(Ext.data.StoreManager.lookup('RecentAddressesStore'))
					for (i=0;i<Ext.data.StoreManager.lookup('RecentAddressesStore').getCount();i++)
					{
						var address = Ext.data.StoreManager.lookup('RecentAddressesStore').getAt(i).get('Address');
						combo.getStore().loadData([['','',address,'','','','']],true);
					}
				combo.expand();
			}
		},
		keyup:function(combo, event, options)
		{
			combo.recentResolve=false;
			if (Ext.data.StoreManager.lookup('RecentAddressesStore'))
			{
				//not finding the store for some reason//
				if (combo.getRawValue() == '')
				{
					combo.getStore().removeAll();
					for (i=0;i<Ext.data.StoreManager.lookup('RecentAddressesStore').getCount();i++)
					{
						var address = Ext.data.StoreManager.lookup('RecentAddressesStore').getAt(i).get('Address');
						combo.getStore().loadData([['','',address,'','','','']],true);
					}
				}
			}

			if ( event && event.getKey() == 13 && combo.getRawValue().length >= 3)  //enter check
			{
				combo.getStore().load({params:{'Address':combo.getRawValue()}});
				combo.expand();
			}
		},
		select:function(combo, record, options)
		{
			combo.recentResolve=true;
			record = record[0];

			if (record.get('City') == '')
				combo.getStore().load({params:{'Address':combo.getRawValue()}});

			if (combo.mapPlot)
			{
				var index = combo.getStore().find('Address', combo.getValue());

				if (index < 0)
				{
					index = 0;
				}

				globalMap.setView(new L.LatLng(combo.getStore().getAt(index).get('Latitude'), combo.getStore().getAt(index).get('Longitude')), 14);	
				
				if(globalMarker)
					globalMap.removeLayer(globalMarker);
				if(globalMarker!=null)
					globalMarker = L.marker([combo.getStore().getAt(index).get('Latitude'), combo.getStore().getAt(index).get('Longitude')]).addTo(globalMap);		
				if(CircleArea)
					globalMap.removeLayer(CircleArea);
			}

			if (Ext.getCmp(combo.pageCode+combo.prefix+'StreetNumber') && record.get('HouseNumber') != '')
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'StreetNumber').setValue(record.get('HouseNumber'));
			}
			else
			if (Ext.getCmp(combo.pageCode+combo.prefix+'StreetNumber') && record.get('HouseNumber') == '')
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'StreetNumber').setValue('');
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'Street'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'Street').setValue(record.get('Street'));
			}
			else
			if (Ext.getCmp(combo.pageCode+combo.prefix+'StreetName'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'StreetName').setValue(record.get('Street'));
			}

			if (Ext.getCmp(combo.pageCode+combo.prefix+'City'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'City').setValue(record.get('City'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'County'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'County').setValue(record.get('County'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'State'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'State').setValue(record.get('State'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'Zipcode'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'Zipcode').setValue(record.get('Zipcode'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'Latitude'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'Latitude').setValue(record.get('Latitude'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'Longitude'))
			{
				Ext.getCmp(combo.pageCode+combo.prefix+'Longitude').setValue(record.get('Longitude'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'SpecialInstructions'))
			{
				if (combo.prefix == 'Pickup')
					Ext.getCmp(combo.pageCode+combo.prefix+'SpecialInstructions').setValue(record.get('PUComments'));
				else
				if (combo.prefix == 'DropOff')
					Ext.getCmp(combo.pageCode+combo.prefix+'SpecialInstructions').setValue(record.get('DOComments'));
			}
			if (Ext.getCmp(combo.pageCode+combo.prefix+'Country'))
			{
				if (record.get('Country') == 'United States of America' || record.get('Country') == 'US')
				{
					record.set('Country', 'USA');
				}

				if (Ext.data.StoreManager.lookup('CompanyCountryStore'))
				{
					var index = Ext.data.StoreManager.lookup('CompanyCountryStore').find('Country', record.get('Country'));
					if (index != -1)
						Ext.getCmp(combo.pageCode+combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CompanyCountryStore').getAt(index).get('ID'));
				}
				else
				if (Ext.data.StoreManager.lookup('CountryStore'))
				{
					var index = Ext.data.StoreManager.lookup('CountryStore').find('Country', record.get('Country'));
					if (index != -1)
						Ext.getCmp(combo.pageCode+combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CountryStore').getAt(index).get('ID'));
				}
			}
			else
			if (Ext.getCmp('CompanyCountry'))
			{
				if (record.get('Country') == 'United States of America' || record.get('Country') == 'US')
				{
					record.set('Country', 'USA');
				}

				if (Ext.data.StoreManager.lookup('CompanyCountryStore'))
				{
					var index = Ext.data.StoreManager.lookup('CompanyCountryStore').find('Country', record.get('Country'));
					if (index != -1)
						Ext.getCmp('CompanyCountry').setValue(Ext.data.StoreManager.lookup('CompanyCountryStore').getAt(index).get('ID'));
				}
			}
			if(combo.calculatePrice){
				if(combo.pageCode=='MR'){
					calculateMRPrice();
				}
				if(combo.pageCode=='CreateJob'){
					calculatePrice();
				}
			}
			if (combo.Zoning)
			{ //alert(combo.pageCode+combo.prefix+'City' + ' : ' + combo.pageCode+combo.prefix+'State' + ' : ' + combo.pageCode+combo.prefix+'Zipcode' + ' : ' + combo.pageCode+combo.prefix+'Latitude' + ' : ' + combo.pageCode+combo.prefix+'Longitude');
				Ext.Ajax.request(
				{
					url:'getFiles/getPriceZone.php',
					params:
					{
						'CompanyID':Ext.getCmp(combo.company).getValue(),
						'AccountID':Ext.getCmp(combo.account).getValue(),
						'Address':combo.getValue(),
						'City':Ext.getCmp(combo.pageCode+combo.prefix+'City').getValue(),
						'State':Ext.getCmp(combo.pageCode+combo.prefix+'State').getValue(),
						'Zipcode':Ext.getCmp(combo.pageCode+combo.prefix+'Zipcode').getValue(),
						'Latitude':Ext.getCmp(combo.pageCode+combo.prefix+'Latitude').getValue(),
						'Longitude':Ext.getCmp(combo.pageCode+combo.prefix+'Longitude').getValue()
					},
					success:function(f,a)
					{
						var result = Ext.JSON.decode(f.responseText); 
						if (result['success'])
						{
							result = result['rows'];
							
							Ext.getCmp(combo.pageCode+combo.prefix+'Zone').setValue(result['Code']);
							Ext.getCmp(combo.pageCode+combo.prefix+'AreaType').setValue(result['AreaType']);
							if (combo.blackCarPricing)
							{
								getBlackCarPrice(combo.pageCode);
							}
						}
						else
						{
							Ext.getCmp(combo.pageCode+combo.prefix+'Zone').setValue('');
						}
					},	
					failure:function(f,a)
					{

					}
				});
			}

			if (combo.airportCheck)
			{
				Ext.getCmp('Airline').setValue('');
				Ext.getCmp('FlightNumber').setValue('');
				Ext.getCmp('Terminal').setValue('');
				Ext.getCmp('FlightTime').setValue('');
				Ext.getCmp('BoardingTime').setValue('');
				if (Ext.getCmp(combo.FromAddress).getRawValue().indexOf('Airport') != -1 || Ext.getCmp(combo.ToAddress).getRawValue().indexOf('Airport') != -1)
				{
					Ext.getCmp('Airline').enable();
					Ext.getCmp('FlightNumber').enable();
					Ext.getCmp('Terminal').enable();
					Ext.getCmp('FlightTime').enable();
					Ext.getCmp('BoardingTime').enable();
					Ext.getCmp('GraceTime').setValue(60);

					Ext.getCmp('Airline').setValue('');
					Ext.getCmp('FlightNumber').setValue('');
					Ext.getCmp('Terminal').setValue('');
					Ext.getCmp('FlightTime').setValue('');
					Ext.getCmp('BoardingTime').setValue('');

					/*if (Ext.getCmp('FlightNumber').getValue() != '' && Ext.getCmp('Airline').getRawValue() != '')
					{
						Ext.data.StoreManager.lookup('FlightInformationStore').load({params:{
							'FlightNumber':Ext.getCmp('FlightNumber').getValue(),
							'FlightCode':Ext.getCmp('Airline').getValue(),
							'Date':Ext.getCmp('RequestDate').getValue(),
							'FromAddress':Ext.getCmp('CreateJobPickUpaddress').getValue(),
							'ToAddress':Ext.getCmp('CreateJobDropOffaddress').getValue(),
							'Action':'getFlightsFeed'
						}});
					}*/


				}
				else
				{
					Ext.getCmp('Airline').disable();
					Ext.getCmp('FlightNumber').disable();
					Ext.getCmp('Terminal').disable();
					Ext.getCmp('FlightTime').disable();
					Ext.getCmp('BoardingTime').disable();
					Ext.getCmp('GraceTime').setValue('');
				}
			}
	
			if (combo.getTaxPercentage)
			{
				getTaxes();
			}

		},
		beforerender: function(box, options)
		{
			//added by CP to try and fix positioning
			box.removeCls('element');
		}
	}
});

function getBlackCarPrice(pageType){
	var rawDataString = '';
	if(pageType!=''){ //alert('pageType' + pageType);
		if(Ext.getCmp(pageType+'VehicleType'))
			var VehicleType = Ext.getCmp(pageType+'VehicleType').getValue();
		if(Ext.getCmp(pageType+'CompanyID'))
			var CompanyID = Ext.getCmp(pageType+'CompanyID').getValue();
		if(Ext.getCmp(pageType+'AccountID'))		
			var AccountID = Ext.getCmp(pageType+'AccountID').getValue();
		if(Ext.getCmp(pageType+'RateBookID'))		
			var rateBookID = Ext.getCmp(pageType+'RateBookID').getValue();
		//alert('VehicleType ' + VehicleType + '; CompanyID '+CompanyID + '; AccountID '+ AccountID + '; rateBookID ' +rateBookID + '; PickupZone ' + Ext.getCmp(pageType+'PickupZone').getValue() + '; DropoffZone' + Ext.getCmp(pageType+'DropoffZone').getValue());
		if (Ext.getCmp(pageType+'PickupZone') && Ext.getCmp(pageType+'PickupZone').getValue() != '' && Ext.getCmp(pageType+'DropoffZone') && Ext.getCmp(pageType+'DropoffZone').getValue() != '')
		{
			if (Ext.getCmp(pageType+'PickupAreaType').getValue() == 1)
			{
				//local area
				rawDataString+=Ext.getCmp(pageType+'PickupZone').getValue()+',,|';
			}
			else
			if (Ext.getCmp(pageType+'PickupAreaType').getValue() == 2)
			{
				//zipcode area
				rawDataString+=Ext.getCmp(pageType+'PickupZone').getValue()+','+Ext.getCmp(pageType+'PickupZipcode').getValue()+',|';
			}
			else
			if (Ext.getCmp(pageType+'PickupAreaType').getValue() == 3)
			{
				//long distance area
				rawDataString+=Ext.getCmp(pageType+'PickupZone').getValue()+','+Ext.getCmp(pageType+'PickupZipcode').getValue()+','+Ext.getCmp(pageType+'PickupCity').getValue()+',,'+Ext.getCmp(pageType+'PickupState').getValue()+'|';
			}
			else
			{
				//landmark area
				rawDataString+=Ext.getCmp(pageType+'PickupZone').getValue()+',,|';
			}
			
			for (i=0;i<5;i++)
			{
				if (Ext.getCmp(pageType+'stop'+i+'address'))
				{
					if (Ext.getCmp(pageType+'stop'+i+'address').getRawValue() != '')
					{
						if (Ext.getCmp(pageType+'stop'+i+'AreaType').getValue() == 1)
						{
							//local area
							rawDataString+=Ext.getCmp(pageType+'stop'+i+'Zone').getValue()+',,|';
						}
						else
						if (Ext.getCmp(pageType+'stop'+i+'AreaType').getValue() == 2)
						{
							//zipcode area
							rawDataString+=Ext.getCmp(pageType+'stop'+i+'Zone').getValue()+','+Ext.getCmp(pageType+'stop'+i+'Zipcode').getValue()+',|';
						}
						else
						if (Ext.getCmp(pageType+'stop'+i+'AreaType').getValue() == 3)
						{
							//long distance area
							rawDataString+=Ext.getCmp(pageType+'stop'+i+'Zone').getValue()+','+Ext.getCmp(pageType+'stop'+i+'Zipcode').getValue()+','+Ext.getCmp(pageType+'stop'+i+'City').getValue()+',,'+Ext.getCmp(pageType+'stop'+i+'State').getValue()+'|';
						}
						else
						{
							//landmark area
							rawDataString+=Ext.getCmp(pageType+'stop'+i+'Zone').getValue()+',,|';
						}
					}
				}
			}

			if (Ext.getCmp(pageType+'DropoffAreaType').getValue() == 1)
			{
				//local area
				rawDataString+=Ext.getCmp(pageType+'DropoffZone').getValue()+',,';
			}
			else
			if (Ext.getCmp(pageType+'DropoffAreaType').getValue() == 2)
			{
				//zipcode area
				rawDataString+=Ext.getCmp(pageType+'DropoffZone').getValue()+','+Ext.getCmp(pageType+'DropoffZipcode').getValue()+',';
			}
			else
			if (Ext.getCmp(pageType+'DropoffAreaType').getValue() == 3)
			{
				//long distance area
				rawDataString+=Ext.getCmp(pageType+'DropoffZone').getValue()+','+Ext.getCmp(pageType+'DropoffZipcode').getValue()+','+Ext.getCmp(pageType+'DropoffCity').getValue()+',,'+Ext.getCmp(pageType+'DropoffState').getValue();
			}
			else
			{
				//landmark area
				rawDataString+=Ext.getCmp(pageType+'DropoffZone').getValue()+',,';
			}//alert('rawDataString ' + rawDataString);
			getTaxes();
			///alert('after tax call');
			Ext.Ajax.request(
			{
				url:'findAPrice2.php',
				params:
				{
					'AccountID':AccountID,
					'RateBookID':rateBookID,
					'RawData':rawDataString,
					'VehicleType':VehicleType
				},
				success:function(f,a)
				{
					var result = Ext.JSON.decode(f.responseText);
					if (result['success'])
					{ //alert('success');
						result = result['data'];
						result = result['message'];
						if (result)
						{
							if (Ext.getCmp(pageType+'BaseRate'))
							{
								Ext.getCmp(pageType+'BaseRate').setValue(result['BaseRate']);
							}
							if (Ext.getCmp(pageType+'StopsRate'))
							{
								Ext.getCmp(pageType+'StopsRate').setValue(result['StopsRate']);
							}
							if (Ext.getCmp(pageType+'Price'))
							{
								Ext.getCmp(pageType+'Price').setValue(result['Total']);
							}
							if(Ext.getCmp(pageType+'PriceBreakdown'))
							{
								Ext.getCmp(pageType+'PriceBreakdown').setValue('Base Rate: '+result['BaseRate']+'<BR>Stops Rate: '+result['StopsRate']+'<BR>');
							}
							getCharges('');
							if (Ext.getCmp('Submit'))
								Ext.getCmp('Submit').enable();
						}
					}
				},	
				failure:function(f,a)
				{

				}
			});
		}
	}else{
		//------------------------------------------------------------
		if (Ext.getCmp('CreateJobVehicleType'))
		{
			var VehicleType = Ext.getCmp('CreateJobVehicleType').getValue();
		}else{
			var VehicleType = '';
		}
		//------------------------------------------------------------
		if (Ext.getCmp('Company'))
		{
			var CompanyID = Ext.getCmp('Company').getValue();
		}
		else
		if (Ext.getCmp('CreateJobCompanyID'))
		{
			var CompanyID = Ext.getCmp('CreateJobCompanyID').getValue();
		}
		//------------------------------------------------------------
		if (Ext.getCmp('AccountID'))
		{
			var AccountID = Ext.getCmp('AccountID').getValue();
		}
		else
			var AccountID = '';
		//----------------------------------------------------------------
		if (Ext.getCmp('RateBookID'))
		{
			var rateBookID = Ext.getCmp('RateBookID').getValue();
		}
		else
			var rateBookID = '';
		//-----------------------------------------------------------------
		
		if (Ext.getCmp('PickupZone') && Ext.getCmp('PickupZone').getValue() != '' && Ext.getCmp('DropoffZone') && Ext.getCmp('DropoffZone').getValue() != '')
		{
			if (Ext.getCmp('PickupAreaType').getValue() == 1)
			{
				//local area
				rawDataString+=Ext.getCmp('PickupZone').getValue()+',,|';
			}
			else
			if (Ext.getCmp('PickupAreaType').getValue() == 2)
			{
				//zipcode area
				rawDataString+=Ext.getCmp('PickupZone').getValue()+','+Ext.getCmp('PickupZipcode').getValue()+',|';
			}
			else
			if (Ext.getCmp('PickupAreaType').getValue() == 3)
			{
				//long distance area
				rawDataString+=Ext.getCmp('PickupZone').getValue()+','+Ext.getCmp('PickupZipcode').getValue()+','+Ext.getCmp('PickupCity').getValue()+',,'+Ext.getCmp('PickupState').getValue()+'|';
			}
			else
			{
				//landmark area
				rawDataString+=Ext.getCmp('PickupZone').getValue()+',,|';
			}

			for (i=0;i<5;i++)
			{
				if (Ext.getCmp('CreateJobstop'+i+'address'))
				{
					if (Ext.getCmp('CreateJobstop'+i+'address').getRawValue() != '')
					{
						if (Ext.getCmp('stop'+i+'AreaType').getValue() == 1)
						{
							//local area
							rawDataString+=Ext.getCmp('stop'+i+'Zone').getValue()+',,|';
						}
						else
						if (Ext.getCmp('stop'+i+'AreaType').getValue() == 2)
						{
							//zipcode area
							rawDataString+=Ext.getCmp('stop'+i+'Zone').getValue()+','+Ext.getCmp('stop'+i+'Zipcode').getValue()+',|';
						}
						else
						if (Ext.getCmp('stop'+i+'AreaType').getValue() == 3)
						{
							//long distance area
							rawDataString+=Ext.getCmp('stop'+i+'Zone').getValue()+','+Ext.getCmp('stop'+i+'Zipcode').getValue()+','+Ext.getCmp('stop'+i+'City').getValue()+',,'+Ext.getCmp('stop'+i+'State').getValue()+'|';
						}
						else
						{
							//landmark area
							rawDataString+=Ext.getCmp('stop'+i+'Zone').getValue()+',,|';
						}
					}
				}
			}

			if (Ext.getCmp('DropoffAreaType').getValue() == 1)
			{
				//local area
				rawDataString+=Ext.getCmp('DropoffZone').getValue()+',,';
			}
			else
			if (Ext.getCmp('DropoffAreaType').getValue() == 2)
			{
				//zipcode area
				rawDataString+=Ext.getCmp('DropoffZone').getValue()+','+Ext.getCmp('DropoffZipcode').getValue()+',';
			}
			else
			if (Ext.getCmp('DropoffAreaType').getValue() == 3)
			{
				//long distance area
				rawDataString+=Ext.getCmp('DropoffZone').getValue()+','+Ext.getCmp('DropoffZipcode').getValue()+','+Ext.getCmp('DropoffCity').getValue()+',,'+Ext.getCmp('DropoffState').getValue();
			}
			else
			{
				//landmark area
				rawDataString+=Ext.getCmp('DropoffZone').getValue()+',,';
			}
		}
		if(
		(Ext.getCmp('PickupZone') && Ext.getCmp('PickupZone').getValue() != '' && Ext.getCmp('DropoffZone') && Ext.getCmp('DropoffZone').getValue() != '') 
		||
		(Ext.getCmp('FromZone') && Ext.getCmp('FromZone').getValue() != '' && Ext.getCmp('ToZone') && Ext.getCmp('ToZone').getValue() != '')
		)
		{
			getTaxes();

			Ext.Ajax.request(
			{
				url:'findAPrice2.php',
				params:
				{
					'AccountID':AccountID,
					'RateBookID':rateBookID,
					'RawData':rawDataString,
					'VehicleType':VehicleType
				},
				success:function(f,a)
				{
					var result = Ext.JSON.decode(f.responseText);
					if (result['success'])
					{
						result = result['data'];
						result = result['message'];
						if (result)
						{
							if (Ext.getCmp('BaseRate'))
							{
								Ext.getCmp('BaseRate').setValue(result['BaseRate']);
							}
							if (Ext.getCmp('StopsRate'))
							{
								Ext.getCmp('StopsRate').setValue(result['StopsRate']);
							}

							if (Ext.getCmp('CreateJobPrice'))
							{
								Ext.getCmp('CreateJobPrice').setValue(result['Total']);
								Ext.getCmp('CreateJobBaseRate').setValue(result['BaseRate']);
								Ext.getCmp('CreateJobStopsRate').setValue(result['StopsRate']);
								Ext.getCmp('CreateJobPriceBreakdown').setValue('Base Rate: '+result['BaseRate']+'<BR>Stops Rate: '+result['StopsRate']+'<BR>');
								Ext.getCmp('Submit').enable();
							}
							
							getCharges('');
						}
					}
				},	
				failure:function(f,a)
				{

				}
			});
		}
	
	}
}

function manualAddressLoad(comboID, StreetNumber, Street, City, State, Zip, Country)
{ //alert(comboID + ' ' + StreetNumber + ' ' + Street + ' ' + City + ' ' + State + ' ' + Zip + ' ' + Country);
	StreetNumber = Ext.getCmp(StreetNumber).getValue();
	Street = Ext.getCmp(Street).getValue();
	City = Ext.getCmp(City).getValue();
	State = Ext.getCmp(State).getValue();
	Zip = Ext.getCmp(Zip).getValue();
	Country = Ext.getCmp(Country).getRawValue();

	Ext.getCmp(comboID).setValue(StreetNumber+', '+Street+', '+City+', '+State+', '+Zip+', '+Country);

	if (StreetNumber && Street && City && State && Zip)
	{
		/*Ext.getCmp(comboID).getStore().load({params:{'Address':Ext.getCmp(comboID).getValue()}, 
		callback:function(records, operation, success)
		{
			if (records.length == 1)
			{
				if ( Ext.getCmp(Ext.getCmp(comboID).prefix+'Latitude') )
				{
					Ext.getCmp(Ext.getCmp(comboID).prefix+'Latitude').setValue(records[0].get('Latitude'));
				}
				else
				if ( Ext.getCmp('CompanyLatitude') )
				{
					Ext.getCmp('CompanyLatitude').setValue(records[0].get('Latitude'));
				}

				if ( Ext.getCmp(Ext.getCmp(comboID).prefix+'Longitude') )
				{
					Ext.getCmp(Ext.getCmp(comboID).prefix+'Longitude').setValue(records[0].get('Longitude'));
				}
				else
				if ( Ext.getCmp('CompanyLongitude') )
				{
					Ext.getCmp('CompanyLongitude').setValue(records[0].get('Longitude'));
				}
			}
		}});*/
	}
}

function getCharges(pageType)
{
	var CompanyID = '';

	if (Ext.getCmp('VVCompany'))
	{
		CompanyID = Ext.getCmp('VVCompany').getValue();
	}
	else
	if (Ext.getCmp('CreateJobCompanyID') && pageType=='')
	{
		CompanyID = Ext.getCmp('CreateJobCompanyID').getValue();
	}
	else
	if (Ext.getCmp('MRCompanyID') && pageType=='MR')
	{
		CompanyID = Ext.getCmp('MRCompanyID').getValue();
	}

	var PickupTime = '';
	var PickupDate = '';

	if (Ext.getCmp('RequestTime')&& pageType=='')
	{
		PickupTime = Ext.getCmp('RequestTime').getValue();
		PickupDate = Ext.getCmp('RequestDate').getValue();
	}
	else
	if (Ext.getCmp('jobInfoFormReqTime') && pageType=='MR')
	{
		PickupTime = Ext.getCmp('jobInfoFormReqTime').getValue();
		PickupDate = Ext.getCmp('jobInfoRequestDate').getValue();
	}
	else
	if (Ext.getCmp('VVPickupTime'))
	{
		PickupTime = Ext.getCmp('VVPickupTime').getValue();
		PickupDate = Ext.getCmp('VVDispTime').getValue();
	}

	var VehicleType = '';
	if (Ext.getCmp('CreateJobVehicleType') && pageType=='')
	{
		VehicleType = Ext.getCmp('CreateJobVehicleType').getValue();
	}
	else
	if (Ext.getCmp('MRVehicleType')  && pageType=='MR')
	{
		VehicleType = Ext.getCmp('MRVehicleType').getValue();
	}
	
	if (Ext.getCmp('VVBaseRate'))
	{
		Ext.Ajax.request(
		{
			url:'getFiles/getAllCharges.php',
			method:'POST',
			params:
			{
				'BaseRate':Ext.getCmp('VVBaseRate').getValue(),
				'StopsRate':Ext.getCmp('VVStopsRate').getValue(),
				'OriginalWT':Ext.getCmp('VVOriginalWTAmount').getValue(),
				'StopsWT':Ext.getCmp('VVStopsWTAmount').getValue(),
				'AccountID':Ext.getCmp('VVAccountID').getValue(),
				'TaxPercentage':Ext.getCmp('VVTaxPercentage').getValue(),
				'CompanyID':CompanyID,
				'PickupTime':PickupTime,
				'PickupDate':PickupDate,
				'VehicleType':VehicleType
			},
			success:function(f,a)
			{
				var result = Ext.JSON.decode(f.responseText);
				if (result['success'] == "true")
				{
					result = result['data'];
					result['Total'] = Math.ceil(result['Total']*100)/100;
					Ext.getCmp('VVFuelSurcharge').setValue(result['FuelSurcharge']);
					Ext.getCmp('VVTips').setValue(result['Tips']);
					Ext.getCmp('VVDiscount').setValue(result['Discount']);
					Ext.getCmp('VVNYSSurcharge').setValue(result['NYSSurcharge']);
					Ext.getCmp('VVSalesTax').setValue(result['Tax']);
					Ext.getCmp('VVSubTotal').setValue(result['SubTotal']);
					Ext.getCmp('VVTotal').setValue(result['Total']);
				}
			},
			failure:function(f,a)
			{

			}
		});
	}
	else
	if (Ext.getCmp('CreateJobBaseRate')  && pageType=='')
	{
		setTimeout('',250);
		Ext.Ajax.request(
		{
			url:'getFiles/getAllCharges.php',
			method:'POST',
			params:
			{
				'BaseRate':Ext.getCmp('CreateJobBaseRate').getValue(),
				'StopsRate':Ext.getCmp('CreateJobStopsRate').getValue(),
				'FromLatitude':Ext.getCmp('CreateJobPickupLatitude').getValue(),
				'FromLongitude':Ext.getCmp('CreateJobPickupLongitude').getValue(),
				'FromAddress':Ext.getCmp('CreateJobPickUpaddress').getValue(),
				'ToAddress':Ext.getCmp('CreateJobDropOffaddress').getValue(),
				'OriginalWT':0,
				'StopsWT':0,
				'AccountID':Ext.getCmp('CreateJobAccountID').getValue(),
				'TaxPercentage':Ext.getCmp('CreateJobTaxPercentage').getValue(),
				'CompanyID':CompanyID,
				'PickupTime':PickupTime,
				'PickupDate':PickupDate,
				'VehicleType':VehicleType
			},
			success:function(f,a)
			{
				var result = Ext.JSON.decode(f.responseText);
				if (result['success'] == "true")
				{
					result = result['data'];
					result['Total'] = Math.ceil(result['Total']*100)/100;
					Ext.getCmp('CreateJobFuelSurcharge').setValue(result['FuelSurcharge']);
					Ext.getCmp('CreateJobTips').setValue(result['Tips']);
					Ext.getCmp('CreateJobDiscount').setValue(result['Discount']);
					Ext.getCmp('CreateJobNYSSurcharge').setValue(result['NYSSurcharge']);
					Ext.getCmp('CreateJobSalesTax').setValue(result['Tax']);
					Ext.getCmp('CreateJobSubTotal').setValue(result['SubTotal']);
					Ext.getCmp('NightCharge').setValue((result['NightRate'] ? result['NightRate'] : 0));
					Ext.getCmp('HolidayCharge').setValue((result['HolidayRate'] ? result['HolidayRate'] : 0));
					Ext.getCmp('CreateJobPrice').setValue(result['Total']);

					var BreakDownString = '';
					BreakDownString+='Base Rate: '+Ext.getCmp('CreateJobBaseRate').getValue()+'<BR>';
					BreakDownString+='Stops Rate: '+Ext.getCmp('CreateJobStopsRate').getValue()+'<BR>';
					BreakDownString+='Fuel Surcharge: '+Ext.getCmp('CreateJobFuelSurcharge').getValue()+'<BR>';
					BreakDownString+='Sub Total: '+Ext.getCmp('CreateJobSubTotal').getValue()+'<BR>';
					BreakDownString+='Tips: '+Ext.getCmp('CreateJobTips').getValue()+'<BR>';
					BreakDownString+='Discount: '+Ext.getCmp('CreateJobDiscount').getValue()+'<BR>';
					BreakDownString+='NYS Surcharge: '+Ext.getCmp('CreateJobNYSSurcharge').getValue()+'<BR>';
					BreakDownString+='Sales Tax: '+Ext.getCmp('CreateJobSalesTax').getValue()+'<BR>';
					BreakDownString+='Night Rate: '+Ext.getCmp('NightCharge').getValue()+'<BR>';
					BreakDownString+='Holiday Rate: '+Ext.getCmp('HolidayCharge').getValue()+'<BR>';
					BreakDownString+='Total: '+Ext.getCmp('CreateJobPrice').getValue()+'<BR>';
					Ext.getCmp('CreateJobPriceBreakdown').setValue(BreakDownString);
				}
			},
			failure:function(f,a)
			{

			}
		});
	}
	else
	if (Ext.getCmp('MRBaseRate') && pageType=='MR')
	{ 
		Ext.Ajax.request(
		{
			url:'getFiles/getAllCharges.php',
			method:'POST',
			params:
			{
				'BaseRate':Ext.getCmp('MRBaseRate').getValue(),
				'StopsRate':Ext.getCmp('MRStopsRate').getValue(),
				'OriginalWT':0,
				'StopsWT':0,
				'AccountID':Ext.getCmp('MRAccountID').getValue(),
				'TaxPercentage':Ext.getCmp('jobInfoFormTaxPercentage').getValue(),
				'CompanyID':CompanyID,
				'PickupTime':PickupTime,
				'PickupDate':PickupDate,
				'VehicleType':VehicleType
			},
			success:function(f,a)
			{
				var result = Ext.JSON.decode(f.responseText);
				if (result['success'] == "true")
				{
					result = result['data'];
					result['Total'] = Math.ceil(result['Total']*100)/100;
					Ext.getCmp('jobInfoFormFuelSurcharge').setValue(result['FuelSurcharge']);
					Ext.getCmp('jobInfoFormTips').setValue(result['Tips']);
					Ext.getCmp('jobInfoFormDiscount').setValue(result['Discount']);
					Ext.getCmp('jobInfoFormNYSSurcharge').setValue(result['NYSSurcharge']);
					Ext.getCmp('jobInfoFormSalesTax').setValue(result['Tax']);
					Ext.getCmp('jobInfoFormSubTotal').setValue(result['SubTotal']);
					Ext.getCmp('MRPrice').setValue(result['Total']);

					var BreakDownString = '';
					BreakDownString+='Base Rate: '+Ext.getCmp('MRBaseRate').getValue()+'<BR>';
					BreakDownString+='Stops Rate: '+Ext.getCmp('MRStopsRate').getValue()+'<BR>';
					BreakDownString+='Fuel Surcharge: '+Ext.getCmp('jobInfoFormFuelSurcharge').getValue()+'<BR>';
					BreakDownString+='Sub Total: '+Ext.getCmp('jobInfoFormSubTotal').getValue()+'<BR>';
					BreakDownString+='Tips: '+Ext.getCmp('jobInfoFormTips').getValue()+'<BR>';
					BreakDownString+='Discount: '+Ext.getCmp('jobInfoFormDiscount').getValue()+'<BR>';
					BreakDownString+='NYS Surcharge: '+Ext.getCmp('jobInfoFormNYSSurcharge').getValue()+'<BR>';
					BreakDownString+='Sales Tax: '+Ext.getCmp('jobInfoFormSalesTax').getValue()+'<BR>';
					BreakDownString+='Total: '+Ext.getCmp('MRPrice').getValue()+'<BR>';
					Ext.getCmp('MRPriceBreakdown').setValue(BreakDownString);
				}
			},
			failure:function(f,a)
			{

			}
		});
	}
}

function getTaxes()
{
	//alert(Ext.getCmp('VVFromState').getValue()+' and '+Ext.getCmp('VVToState').getValue());
	if (Ext.getCmp('VVFromState') && Ext.getCmp('VVToState') && Ext.getCmp('VVFromState').getValue() != '' && Ext.getCmp('VVToState').getValue() != '')
	{
		if (Ext.getCmp('VVFromState').getValue() == Ext.getCmp('VVToState').getValue())
		{
			Ext.Ajax.request(
			{
				url:'getFiles/getTaxPercentage.php',
				method:'POST',
				params:
				{
					'State':Ext.getCmp('VVFromState').getValue(),
					'County':Ext.getCmp('VVFromCounty').getValue(),
					'Town':Ext.getCmp('VVFromCity').getValue()
				},
				success:function(f,a)
				{
					var result = Ext.JSON.decode(f.responseText);
					if (result['rows'])
					{
						result = result['rows'];
						if (result.length > 0)
						{
							result = result[0];
							result = result['Percentage'];
							Ext.getCmp('VVTaxPercentage').setValue(result);
						}
						else
						{
							Ext.getCmp('VVTaxPercentage').setValue('');
						}
					}
					else
					{
						Ext.getCmp('VVTaxPercentage').setValue('');
					}
				},
				failure:function(f,a)
				{

				}
			});			
		}	
	}
	else
	if (Ext.getCmp('CreateJobPickupState') && Ext.getCmp('CreateJobPickupState').getValue() != '' && Ext.getCmp('CreateJobDropoffState') && Ext.getCmp('CreateJobDropoffState').getValue() != '')
	{
		if (Ext.getCmp('CreateJobPickupState').getValue() == Ext.getCmp('CreateJobDropoffState').getValue())
		{
			Ext.Ajax.request(
			{
				url:'getFiles/getTaxPercentage.php',
				method:'POST',
				params:
				{
					'State':Ext.getCmp('CreateJobPickupState').getValue(),
					'County':'',
					'Town':Ext.getCmp('CreateJobPickupCity').getValue()
				},
				success:function(f,a)
				{
					var result = Ext.JSON.decode(f.responseText);
					if (result['rows'])
					{
						result = result['rows'];
						if (result.length > 0)
						{
							result = result[0];
							result = result['Percentage'];
							(Ext.getCmp('CreateJobTaxPercentage') ? Ext.getCmp('CreateJobTaxPercentage').setValue(result) : Ext.getCmp('jobInfoFormTaxPercentage').setValue(result));
						}
						else
						{
							(Ext.getCmp('CreateJobTaxPercentage') ? Ext.getCmp('CreateJobTaxPercentage').setValue('') : Ext.getCmp('jobInfoFormTaxPercentage').setValue(''));
						}
					}
					else
					{
						Ext.getCmp('CreateJobTaxPercentage').setValue('');
					}
				},
				failure:function(f,a)
				{

				}
			});			
		}
	}
}

function manualSwitch(prefix, addressID)
{
	if ( !Ext.getCmp(prefix+'StreetNumber').isDisabled() )
	{
		Ext.getCmp(prefix+'StreetNumber').setValue('');
		Ext.getCmp(prefix+'StreetNumber').disable();
		
		if (Ext.getCmp(prefix+'Street'))
		{
			Ext.getCmp(prefix+'Street').setValue('');
			Ext.getCmp(prefix+'Street').disable();
		}

		if (Ext.getCmp(prefix+'City'))
		{
			Ext.getCmp(prefix+'City').setValue('');
			Ext.getCmp(prefix+'City').disable();
		}
		if (Ext.getCmp(prefix+'County'))
		{
			Ext.getCmp(prefix+'County').setValue('');
			Ext.getCmp(prefix+'County').disable();
		}
		if (Ext.getCmp(prefix+'State'))
		{
			Ext.getCmp(prefix+'State').setValue('');
			Ext.getCmp(prefix+'State').disable();
		}
		if (Ext.getCmp(prefix+'Zipcode'))
		{
			Ext.getCmp(prefix+'Zipcode').setValue('');
			Ext.getCmp(prefix+'Zipcode').disable();
		}

		if (Ext.getCmp(prefix+'Country'))
		{
			Ext.getCmp(prefix+'Country').setValue('');
			Ext.getCmp(prefix+'Country').disable();
		}
		else
		{
			Ext.getCmp('CompanyCountry').setValue('');
			Ext.getCmp('CompanyCountry').disable();	
		}

		Ext.getCmp(addressID).enable();
	}
	else
	{
		Ext.getCmp(addressID).setValue('');
		Ext.getCmp(addressID).disable();

		Ext.getCmp(prefix+'StreetNumber').setValue('');
		Ext.getCmp(prefix+'StreetNumber').enable();
		
		if (Ext.getCmp(prefix+'Street'))
		{
			Ext.getCmp(prefix+'Street').setValue('');
			Ext.getCmp(prefix+'Street').enable();
		}

		if (Ext.getCmp(prefix+'City'))
		{
			Ext.getCmp(prefix+'City').setValue('');
			Ext.getCmp(prefix+'City').enable();
		}
		if (Ext.getCmp(prefix+'County'))
		{
			Ext.getCmp(prefix+'County').setValue('');
			Ext.getCmp(prefix+'County').enable();
		}
		if (Ext.getCmp(prefix+'State'))
		{
			Ext.getCmp(prefix+'State').setValue('');
			Ext.getCmp(prefix+'State').enable();
		}
		if (Ext.getCmp(prefix+'Zipcode'))
		{
			Ext.getCmp(prefix+'Zipcode').setValue('');
			Ext.getCmp(prefix+'Zipcode').enable();
		}

		if (Ext.getCmp(prefix+'Country'))
		{
			Ext.getCmp(prefix+'Country').setValue('');
			Ext.getCmp(prefix+'Country').enable();
		}
		else
		{
			Ext.getCmp('CompanyCountry').setValue('');
			Ext.getCmp('CompanyCountry').enable();	
		}
	}
}
