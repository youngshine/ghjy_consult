Ext.define('Youngshine.view.student.Addnew', {
    extend: 'Ext.form.Panel',
    xtype: 'student-addnew',

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
			title: '新增学生',
			items: [{
				text: '返回',
				ui: 'back',
				handler: function(btn){
					btn.up('panel').destroy();//onBack();
					//Ext.Viewport.remove(Ext.Viewport.getActiveItem(),true);
				}	
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
				name: 'studentName', //绑定后台数据字段
				label: '姓名',
				//value: localStorage.a,
				clearIcon: false
			},{	
				xtype: 'textfield',
				name: 'addr', //绑定后台数据字段
				label: '地址',
				clearIcon: false
			},{	
				xtype: 'textfield',
				name: 'phone', //绑定后台数据字段
				label: '电话',
				clearIcon: false,
				component: { // 显示数字键
					xtype: 'input',
					type: 'tel'
				}	
			},{	
				xtype: 'hiddenfield',	
				name: 'openID', //绑定后台数据字段
				value: localStorage.openID //sessionStorage.openID		
			}]	
		}],		
	
		listeners: [{
			delegate: 'button[action=save]',
			event: 'tap',
			fn: 'onSave'	
		}]
	},

	// it's bad to use listeners config obj in Ext.define(), use it in instanialiing create()
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
    },
	onBack: function(){
		var me = this;
		
		var vw = Youngshine.app.getController('Main').mainview //.getMainview(); //先显示前一画面，动画切换才顺滑
		console.log(vw)
		Ext.Viewport.setActiveItem(vw);	
		me.hide();
		setTimeout(function(){ //延迟，才能hide config动画，滚动到最后4-1
			me.destroy();
		},300);	
	},
	
	onSave: function(){
		var me = this;

		var member_name = this.down('textfield[name=member_name]').getValue().trim();
		var member_phone = this.down('textfield[name=member_phone]').getValue().trim(); 
		var member_addr = this.down('textfield[name=member_addr]').getValue().trim(); 
		//var member_gender = '';
	
		if (member_name == ''){
			Youngshine.app.getController('Main').alertMsg('请填写姓名',2000)
			return;
		}
		var obj = {
			member_name: member_name,
			member_phone: member_phone,
			member_addr: member_addr,
			member_gender: '无',
			openID: localStorage.openID 
			//member_id: member_id
		};
		me.fireEvent('membereditSave', obj,me);
	},
	
});
