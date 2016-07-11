// 排课
Ext.define('Youngshine.view.orders.study.Kcb',{
	extend: 'Ext.form.Panel',
	xtype: 'study-kcb',

	config: {
		record: null,
		modal: true,
		hideOnMaskTap: true,
		centered: true,
		width: 420,height: 260,
		//scrollable: true,

        items: [{	
        	xtype: 'toolbar',
        	docked: 'top',
        	title: '一对一排课',
			items: [{
				text : '完成',
				ui: 'confirm',
				disabled: true,
				action: 'done',
			}]
		},{
			xtype: 'fieldset',
			width: '95%',
			items: [{
				xtype: 'selectfield',
				label: '上课日', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				name: 'teach_weekday',
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
				listeners: {
					change: function(){
						//this.up('panel').down('selectfield[itemId=zsd]').reset();
						//this.up('panel').down('button[action=save]').setDisabled(true);
						//loadZsd(this.getValue())
					},					
				},
			},{
				xtype: 'selectfield',
				label: '时间段', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				name: 'teach_timespan',
				options: [
				    {text: '08-10', value: '08-10'},
				    {text: '10-12', value: '10-12'},
				    {text: '14-16', value: '14-16'},
				    {text: '16-18', value: '16-18'},
				    {text: '19-21', value: '19-21'},
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
				listeners: {
					change: function(field,newValue){
						console.log(newValue)
						if(newValue != null ){
							//this.up('panel').down('button[action=save]').setDisabled(false);
						}
							
						
					},					
				},
			},{
				xtype: 'selectfield',
				label: '任课教师', //选择后本地缓存，方便下次直接获取
				labelWidth: 85,
				name: 'teacher',
			},{
				xtype: 'textfield',
				label: '备注',
				labelWidth: 85,
				name: 'note'
			}]	

		}],	
	},


});