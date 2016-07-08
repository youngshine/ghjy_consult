Ext.define('Youngshine.view.Menu', {
	extend: 'Ext.Menu',
	xtype: 'sidemenu',	
	//id: 'mypopmenu',
	
	config: {
		width: '50%',
		//scrollable: 'vertical',
		items: [{
			text: '注册学生',
			//iconCls: 'home',
			style: {
				background: 'none',
				color: '#fff'
			},
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onStudent()
			}
		},{
			text: '教师',
			//iconCls: 'search',
			style: {
				background: 'none',
				color: '#fff'
			},
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onTeacher()
			}
			//iconCls: 'compose'
		
		},{
			text: '价格套餐',
			//iconCls: 'user',
			style: {
				background: 'none',
				color: '#fff'
			},
			//iconCls: 'star'
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onPricelist()
			}
		},{
			text: '排课',
			//iconCls: 'info',
			style: {
				background: 'none',
				color: '#fff'
			},
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onStudy()
			}
		},{
			text: '个人设置',
			//iconCls: 'info',
			style: {
				background: 'none',
				color: '#fff'
			},
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onMember()
			}
		},{
			text: '退出',
			//iconCls: 'delete',
			style: {
				background: 'none',
				color: '#fff'
			},
			handler: function(btn){
				Ext.Viewport.removeMenu('left');
				Youngshine.app.getController('Main').logout()
			}
		}],
	},

	initialize: function(){
		this.callParent(arguments)
		this.on('hide',this.onHidemenu)
	},
	onHidemenu: function(){
		this.destroy()
	},
	
	onStudent: function(){
		this.fireEvent('student')
	},
	onTeacher: function(){
		this.fireEvent('teacher')
	},
	onNews: function(){
		var active = Ext.Viewport.getActiveItem();
		if(active.xtype == 'news')
			return
		Ext.Viewport.remove(active,true); //remove 当前界面
    	Ext.Viewport.setActiveItem(Ext.create('Youngshine.view.News'));
	},
	onMember: function(){
		var active = Ext.Viewport.getActiveItem();
		if(active.xtype == 'member') return
			
		//Ext.Viewport.remove(active,true); //remove 当前界面
		var vw = Ext.create('Youngshine.view.member.Edit');
		vw.setShowAnimation(false); // 避免多次动画
    	Ext.Viewport.setActiveItem(vw);
	},

});	
	