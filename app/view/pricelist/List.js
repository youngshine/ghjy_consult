/**
 * Displays a list of 各个校区课时套餐价格
 */
Ext.define('Youngshine.view.pricelist.List', {
    extend: 'Ext.dataview.List',
	xtype: 'pricelist',

    config: {
        store: 'Pricelist',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
        itemTpl: [
            '<div>{title}</div>'
        ],
		
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
					this.up('list').onAddnew()
				}		
			}]
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
		this.fireEvent('addnew',this)
		//var vw = Ext.create('Youngshine.view.pricelist.Addnew');
		//Ext.Viewport.add(vw); 
		//vw.show(); //ext.setactive?
    },
	
});
