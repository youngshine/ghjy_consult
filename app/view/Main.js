Ext.define('Youngshine.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
	id: 'mainview',
	
    requires: [
        'Ext.TitleBar',
		'Youngshine.view.Menu'
    ],
    config: {
		//scrollable: true,
        layout: 'fit',
        items: [{
			xtype: 'toolbar',
			docked: 'top',
			//style: 'background:#74B446', //flat
			//ui: 'green',
			title: '首页',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					btn.up('panel').onMenu()
				} 
			},{
				xtype: 'spacer'			
			},{
				iconCls: 'user',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					// menu -> onMember
					//Ext.Viewport.remove(Ext.Viewport.getActiveItem(),true); //remove 当前界面
			    	Ext.Viewport.setActiveItem(Ext.create('Youngshine.view.member.Edit'));
				} 
			}]	
		},{	
			xtype: 'dataview',
			scrollable: {
				direction: 'vertical'
			},
			store: 'Promotion',
			//loadingText: 'a',
			itemTpl: 
			//'<div style="text-align:center;margin:10px 0px 10px 0px;border:1px solid #ccc;background:#fff;">' +
			'<div style="margin:10px 10px;text-align:center;">' +
			
			'<div style="opacity:0.8;color:#fff;background:red;width:300px;height:30px;margin:0 auto;">{product_name}｜{product_price}元</div>' +
			'<img src={photo} width=300px height=200px style="margin-top:-30px;" />' +
			//'<div style="color:#9d9d9d;">{product_name}  <span style="color:#74B446;">{product_price}元</span></div>'+
			
			'</div>',
        }],
    },
	
	onMenu: function(){
		/*
		var me = this;
		var menu = Ext.create('Youngshine.view.Menu')
		Ext.Viewport.setMenu(menu, {
			side: 'left',
			cover: false //reveal: true
		});
		Ext.Viewport.toggleMenu('left');	*/
		Youngshine.app.getApplication().getController('Main').menuNav() 
	},
	
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
    },   
    onElSwipe : function(e) {
        if(e.direction=='right'){
        	this.onMenu();
        };     
    },

});
