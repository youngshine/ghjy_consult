Ext.define("Ext.ux.TimePickerField", {
  extend: "Ext.field.Text",
  xtype: "timepickerfield",

  constructor: function (config) {

    // We're going to start by making string values of all of the times.

    var i,
    data_hours = [
    	{text: '08', value: '08'},
		{text: '09', value: '09'},
		{text: '10', value: '10'},
		{text: '11', value: '11'},
		{text: '12', value: '12'},
		{text: '13', value: '13'},
		{text: '14', value: '14'},
		{text: '15', value: '15'},
		{text: '16', value: '16'},
		{text: '17', value: '17'},
		{text: '18', value: '18'},
		{text: '19', value: '19'},
		{text: '20', value: '20'},
		{text: '21', value: '21'}
	],
    data_minuts = [
    	{text: '00', value: '00'},
		{text: '05', value: '05'},
		{text: '10', value: '10'},
		{text: '15', value: '15'},
		{text: '20', value: '20'},
		{text: '25', value: '25'},
		{text: '30', value: '30'},
		{text: '35', value: '35'},
		{text: '40', value: '40'},
		{text: '45', value: '45'},
		{text: '50', value: '50'},
		{text: '55', value: '55'}
    ]
    //data_AMPM = [],
    //stringVal,

    that = this;
/*  for(i=1; i<13; i++) {
      data_hours.push({
        text: i,
        value: i
      });
    }   
    data_minuts.push({
      text: '00',
      value: '00'
    });
    var val = 15;
    for(i=0; i<3; i++) {
      data_minuts.push({
        text: val,
        value: val
      });
      val = val + 15;
    }
    data_AMPM.push({
      text:'PM',
      value:'PM'
    });
    data_AMPM.push({
      text:'AM',
      value:'AM'
    });
*/    
    if(Ext.os.deviceType == 'Desktop')
    {
      data_hours.push({
        text: '',
        value: ''
      });
      data_minuts.push({
        text: '',
        value: ''
      }); /*
      data_AMPM.push({
        text:'',
        value:''
      }); */
    }
   
    // Make the time picker...

    this.picker = Ext.create("Ext.Picker", {
      hidden: true,
      zIndex: 9999,
      slots: [{
        name: "hours",
        title: "Hours",
        data: data_hours
      },
      {
        name: "minuts",
        title: "Minuts",
        data: data_minuts
      }, /*
      {
        name: "AMPM",
        title: "test",
        data: data_AMPM
      } */
      ],
      listeners: {
        change: function (picker, values) {
          that.setValue(values.hours+':'+values.minuts); //+' '+values.AMPM);
        }
      }
    });

    Ext.Viewport.add(this.picker);

    // We want to release focus on the field so that the keyboard doesn't show up
    // while we're picking a time.

    this.on("focus", function (field, e) {
      that.picker.show();
      field.blur();
    });

    this.callParent(arguments);
  }
});
