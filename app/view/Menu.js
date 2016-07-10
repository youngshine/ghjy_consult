Ext.define('Youngshine.view.Menu', {
	extend: 'Ext.Menu',
	xtype: 'sidemenu',	
	//id: 'mypopmenu',
	
	config: {
		width: '34%',
		//scrollable: 'vertical',
		items: [{
			text: '根号教育',
			ui: 'plain',
			style: {
				color: '#fff',
				'font-size': '0.8em'
			}
		},{	
			text: '咨询首页',
			iconCls: 'home',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onHome()
			}
		},{
			text: '学生',
			iconCls: 'team',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onStudent()
			}
		},{
			text: '教师',
			iconCls: 'user',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onTeacher()
			}
			//iconCls: 'compose'
		},{
			text: '购买课时',
			iconCls: 'action',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onOrders()
			}		
		},{
			text: '课时套餐价格',
			iconCls: 'action',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onPricelist()
			}
		},{
			text: '排课程表',
			iconCls: 'compose',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onStudy()
			}
		},{
			text: '退出',
			//iconCls: 'delete',
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

	onHome: function(){
		this.fireEvent('home')
	},	
	onStudent: function(){
		this.fireEvent('student')
	},
	onTeacher: function(){
		this.fireEvent('teacher')
	},
	onOrders: function(){
		this.fireEvent('orders')
	},
	onPricelist: function(){
		this.fireEvent('pricelist')
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
	