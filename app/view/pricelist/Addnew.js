Ext.define('Youngshine.view.pricelist.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'pricelist-addnew',

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
			title: '新增一对一课程',
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
				labelWidth: 65,
				xtype: 'textfield'
			},
			//title: '个人资料',
			items: [{
				xtype: 'textfield',
				name: 'title', //绑定后台数据字段
				label: '标题',
				clearIcon: false
			},{
				//xtype: 'spinnerfield',
				xtype: 'numberfield',
				name: 'hour', //绑定后台数据字段
				label: '小时',
			    //minValue: 10,
			    //maxValue: 100,
			    //increment: 10,
			    //cycle: false
			},{	
				xtype: 'numberfield',
				name: 'amount', //绑定后台数据字段
				label: '金额',
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
		//window.scrollTo(0,0);
		var me = this;
		
		var title = this.down('textfield[name=title]').getValue().trim(),
			hour = this.down('numberfield[name=hour]').getValue(),
			amount = this.down('numberfield[name=amount]').getValue()
	
		if (title == ''){
			Ext.toast('套餐标题名称不能空白',3000); return;
		}
		if (hour == 0 || hour == null){
			Ext.toast('请填写套餐课时',3000); return;
		}
		if (amount == 0 || amount == null){
			Ext.toast('请填写套餐金额',3000); return;
		}

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				var obj = {
					title: title,
					hour: hour,
					amount: amount,
					schoolID: localStorage.schoolID //归属哪个咨询师
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
