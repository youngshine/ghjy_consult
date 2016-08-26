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
				classes: 'menuClasses', // 1 to N
				assess: 'menuAssess', // 1 to 1
				one2onePk: 'menuOne2onePk', //一对一排课
				classesPk: 'menuClassesPk', //大小班排课
				orders: 'menuOrders',
				accnt: 'menuAccnt',
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
				//console.log(result)
				if (result.success){ // 返回值有success成功
					localStorage.setItem('consultID',result.data.consultID);
					localStorage.setItem('consultName',result.data.consultName);
					localStorage.setItem('schoolID',result.data.schoolID); 
					localStorage.setItem('schoolName',result.data.schoolName); 
					// 咨询师 属于学校下面的分校区
					localStorage.setItem('schoolsubID',result.data.schoolsubID); 
					
					Ext.Viewport.remove(me.getLogin(),true); 	
					me.mainview = Ext.create('Youngshine.view.Main');
					Ext.Viewport.add(me.mainview)
					Ext.Viewport.setActiveItem(me.mainview);
					//me.mainview.down('toolbar').setTitle(localStorage.schoolName)		
				}else{
					Ext.toast(result.message,3000);
				}
			}
		});
	},
	
	menuNav: function(){
		var me = this;
		var menu = Ext.create('Youngshine.view.Menu')
		menu.down('button[action=school]').setText(localStorage.schoolName)
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
		//me.mainview.down('toolbar').setTitle(localStorage.schoolName)	
	},
	menuStudent: function(){
		this.getApplication().getController('Student').studentList()		 
	},
	menuTeacher: function(){
		this.getApplication().getController('Teacher').teacherList()		 
	},
	menuClasses: function(){
		//this.getApplication().getController('Classes').classesList()	
		this.getApplication().getController('Class').classList()	 
	},
	menuAssess: function(){
		this.getApplication().getController('Assess').assessList()		 
	},
	menuOrders: function(){
		this.getApplication().getController('Orders').ordersList()		 
	},
	menuOne2onePk: function(){
		this.getApplication().getController('One2one').accntdetailList()		 
	},
	menuClassesPk: function(){
		this.getApplication().getController('Classes').accntdetailList()	 
	},
	menuKcb: function(){
		this.getApplication().getController('Kcb').kcbList()		 
	},
	menuPricelist: function(){
		this.getApplication().getController('Pricelist').pricelistList()		 
	},
	menuAccnt: function(){
		this.getApplication().getController('Accnt').accntList()		 
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