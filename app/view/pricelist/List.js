/**
 * Displays a list of 各个校区课时套餐价格
 */
Ext.define('Youngshine.view.pricelist.List', {
    extend: 'Ext.Panel',
	xtype: 'pricelist',

    config: {
		layout: 'fit',
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '课时套餐价格',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					//btn.up('main').onMenu()
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 
			},{
				xtype: 'spacer'
			},{
				//ui : 'action',
				action: 'addnew',
				iconCls: 'add',
				//text : '＋新增',
				handler: function(){
					this.up('panel').onAddnew()
				}		
			}]
		},{
			xtype: 'dataview',
			inline: true,
	        store: 'Pricelist',
	        itemTpl: '<div style="background:#fff;margin:5px;padding:10px;width:150px;height:150px;">'+
				'{title}</div>',
    	}],
		
		listeners: [{
			delegate: 'dataview',
			event: 'itemtaphold',
			fn: 'onItemtaphold'
		}]
    },

    onAddnew: function(btn){
		this.fireEvent('addnew',this)
		//var vw = Ext.create('Youngshine.view.pricelist.Addnew');
		//Ext.Viewport.add(vw); 
		//vw.show(); //ext.setactive?
    },
    onItemtaphold: function(){
		this.fireEvent('itemtaphold',this)
    },
});
