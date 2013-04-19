Ext.apply(Ext.form.field.VTypes, 
{
	Phone:function(v)
	{
		return /^(\d{3}[-]?){1,2}(\d{4})$/.test(v);
	},
		PhoneText: 'Not a valid phone number.Must be in the format 123-4567 or 123-456-7890 (dashes optional)',
		PhoneMask: /[\d-]/
});	
Ext.apply(Ext.form.field.VTypes, 
{
	Time:function(v)
	{
		return /^([1-9]|1[0-9]):([0-5][0-9])(\s[a|p]m)$/i.test(v);
	},	
		TimeText: 'Not a valid time.Must be in the format 12:34 PM',
		TimeMask: /[\d\s:amp]/i
});
 Ext.apply(Ext.form.field.VTypes, 
{
        Daterange: function(val, field) 
	{
            var date = field.parseDate(val);

            if (!date) 
		{
                	return false;
	        }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) 
		{
		        var start = field.up('form').down('#' + field.startDateField);
		        start.setMaxValue(date);
		        start.validate();
		        this.dateRangeMax = date;
            	}
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) 
		{
		        var end = field.up('form').down('#' + field.endDateField);
		        end.setMinValue(date);
		        end.validate();
		        this.dateRangeMin = date;
            	}
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },

        daterangeText: 'Start date must be less than end date'
});
Ext.apply(Ext.form.field.VTypes, 
{
	SSN:function(v)
	{
		return /^([0-6]\d{2}|7[0-6]\d|77[0-2])([ \-]?)(\d{2})\2(\d{4})$/.test(v);
	},
		SSNText: 'Social Security number must be entered in the format XXX-XX-XXXX or XXXXXXXXX',
		SSNMask: /[\d-]/

});
