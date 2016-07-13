// main处理基本逻辑和登录
Ext.define('Youngshine.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
			login: 'login',
			mainview : '#mainview',
			sidemenu: 'sidemenu'
        },
        control: {
			login: {
				ok: 'loginOk',
				//forgetpassword: 'loginForgetpassword' //忘记密码
			},
			sidemenu: {
				home: 'menuHome',
				student: 'menuStudent',
				teacher: 'menuTeacher',
				orders: 'menuOrders',
				kcb: 'menuKcb',//安排课程内容（知识点）及教师
				pricelist: 'menuPricelist'
			}
        },
    },

    loginOk: function(username,psw,school){  	
    	var me = this; 
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在登录'});
		
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'login.php',
			params:{
				data: '{"username":"' + username + '","psw":"' + psw + '","school":"' + school + '"}'
			},
			success: function(result){ // 服务器连接成功
				Ext.Viewport.setMasked(false); 
				console.log(result)
				if (result.success){ // 返回值有success成功
					localStorage.setItem('consultID',result.data.consultID);
					localStorage.setItem('consultName',result.data.consultName);
					localStorage.setItem('schoolID',result.data.schoolID); 
					localStorage.setItem('schoolName',result.data.schoolName); 
					
					Ext.Viewport.remove(me.getLogin(),true); 	
					me.mainview = Ext.create('Youngshine.view.Main');
					Ext.Viewport.add(me.mainview)
					Ext.Viewport.setActiveItem(me.mainview);
					me.mainview.down('toolbar').setTitle(localStorage.schoolName)		
				}else{
					Ext.toast(result.message,3000);
				}
			}
		});
	},
	
	menuNav: function(){
		var me = this;
		var menu = Ext.create('Youngshine.view.Menu')
		Ext.Viewport.setMenu(menu, {
			side: 'left',
			cover: false //reveal: true
		});
		Ext.Viewport.toggleMenu('left');	 
	},
	
	menuHome: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'mainview') return
			
		me.mainview = Ext.create('Youngshine.view.Main');
		Ext.Viewport.add(me.mainview)
		Ext.Viewport.setActiveItem(me.mainview);
		me.mainview.down('toolbar').setTitle(localStorage.schoolName)	
	},
	menuStudent: function(){
		this.getApplication().getController('Student').studentList()		 
	},
	menuTeacher: function(){
		this.getApplication().getController('Teacher').teacherList()		 
	},
	menuOrders: function(){
		this.getApplication().getController('Orders').ordersList()		 
	},
	menuKcb: function(){
		this.getApplication().getController('Kcb').kcbList()		 
	},
	menuPricelist: function(){
		this.getApplication().getController('Pricelist').pricelistList()		 
	},
	
	// 用户注销退出，来自Main控制器，reset
	logout: function(){
    	//Ext.Msg.confirm('',"确认退出？",function(btn){	
		//	if(btn == 'yes'){
				Ext.Viewport.setMasked({xtype:'loadmask',message:'正在注销'});
				window.location.reload();
		//	}
		//});
	},
	
	// controller launch Called by the Controller's application immediately after the Application's own launch function has been called. This is usually a good place to run any logic that has to run after the app UI is initialized. 
	launch: function(){
		console.log('main controller launch logic');
		
	}, /*
	init: function(){
		var me = this; 
		console.log('main controller init ');
		console.log(localStorage.schoolName)
		me.login = Ext.create('Youngshine.view.Login')
		me.login.down('textfield[itemId=school]').setValue(localStorage.schoolName)
		Ext.Viewport.add(me.login)
	} */
    
});