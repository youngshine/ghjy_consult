Ext.define('Youngshine.view.orders.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'orders-addnew',

    config: {
        /*
		showAnimation: {
            type: "slideIn",
            direction: "left",
            duration: 200
        },
        hideAnimation: {
            type: "slideOut",
            direction: "right",
            duration: 200
        }, */
		
		items: [{
			xtype: 'toolbar',
			docked: 'top',
			title: '新增购买',
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
			items: [{
				xtype: 'textfield',
				name: 'studentName', 
				label: '姓名',
				placeHolder: '选择学生',
				//readOnly: true, //to focus
				clearIcon: false
			},{	
				xtype: 'hiddenfield',
				name: 'studentID', //绑定后台数据字段
			},{
				xtype: 'selectfield',
				name: 'taocan', 
				autoSelect: false,
				label: '课时套餐',
				store: 'Pricelist',
				valueField: 'title',
				displayField: 'title',
				listeners: {
					change: function(){
						//hideenfield
					}
				}	
			},{
				xtype: 'selectfield',
				name: 'payment', 
				label: '付款方式',
				autoSelect: false,
				options: [
				    {text: '现金', value: '现金'},
				    {text: '刷卡', value: '刷卡'},
				    {text: '微信', value: '微信'},
				    {text: '扫码', value: '扫码'}
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
			//element: 'element',
			delegate: 'textfield[name=studentName]',
			event: 'keydown',
			fn: 'onStudent'			
		}]
	},

	/* it's bad to use listeners config obj in Ext.define(), use it in instanialiing create()
	initialize: function(){	
        this.callParent(arguments);	
		this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
	},  
    onElSwipe : function(e) {
        if(e.direction=='right'){
        	this.onBack(); //destroy();
        };     
    }, */

	onSave: function(){
		var me = this;

		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue(),
			taocan = this.down('selectfield[name=taocan]').getValue(),
			payment = this.down('selectfield[name=payment]').getValue()
	
		if (studentName == ''){
			Ext.toast('姓名不能空白',3000); return;
		}
		if (taocan == null){
			Ext.toast('请选择课时套餐',3000); return;
		}
		if (payment == null){
			Ext.toast('请选择付款方式',3000); return;
		}
		var obj = {
			studentName: studentName,
			studentID: studentID,
			taocan: taocan,
			payment: payment,
			consultID: localStorage.consultID //归属哪个咨询师
		};
		console.log(obj)
		me.fireEvent('save', obj,me);
	},
	onCancel: function(btn){
		var me = this; 
		me.fireEvent('cancel',me);
	},
	
	// 查找选择学生
	onStudent: function(){
		var me = this; 
		me.fireEvent('student',me);
	}
	
});
