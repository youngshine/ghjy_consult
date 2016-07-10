/**
 * Displays a list of 购买课时套餐 prepaid
 */
Ext.define('Youngshine.view.orders.List', {
    extend: 'Ext.dataview.List',
	xtype: 'orders',
	
    config: {
        store: 'Orders',
		record: null,
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div><span style="color:#888;">{studentName}{created}</span></div>'+
			'<div>{taocan}</dive>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '课时套餐订单',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 
			},{
				xtype: 'spacer'
			},{
				ui : 'action',
				action: 'addnew',
				iconCls: 'add',
				handler: function(){
					this.up('list').onAddnew()
				}		
			}]
		},{
    		xtype: 'searchfield',
			scrollDock: 'top',
			docked: 'top',
			placeHolder: 'search...',
    	}],	
    },
	
	/*
	initialize: function(){
		this.callParent(arguments)
		//this.on('itemtap',this.onItemtap)
	},
	
	// 显示详情
    onItemtap: function(list, index, item, record){
		var vw = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		vw.down('panel[itemId=my_show]').setData(record.data)
		vw.show(); 
		vw.setRecord(record); // 当前记录参数
    }, */
    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew', me);
    },
});
