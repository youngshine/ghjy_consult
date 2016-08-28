// 选择上课时间：星期＋具体开始上课时间
Ext.define('Youngshine.view.classes.Timely',{
	extend: 'Ext.Panel',
	xtype: 'classes-timely',

	config: {
		modal: true,
		hideOnMaskTap: true,
		//centered: true,
		left:0,bottom:0,
		width: '100%',
		//height: 280,

        items: [{	
        	xtype: 'toolbar',
        	docked: 'top',
        	title: '上课周期时间',
			items: [{
				text : '完成',
				ui: 'confirm',
				action: 'done',	
			}]
		},{
			xtype: 'fieldset',
			width: '98%',
			items: [{
				xtype: 'selectfield',
				name: 'weekday', 
				label: '星期',
				options: [
				    {text: '周一', value: '周一'},
				    {text: '周二', value: '周二'},
				    {text: '周三', value: '周三'},
				    {text: '周四', value: '周四'},
				    {text: '周五', value: '周五'},
				    {text: '周六', value: '周六'},
				    {text: '周日', value: '周日'}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'selectfield',
				name: 'begintime', 
				label: '开始时间',
				options: [
				    {text: '08:00', value: '08:00'},
				    {text: '08:30', value: '08:30'},
				    {text: '09:00', value: '09:00'},
				    {text: '09:30', value: '09:30'},
				    {text: '10:00', value: '10:00'},
				    {text: '10:30', value: '10:30'},
				    {text: '11:00', value: '11:00'},
				    {text: '13:00', value: '13:00'},
				    {text: '13:30', value: '13:30'},
				    {text: '14:00', value: '14:00'},
				    {text: '14:30', value: '14:30'},
				    {text: '15:00', value: '15:00'},
				    {text: '15:30', value: '15:30'},
				    {text: '16:00', value: '15:00'},
					{text: '16:30', value: '16:30'},
				    {text: '17:00', value: '17:00'},
				    {text: '18:30', value: '18:30'},
				    {text: '19:00', value: '19:00'},
				    {text: '19:30', value: '19:30'},
				    {text: '20:00', value: '20:00'},
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			}]	
		}],	
		
    	listeners: [{
			delegate: 'button[action=done]',
			event: 'tap',
			fn: 'onDone' 						
    	}]
	},

	onDone: function(btn){
		var me = this;
		var weekday = me.down('selectfield[name=weekday]').getValue(),
			begintime = me.down('selectfield[name=begintime]').getValue()
		if (weekday == null){
			Ext.toast('请选择星期',3000); return;
		}
		if (begintime == null){
			Ext.toast('请选择时间',3000); return;
		}
		
		var obj = {
			//weekday: weekday,
			//begintime: begintime,
			"timely": weekday+begintime
		}
		console.log(obj)
		me.fireEvent('done',obj,me);
		me.destroy()
	},
});