function createCSV(Store, Grid, fileName)
{
	var CSVString = '';
	fileName= Grid.getId() +'-'+ fileName;
	var columnCount = Grid.columns.length;
	//alert(columnCount);
	for (i=0;i<columnCount;i++)
	{
		CSVString+=Grid.columns[i].name;
		if (i != columnCount-1)
			CSVString+=',';
	}
	
	CSVString+='|';
	
	for (i=0;i<Store.getCount();i++)
	{
		for (j=0;j<columnCount;j++)
		{
			CSVString += Store.getAt(i).get(Grid.columns[j].dataIndex);
			if (j != columnCount-1)
				CSVString+=',';
		}
		CSVString += '|';
	}

	var url='createCSV.php';

	if (document.getElementById('csv'))
		document.getElementById('csv').value=CSVString;
	if (document.getElementById('fileName'))
		document.getElementById('fileName').value=fileName;
	if (document.getElementById('csv') && document.getElementById('fileName'))
		document.csvForm.submit();
	else
		window.open(url+'?csv='+CSVString+'&fileName='+fileName);
	
}
