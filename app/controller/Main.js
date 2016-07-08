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
				student: 'menuStudent',
				teacher: 'menuTeacher'
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
	menuStudent: function(){
		this.getApplication().getController('Student').studentList()		 
	},
	menuTeacher: function(){
		this.getApplication().getController('Teacher').teacherList()		 
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
		
	}
    
});