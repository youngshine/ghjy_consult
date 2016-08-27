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
				label: '名称',
				//placeHolder: '格式：2016年秋季奥数班',
				clearIcon: false
			},{
				layout: 'hbox',
				xtype: 'container',
				items: [{
					xtype: 'textfield',
					name: 'kclistTitle', 
					label: '所属课程',
					labelWidth: 85,
					placeHolder: '选择课程',
					readOnly: true, //to focus
					flex: 1
				},{
					xtype: 'button',
					action: 'kclist',
					text: '...',
					//iconCls: 'search',
					ui: 'plain',
					width: 60,
					zIndex: 999
				},{	
					xtype: 'hiddenfield',
					name: 'kclistID', //绑定后台数据字段
				}]
			},{
				xtype: 'datepickerfield',
				name: 'beginDate', //绑定后台数据字段
				label: '开课日期',
				value: new Date()
			},{
				xtype: 'selectfield',
				label: '上课周期', //选择后本地缓存，方便下次直接获取
				name: 'weekday',
				placeHolder: '数组［］',
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
				label: '时间', //选择后本地缓存，方便下次直接获取
				name: 'timespan',
				options: [
				    {text: '上午', value: '上午'},
				    {text: '下午', value: '下午'},
				    {text: '晚上', value: '晚上'}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
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
		},{
			delegate: 'button[action=kclist]',
			event: 'tap',
			fn: 'onKclist'		
		}]
	},

	onSave: function(){
		//window.scrollTo(0,0);
		var me = this;
		
		var title = this.down('textfield[name=title]').getValue().trim(),
			hour = this.down('numberfield[name=hour]').getValue(),
			amount = this.down('numberfield[name=amount]').getValue(),
			beginDate = this.down('datepickerfield[name=beginDate]').getFormattedValue("Y-m-d"),
			weekday = this.down('selectfield[name=weekday]').getValue(),
			timespan = this.down('selectfield[name=timespan]').getValue(),
			classType = this.down('selectfield[name=classType]').getValue()
		console.log(beginDate,hour,amount)
		if (title == ''){
			Ext.toast('班级名称不能空白',3000); return;
		}
		if (hour == 0 || hour == null){
			Ext.toast('请填写所需课时',3000); return;
		}
		if (amount == 0 || amount == null){
			Ext.toast('请填写收费金额',3000); return;
		}
		if (weekday == null){
			Ext.toast('请选择上课周期',3000); return;
		}
		if (timespan == null){
			Ext.toast('请选择上课时间段',3000); return;
		}
		if (classType == null){
			Ext.toast('请选择科目',3000); return;
		}

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				var obj = {
					title: title,
					hour: hour,
					amount: amount,
					beginDate: beginDate,
					weekday: weekday,
					timespan: timespan,
					classType: classType,
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
	},
	
	// 查找选择对应课程
	onKclist: function(btn){
		var me = this; 
		me.fireEvent('kclist',btn,me);
	},
	
});
