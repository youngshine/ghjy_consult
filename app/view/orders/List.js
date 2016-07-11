/**
 * Displays a list of 购买课时套餐 prepaid
 */
Ext.define('Youngshine.view.orders.List', {
    extend: 'Ext.dataview.List',
	xtype: 'orders',
	
    config: {
		record: null, //父窗口传递的记录参数
		store: 'Orders',
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
			action: 'search'
    	}],	
		
    	listeners: [{
			delegate: 'searchfield[action=search]',
			//event: 'change', // need return to work
			event: 'keyup',
			fn: 'onSearchChange'
		},{
			delegate: 'searchfield[action=search]',
			event: 'clearicontap',
			fn: 'onSearchClear'	 						
    	}]
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
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var store = Ext.getStore('Orders');
		// var store = this.down('list').store; //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('studentName', field.getValue(), true); // 正则表达，才能模糊搜索?? true就可以anymatch
	},	
    onSearchClear: function(field){
		var store = Ext.getStore('Orders');
		store.clearFilter();
	},	
});
