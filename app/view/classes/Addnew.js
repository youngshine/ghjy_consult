Ext.define('Youngshine.view.classes.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'classes-addnew',

    config: {
		layout: 'vbox',
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
				layout: 'hbox',
				xtype: 'container',
				items: [{
					xtype: 'textfield',
					name: 'timely_list', 
					label: '上课时间',
					labelWidth: 85,
					placeHolder: '选择时间',
					readOnly: true, //to focus
					flex: 1
				},{
					xtype: 'button',
					action: 'timely',
					text: '...',
					//iconCls: 'search',
					ui: 'plain',
					width: 60,
					zIndex: 999
				}]
			},{
				xtype: 'selectfield',
				label: '教师', //选择后本地缓存，方便下次直接获取
				name: 'teacherID',
				store: 'Teacher', //无法自动显示已选择的下拉项目，通过updateOpt
				valueField: 'teacherID',
				displayField: 'teacherName',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},		
			}]
		
    	},{
			xtype: 'button',
			text : '＋上课时间',
			ui : 'plain',
			action: 'timely', //大小班课程，不是班级
			style: {
				color: 'SteelBlue',
				background: 'none',//'#66cc00',
				margin: '-10px 100px 0px',
				border: 0
			},
			bageText: '0'
		},{
			// 缴费购买课程项目明细 1、一对一 2、大小班
			xtype: 'list',
			margin: '10px',
			//height: '100%',
			//ui: 'round',
			flex: 1,
			disableSelection: true,
	        itemTpl: [
				'<div><span>{timely}</span>'+
				'<span class="removeItem" style="float:right;color:red;">&nbsp;&nbsp;删除</span>'
	        ],	
			store: Ext.create("Ext.data.Store", {
				fields: [
		            {name: "timely", type: "string"},
		        ],
			}),		
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
		},{
			delegate: 'button[action=timely]',
			event: 'tap',
			fn: 'onTimely'	
		},{
			delegate: 'list',
			event: 'itemtap',
			fn: 'onItemtap'	
		}]
	},

	onSave: function(){
		//window.scrollTo(0,0);
		var me = this;
		
		var title = this.down('textfield[name=title]').getValue().trim(),
			kclistID = this.down('hiddenfield[name=kclistID]').getValue(),
			kclistTitle = this.down('textfield[name=kclistTitle]').getValue()

		console.log(kclistID,kclistTitle)
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
	
	// 查找选择对应大小班课程
	onKclist: function(btn){
		var me = this; 
		me.fireEvent('kclistClass',btn,me);
	},
	// 每周可能不止上课一次
	onTimely: function(btn){
		this.fireEvent('timely',btn,this);
	},
	
	// 移除报读的班级
	onItemtap: function(list, index, target, record, e, eOpts){
		var me = this;
		console.log(e.target.className)
		if(e.target.className == 'removeItem'){
			list.getStore().removeAt(index)
			var ys = me.down('textfield[name=amount_ys]'),
				ss = me.down('textfield[name=amount]')
			// 金额 减少
			var amt = parseInt(record.data.amount)
			ys.setValue(ys.getValue()-amt)
			ss.setValue(ss.getValue()-amt)
		}
	},
});
