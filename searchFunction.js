function searchFunction(panel){	 
	var fieldNameStore = Ext.create('Ext.data.ArrayStore',
	{
            // store configs
            autoDestroy: true,
            storeId: 'fieldNameStore',
            // reader configs
            idIndex: 0, 
            fields: [
               'DataIndex',
               {name: 'fieldName'},
            ]
        });

	Ext.define('fieldNames',
	{
		extend:'Ext.data.Model',
		fields:
		[
			{name:'DataIndex', type:'string'},
			{name:'fieldName', type:'string'}
		]
	});

        var size = panel.columns.length;
        var temparray=[];       
        for(i=0;i<size;i++){
            var tempArray2=[];
		if(!panel.columns[i].isHidden()){
			    tempArray2[1]=panel.columns[i].name;
			    tempArray2[0]=panel.columns[i].dataIndex;
			    temparray[temparray.length]=tempArray2;
		}
        }
        fieldNameStore.loadData(temparray);
        
	var gridSearchForm = new Ext.FormPanel({
		border:true,
		title: 'Search',
		name: 'GridSearchForm',
		id: 'GridSearchForm',
		width: 600,
		items:[
			{
				xtype:'combo',
				fieldLabel: 'Field name',
				name: 'fieldName',
				id: 'fieldName',
				store: fieldNameStore,
				queryMode: 'local',
				valueField: 'DataIndex',
    				displayField: 'fieldName'
			},
			{
				xtype:'textfield',
				fieldLabel: 'Filter',
				name: 'searchFilter',
				id: 'searchFilter'
			}			
		],
		buttons:[
			{
			text: 'Search',
			cls:'btn btn-primary',
			name: 'SearchButton',
				handler: function(){
					panel = Ext.getCmp(panel.getId());
					var where = Ext.getCmp('fieldName').getValue();
					var what = Ext.getCmp('searchFilter').getValue();
					panel.getStore().filter(where, what, true, false, false); 
					win.close();	
				}		
			}
		]

	});
	var win= new Ext.Window({
		width:595,
		modal: true,
		id:'SearchWindow',
		name:'SearchWindow',
		title:'Search Window'
	});
	win.add(gridSearchForm);
	win.show();
}
