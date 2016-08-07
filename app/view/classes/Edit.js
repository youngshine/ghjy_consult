Ext.define('Youngshine.view.classes.Edit', {
    extend: 'Ext.form.Panel',
    xtype: 'classes-edit',

    config: {
		record: null,
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '修改班级课程',
			items: [{
				text: '取消',
				ui: 'decline',
				action: 'cancel'
			},{
				xtype: 'spacer'
			},{
				ui: 'confirm',
				text: '保存',
				//disabled: true,// 微信企业号才能新增，修改 by 执行校长
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
				placeHolder: '格式：2016年秋季奥数班',
				clearIcon: false
			},{
				//xtype: 'spinnerfield',
				xtype: 'numberfield',
				name: 'hour', //绑定后台数据字段
				label: '所需课时'
			},{	
				xtype: 'numberfield',
				name: 'amount', //绑定后台数据字段
				label: '收费金额',
				clearIcon: false, 	
			},{
				xtype: 'datepickerfield',
				name: 'beginDate', //绑定后台数据字段
				label: '开课日期',
			},{
				xtype: 'selectfield',
				label: '上课周期', //选择后本地缓存，方便下次直接获取
				name: 'weekday',
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
			},{
				xtype: 'selectfield',
				label: '所属科目', //选择后本地缓存，方便下次直接获取
				name: 'classType',
				options: [
					{text: '数理化', value: '数理化'},
				    {text: '史地生', value: '史地生'},
					{text: '语政英', value: '语政英'},
				    {text: '艺术', value: '艺术'}
				],
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'selectfield',
				label: '教师', //选择后本地缓存，方便下次直接获取
				name: 'teacherID',
				//store: 'Teacher', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'teacherID',
				displayField: 'teacherName',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},	
			},{
				xtype: 'hiddenfield',
				name: 'classID' //修改的unique			
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
		
		var classID = this.down('hiddenfield[name=classID]').getValue(), //unique
			title = this.down('textfield[name=title]').getValue().trim(),
			hour = this.down('numberfield[name=hour]').getValue(),
			amount = this.down('numberfield[name=amount]').getValue(),
			beginDate = this.down('datepickerfield[name=beginDate]').getFormattedValue("Y-m-d"),
			weekday = this.down('selectfield[name=weekday]').getValue(),
			timespan = this.down('selectfield[name=timespan]').getValue(),
		    classType = this.down('selectfield[name=classType]').getValue(),
			teacherID = this.down('selectfield[name=teacherID]').getValue()
		
		if(teacherID == null) teacherID=0
		if (title == ''){
			Ext.toast('班级名称不能空白',3000); return;
		}
		if (hour == 0 || hour == null){
			Ext.toast('请填写所需课时',3000); return;
		}
		if (amount == 0 || amount == null){
			Ext.toast('请填写收费金额',3000); return;
		}
		
		var obj = {
			title: title,
			hour: hour,
			amount: amount,
			beginDate: beginDate,
			weekday: weekday,
			timespan: timespan,
			classType: classType,
			teacherID: teacherID,
			classID: classID
		};
		console.log(obj)

    	Ext.Msg.confirm('',"确认修改保存？",function(btn){	
			if(btn == 'yes'){
				me.fireEvent('save', obj,me);
			}
		});	

		// 前端显示更新
		me.getRecord().set(obj)
		//me.getRecord().set('teacherName',teacher)
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	}
	
});
