Ext.define('Youngshine.view.classes.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'classes-addnew',

    config: {
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '新增班级',
			items: [{
				text: '取消',
				ui: 'decline',
				action: 'cancel'
			},{
				xtype: 'spacer'
			},{
				ui: 'confirm',
				text: '保存',
				action: 'save'
			}]
		},{
			xtype: 'fieldset',
			defaults: {
				labelWidth: 85,
				xtype: 'textfield'
			},
			//title: '个人资料',
			items: [{
				xtype: 'textfield',
				name: 'title', //绑定后台数据字段
				label: '标题',
				clearIcon: false
			},{
				xtype: 'datepickerfield',
				name: 'beginDate', //绑定后台数据字段
				label: '开课日期',
				value: new Date()
			},{
				//xtype: 'spinnerfield',
				xtype: 'numberfield',
				name: 'hour', //绑定后台数据字段
				label: '所需课时'
			},{	
				xtype: 'numberfield',
				name: 'amount', //绑定后台数据字段
				label: '收费金额',
				clearIcon: false, /*
				component: { // 显示数字键
					xtype: 'input',
					type: 'tel'
				},	*/	
			}]	
		}],		
	
		listeners: [{
			delegate: 'button[action=save]',
			event: 'tap',
			fn: 'onSave'
		},{
			delegate: 'button[action=cancel]',
			event: 'tap',
			fn: 'onCancel'		
		}]
	},

	onSave: function(){
		//window.scrollTo(0,0);
		var me = this;
		
		var title = this.down('textfield[name=title]').getValue().trim(),
			beginDate = this.down('datepickerfield[name=beginDate]').getFormattedValue("Y-m-d"),
			hour = this.down('numberfield[name=hour]').getValue(),
			amount = this.down('numberfield[name=amount]').getValue()
		console.log(beginDate,hour,amount)
		if (title == ''){
			Ext.toast('班级标题不能空白',3000); return;
		}
		if (hour == 0 || hour == null){
			Ext.toast('请填写所需课时',3000); return;
		}
		if (amount == 0 || amount == null){
			Ext.toast('请填写收费金额',3000); return;
		}

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				var obj = {
					title: title,
					beginDate: beginDate,
					hour: hour,
					amount: amount,
					consultID: localStorage.consultID //班级归属哪个咨询师
				};
				console.log(obj)
				me.fireEvent('save', obj,me);
			}
		});	
	},
	onCancel: function(btn){
		this.fireEvent('cancel',this);
		//this.destroy()
	}
	
});
