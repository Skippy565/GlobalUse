Ext.define('AddressCombo',
{
	alias:'widget.addressCombo',
	extend:'Ext.form.field.ComboBox',
	queryMode:'remote',
	queryDelay:200,
	queryParam:'Address',
	enableKeyEvents:true,
	valueField:'FormattedAddress',
	displayField:'FormattedAddress',
	autoSelection:false,
	recentResolve:false,
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
		focus:function(combo,options)
		{
			combo.expand();
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

			if ( event && event.getKey() == 13)
			{
				if (combo.getStore().getCount() == 1)
				{ 
					combo.setValue(combo.getStore().getAt(0).get('FormattedAddress'));
					var record = combo.getStore().getAt(0);
					if (Ext.getCmp(combo.prefix+'StreetNumber'))
					{
						Ext.getCmp(combo.prefix+'StreetNumber').setValue(record.get('HouseNumber'));
					}
					if (Ext.getCmp(combo.prefix+'Street'))
					{
						Ext.getCmp(combo.prefix+'Street').setValue(record.get('Street'));
					}
					if (Ext.getCmp(combo.prefix+'City'))
					{
						Ext.getCmp(combo.prefix+'City').setValue(record.get('City'));
					}
					if (Ext.getCmp(combo.prefix+'County'))
					{
						Ext.getCmp(combo.prefix+'County').setValue(record.get('County'));
					}
					if (Ext.getCmp(combo.prefix+'State'))
					{
						Ext.getCmp(combo.prefix+'State').setValue(record.get('State'));
					}
					if (Ext.getCmp(combo.prefix+'Zipcode'))
					{
						Ext.getCmp(combo.prefix+'Zipcode').setValue(record.get('Zipcode'));
					}
					if (Ext.getCmp(combo.prefix+'Latitude'))
					{
						Ext.getCmp(combo.prefix+'Latitude').setValue(record.get('Latitude'));
					}
					if (Ext.getCmp(combo.prefix+'Longitude'))
					{
						Ext.getCmp(combo.prefix+'Longitude').setValue(record.get('Longitude'));
					}
					if (Ext.getCmp(combo.prefix+'Country'))
					{
						if (record.get('Country') == 'United States of America' || record.get('Country') == 'US')
						{
							record.set('Country', 'USA');
						}

						if (Ext.data.StoreManager.lookup('CompanyCountryStore'))
						{
							var index = Ext.data.StoreManager.lookup('CompanyCountryStore').find('Country', record.get('Country'));
							if (index != -1)
								Ext.getCmp(combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CompanyCountryStore').getAt(index).get('ID'));
						}
						else
						if (Ext.data.StoreManager.lookup('CountryStore'))
						{
							var index = Ext.data.StoreManager.lookup('CountryStore').find('Country', record.get('Country'));
							if (index != -1)
								Ext.getCmp(combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CountryStore').getAt(index).get('ID'));
						}
					}
					combo.collapse();
				}
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
				globalMap.setView(new L.LatLng(combo.getStore().getAt(0).get('Latitude'), combo.getStore().getAt(0).get('Longitude')), 14);	
				
				if(globalMarker)
					globalMap.removeLayer(globalMarker);
				if(globalMarker!=null)
					globalMarker = L.marker([combo.getStore().getAt(0).get('Latitude'), combo.getStore().getAt(0).get('Longitude')]).addTo(globalMap);		
				if(CircleArea)
					globalMap.removeLayer(CircleArea);
			}

			if (Ext.getCmp(combo.prefix+'StreetNumber') && record.get('HouseNumber') != '')
			{
				Ext.getCmp(combo.prefix+'StreetNumber').setValue(record.get('HouseNumber'));
			}
			if (Ext.getCmp(combo.prefix+'Street'))
			{
				Ext.getCmp(combo.prefix+'Street').setValue(record.get('Street'));
			}

			if (Ext.getCmp(combo.prefix+'City'))
			{
				Ext.getCmp(combo.prefix+'City').setValue(record.get('City'));
			}
			if (Ext.getCmp(combo.prefix+'County'))
			{
				Ext.getCmp(combo.prefix+'County').setValue(record.get('County'));
			}
			if (Ext.getCmp(combo.prefix+'State'))
			{
				Ext.getCmp(combo.prefix+'State').setValue(record.get('State'));
			}
			if (Ext.getCmp(combo.prefix+'Zipcode'))
			{
				Ext.getCmp(combo.prefix+'Zipcode').setValue(record.get('Zipcode'));
			}
			if (Ext.getCmp(combo.prefix+'Latitude'))
			{
				Ext.getCmp(combo.prefix+'Latitude').setValue(record.get('Latitude'));
			}
			if (Ext.getCmp(combo.prefix+'Longitude'))
			{
				Ext.getCmp(combo.prefix+'Longitude').setValue(record.get('Longitude'));
			}
			if (Ext.getCmp(combo.prefix+'Country'))
			{
				if (record.get('Country') == 'United States of America' || record.get('Country') == 'US')
				{
					record.set('Country', 'USA');
				}

				if (Ext.data.StoreManager.lookup('CompanyCountryStore'))
				{
					var index = Ext.data.StoreManager.lookup('CompanyCountryStore').find('Country', record.get('Country'));
					if (index != -1)
						Ext.getCmp(combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CompanyCountryStore').getAt(index).get('ID'));
				}
				else
				if (Ext.data.StoreManager.lookup('CountryStore'))
				{
					var index = Ext.data.StoreManager.lookup('CountryStore').find('Country', record.get('Country'));
					if (index != -1)
						Ext.getCmp(combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CountryStore').getAt(index).get('ID'));
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

			if (combo.Zoning)
			{
				Ext.Ajax.request(
				{
					url:'getFiles/getPriceZone.php',
					params:
					{
						'CompanyID':Ext.getCmp(combo.company).getValue(),
						'AccountID':Ext.getCmp(combo.account).getValue(),
						'Address':combo.getValue(),
						'City':Ext.getCmp(combo.prefix+'City').getValue(),
						'State':Ext.getCmp(combo.prefix+'State').getValue(),
						'Zipcode':Ext.getCmp(combo.prefix+'Zipcode').getValue(),
						'Latitude':Ext.getCmp(combo.prefix+'Latitude').getValue(),
						'Longitude':Ext.getCmp(combo.prefix+'Longitude').getValue()
					},
					success:function(f,a)
					{
						var result = Ext.JSON.decode(f.responseText);
						if (result['success'])
						{
							result = result['rows'];
						
							Ext.getCmp(combo.prefix+'Zone').setValue(result['Code']);
							Ext.getCmp(combo.prefix+'AreaType').setValue(result['AreaType']);
							if (combo.blackCarPricing)
							{
								getBlackCarPrice(combo.blackCarPricing);
							}
						}
						else
						{
							Ext.getCmp(combo.prefix+'Zone').setValue('');
						}
					},	
					failure:function(f,a)
					{

					}
				});
			}
	
			if (combo.getTaxPercentage)
			{
				getTaxes();
			}

		},
		blur:function(combo, options)
		{
			var index = combo.getStore().find('FormattedAddress', combo.getRawValue());

			
			if (combo.getStore().getCount() == 1)
			{
				combo.setValue(combo.getStore().getAt(0).get('FormattedAddress'));
			}
			if (index == -1 && combo.getRawValue() != '')
			{
				Ext.Msg.alert('Warning', 'Address entered does not match anything found');
			}
			else
			if (index != -1)
			{
				var record = combo.getStore().getAt(index);


				if (Ext.getCmp(combo.prefix+'StreetNumber') && record.get('HouseNumber') != '')
				{
					Ext.getCmp(combo.prefix+'StreetNumber').setValue(record.get('HouseNumber'));
				}
				if (Ext.getCmp(combo.prefix+'Street'))
				{
					Ext.getCmp(combo.prefix+'Street').setValue(record.get('Street'));
				}

				if (Ext.getCmp(combo.prefix+'City'))
				{
					Ext.getCmp(combo.prefix+'City').setValue(record.get('City'));
				}
				if (Ext.getCmp(combo.prefix+'County'))
				{
					Ext.getCmp(combo.prefix+'County').setValue(record.get('County'));
				}
				if (Ext.getCmp(combo.prefix+'State'))
				{
					Ext.getCmp(combo.prefix+'State').setValue(record.get('State'));
				}
				if (Ext.getCmp(combo.prefix+'Zipcode'))
				{
					Ext.getCmp(combo.prefix+'Zipcode').setValue(record.get('Zipcode'));
				}
				if (Ext.getCmp(combo.prefix+'Latitude'))
				{
					Ext.getCmp(combo.prefix+'Latitude').setValue(record.get('Latitude'));
				}
				if (Ext.getCmp(combo.prefix+'Longitude'))
				{
					Ext.getCmp(combo.prefix+'Longitude').setValue(record.get('Longitude'));
				}

				if (Ext.getCmp(combo.prefix+'Country'))
				{
					if (record.get('Country') == 'United States of America' || record.get('Country') == 'US')
					{
						record.set('Country', 'USA');
					}

					if (Ext.data.StoreManager.lookup('CountryStore'))
					{
						var index = Ext.data.StoreManager.lookup('CountryStore').find('Country', record.get('Country'));
						if (index != -1)
							Ext.getCmp(combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CountryStore').getAt(index).get('ID'));
					}
				}

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
					else
					if (Ext.data.StoreManager.lookup('CountryStore'))
					{
						var index = Ext.data.StoreManager.lookup('CountryStore').find('Country', record.get('Country'));
						if (index != -1)
							Ext.getCmp(combo.prefix+'Country').setValue(Ext.data.StoreManager.lookup('CountryStore').getAt(index).get('ID'));
					}
				}
			}

			if (combo.landmarkCheck)
			{
				checkForLandmark(combo.prefix);
			}
			
			if (combo.prices)
			{ 
				if (Ext.getCmp(combo.FromAddress).getRawValue() != '' && Ext.getCmp(combo.ToAddress).getRawValue() != '')
				{
					Ext.Ajax.request(
					{
						url:'API/getPriceAPISubmit.php',
						params:
						{
							'FromAddress':Ext.getCmp(combo.FromAddress).getRawValue(),
							'FromLatitude':Ext.getCmp('PickupLatitude').getValue(),
							'FromLongitude':Ext.getCmp('PickupLongitude').getValue(),
							'ToAddress':Ext.getCmp(combo.ToAddress).getRawValue(),
							'ToLatitude':Ext.getCmp('DropoffLatitude').getValue(),
							'ToLongitude':Ext.getCmp('DropoffLongitude').getValue(),
							'Action':'GetHours'
						},
						success:function(request, response)
						{
								var minutes = request.responseText.split('Minutes:');
								minutes = minutes[1];
								if (Ext.getCmp(combo.ToAddress).getRawValue().indexOf('Airport') != -1)
									minutes = parseInt(minutes)*2;

								if (parseInt(minutes) > 0)
								{
									Ext.getCmp('EstimatedTime').disable();
								}
								else
								{
									Ext.getCmp('EstimatedTime').enable();
									if (Ext.getCmp('EstimatedTime').getValue() == '' || Ext.getCmp('EstimatedTime').getValue() > 0)
										Ext.Msg.alert('Error', 'Travel time could not be calculated, please enter');
								}

								Ext.getCmp('EstimatedTime').setValue(minutes);
								Ext.getCmp(combo.category + 'Hours/Milage').setValue(minutes);
								calculatePrice();
						},
						failure:function(request, response)
						{

						}
					});
				}				
			}

			if (combo.airportCheck)
			{
				if (Ext.getCmp(combo.FromAddress).getRawValue().indexOf('Airport') != -1 || Ext.getCmp(combo.ToAddress).getRawValue().indexOf('Airport') != -1)
				{
					Ext.getCmp('Airline').enable();
					Ext.getCmp('FlightNumber').enable();
					Ext.getCmp('Terminal').enable();
					Ext.getCmp('FlightTime').enable();
					Ext.getCmp('BoardingTime').enable();
					Ext.getCmp('GraceTime').setValue(60);

					if (Ext.getCmp('FlightNumber').getValue() != '' && Ext.getCmp('Airline').getRawValue() != '')
					{
						Ext.data.StoreManager.lookup('FlightInformationStore').load({params:{
							'FlightNumber':Ext.getCmp('FlightNumber').getValue(),
							'FlightCode':Ext.getCmp('Airline').getValue(),
							'Date':Ext.getCmp('RequestDate').getValue(),
							'FromAddress':Ext.getCmp('CreateJobPickUpaddress').getValue(),
							'ToAddress':Ext.getCmp('CreateJobDropOffaddress').getValue(),
							'Action':'getFlightsFeed'
						}});
					}


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

			if (combo.Zoning)
			{
				Ext.Ajax.request(
				{
					url:'getFiles/getPriceZone.php',
					params:
					{
						'CompanyID':Ext.getCmp(combo.company).getValue(),
						'AccountID':Ext.getCmp(combo.account).getValue(),
						'Address':combo.getValue(),
						'City':Ext.getCmp(combo.prefix+'City').getValue(),
						'State':Ext.getCmp(combo.prefix+'State').getValue(),
						'Zipcode':Ext.getCmp(combo.prefix+'Zipcode').getValue(),
						'Latitude':Ext.getCmp(combo.prefix+'Latitude').getValue(),
						'Longitude':Ext.getCmp(combo.prefix+'Longitude').getValue()
					},
					success:function(f,a)
					{
						var result = Ext.JSON.decode(f.responseText);
						if (result['success'])
						{
							result = result['rows'];
						
							Ext.getCmp(combo.prefix+'Zone').setValue(result['Code']);
							Ext.getCmp(combo.prefix+'AreaType').setValue(result['AreaType']);
							if (combo.blackCarPricing)
							{
								getBlackCarPrice(combo.blackCarPricing);
							}
						}
						else
						{
							Ext.getCmp(combo.prefix+'Zone').setValue('');
						}
					},	
					failure:function(f,a)
					{

					}
				});
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
		},
		change:function(box, newValue, oldValue, options)
		{
			if (Ext.data.StoreManager.lookup('RecentAddressesStore'))
			{
				if (newValue && newValue == '')
				{
					for (i=0;i<Ext.data.StoreManager.lookup('RecentAddressesStore').getCount();i++)
					{
						var address = Ext.data.StoreManager.lookup('RecentAddressesStore').getAt(i).get('Address');
						box.getStore().loadData([['','',address,'','','','']],true);
					}
				}
			}
		}	
	}
});

function getBlackCarPrice(prefix)
{
	var CompanyID = Ext.getCmp(prefix+'Company').getValue();
	var AccountID = Ext.getCmp(prefix+'AccountID').getValue();
	var rateBookID = Ext.getCmp(prefix+'RateBookID').getValue();

	var rawDataString = '';
	if (Ext.getCmp(prefix+'FromZone').getValue() != '' && Ext.getCmp(prefix+'ToZone').getValue() != '')
	{
		if (Ext.getCmp(prefix+'FromAreaType').getValue() == 1)
		{
			//local area
			rawDataString+=Ext.getCmp(prefix+'FromZone').getValue()+',,|';
		}
		else
		if (Ext.getCmp(prefix+'FromAreaType').getValue() == 2)
		{
			//zipcode area
			rawDataString+=Ext.getCmp(prefix+'FromZone').getValue()+','+Ext.getCmp(prefix+'FromZipcode').getValue()+',|';
		}
		else
		if (Ext.getCmp(prefix+'FromAreaType').getValue() == 3)
		{
			//long distance area
			rawDataString+=Ext.getCmp(prefix+'FromZone').getValue()+','+Ext.getCmp(prefix+'FromZipcode').getValue()+','+Ext.getCmp(prefix+'FromCity').getValue()+','+Ext.getCmp(prefix+'FromCounty').getValue()+','+Ext.getCmp(prefix+'FromState').getValue()+'|';
		}
		else
		{
			//landmark area
		}

		for (i=1;i<6;i++)
		{
			if (Ext.getCmp(prefix+'Stop'+i+'Address').getRawValue() != '')
			{
				if (Ext.getCmp(prefix+'Stop'+i+'AreaType').getValue() == 1)
				{
					//local area
					rawDataString+=Ext.getCmp(prefix+'Stop'+i+'Zone').getValue()+',,|';
				}
				else
				if (Ext.getCmp(prefix+'Stop'+i+'AreaType').getValue() == 2)
				{
					//zipcode area
					rawDataString+=Ext.getCmp(prefix+'Stop'+i+'Zone').getValue()+','+Ext.getCmp(prefix+'Stop'+i+'Zipcode').getValue()+',|';
				}
				else
				if (Ext.getCmp(prefix+'Stop'+i+'AreaType').getValue() == 3)
				{
					//long distance area
					rawDataString+=Ext.getCmp(prefix+'Stop'+i+'Zone').getValue()+','+Ext.getCmp(prefix+'Stop'+i+'Zipcode').getValue()+','+Ext.getCmp(prefix+'Stop'+i+'City').getValue()+','+Ext.getCmp(prefix+'Stop'+i+'County').getValue()+','+Ext.getCmp(prefix+'Stop'+i+'State').getValue()+'|';
				}
				else
				{
					//landmark area
				}
			}
		}

		if (Ext.getCmp(prefix+'ToAreaType').getValue() == 1)
		{
			//local area
			rawDataString+=Ext.getCmp(prefix+'ToZone').getValue()+',,';
		}
		else
		if (Ext.getCmp(prefix+'ToAreaType').getValue() == 2)
		{
			//zipcode area
			rawDataString+=Ext.getCmp(prefix+'ToZone').getValue()+','+Ext.getCmp(prefix+'ToZipcode').getValue()+',';
		}
		else
		if (Ext.getCmp(prefix+'ToAreaType').getValue() == 3)
		{
			//long distance area
			rawDataString+=Ext.getCmp(prefix+'ToZone').getValue()+','+Ext.getCmp(prefix+'ToZipcode').getValue()+','+Ext.getCmp(prefix+'ToCity').getValue()+','+Ext.getCmp(prefix+'ToCounty').getValue()+','+Ext.getCmp(prefix+'ToState').getValue();
		}
		else
		{
			//landmark area
		}
	}

	//alert(rawDataString);

	Ext.Ajax.request(
	{
		url:'findAPrice2.php',
		params:
		{
			'AccountID':AccountID,
			'RateBookID':rateBookID,
			'RawData':rawDataString
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
					if (Ext.getCmp(prefix+'BaseRate'))
					{
						Ext.getCmp(prefix+'BaseRate').setValue(result['BaseRate']);
					}
					if (Ext.getCmp(prefix+'StopsRate'))
					{
						Ext.getCmp(prefix+'StopsRate').setValue(result['StopsRate']);
					}
					getCharges();
				}
			}
		},	
		failure:function(f,a)
		{

		}
	});
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
