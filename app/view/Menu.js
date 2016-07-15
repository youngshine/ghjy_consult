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
			text: '水平测试',
			iconCls: 'compose',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onAssess()
			}
		},{
			text: '购买课时套餐',
			iconCls: 'organize',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onOrders()
			}	
		},{
			text: '排课',
			iconCls: 'action',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onKcb()
			}	
		},{
			text: '课时套餐价格',
			iconCls: 'info',
			handler: function(btn){
				//Ext.Viewport.hideMenu('right');
				Ext.Viewport.removeMenu('left');
				this.up('menu').onPricelist()
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
	onAssess: function(){
		this.fireEvent('assess') //测评，报名前
	},
	onOrders: function(){
		this.fireEvent('orders') //购买课时套餐
	},
	onKcb: function(){
		this.fireEvent('kcb') //安排课程及教师
	},
	onPricelist: function(){
		this.fireEvent('pricelist') //课时套餐的校区价格设置
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
	