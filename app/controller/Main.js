// main处理基本逻辑和登录
Ext.define('Youngshine.controller.Main', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
			login: 'login',
			mainview : '#mainview'
        },
        control: {
			login: {
				ok: 'loginOk',
				//forgetpassword: 'loginForgetpassword' //忘记密码
			}
        },
    },

    loginOk: function(username,psw,school){  	
    	var me = this; console.log(username,school)
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在登录'});
		
    	Ext.data.JsonP.request({			
			url: me.getApplication().dataUrl + 'login.php',
			params:{
				username: username,
				psw     : psw,
				school  : school
			},
			success: function(result){ // 服务器连接成功
				Ext.Viewport.setMasked(false); 
				console.log(result)
				if (result.success){ // 返回值有success成功
					localStorage.setItem('consultID',result.data.consultName);
					localStorage.setItem('consultName',result.data.consultName);
					localStorage.setItem('school',result.data.schoolName); 
					Ext.Viewport.remove(me.getLogin(),true); 			
				}else{
					Ext.toast(result.message,3000);
				}
				Ext.Viewport.remove(me.login); //getLogin(),true); 
				me.mainview = Ext.create('Youngshine.view.Main');
				Ext.Viewport.add(me.mainview)
				Ext.Viewport.setActiveItem(me.mainview);
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