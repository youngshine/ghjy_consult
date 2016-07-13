// 待排课
Ext.define('Youngshine.view.kcb.List', {
    extend: 'Ext.dataview.List',
	xtype: 'kcb',

    config: {
        layout: 'fit',
		record: null,
		
		store: 'Study',
		disableSelection: true,
		striped: true,
        //itemHeight: 89,
        //emptyText: '－－－空白－－－',
        itemTpl: [
			'<div>{zsdName}</div>'+
			'<div style="color:#fff;font-size:0.8em;">{gradename}｜{studentName}/div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '待排课的',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 	
			}]
    	}],
    },

});
