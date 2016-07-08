/**
 * Displays a list of 报读某个知识点的学生列表
 */
Ext.define('Youngshine.view.student.List', {
    extend: 'Ext.dataview.List',
	xtype: 'student',

    id: 'studentList',

    config: {
        store: 'Student',
		record: null,
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
        itemTpl: [
            '<div>{studentName}<span style="float:right;color:#888;">{fullPass}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '注册学生',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					//btn.up('main').onMenu()
					//console.log(Youngshine.app.getApplication().getController('Main').getLogin())
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
					this.up('student').onAddnew()
				}		
			}]
		},{
    		xtype: 'searchfield',
			scrollDock: 'top',
			docked: 'top',
			placeHolder: 'search...',
    	}],
		
		
    },
	
	initialize: function(){
		this.callParent(arguments)
		this.on('itemtap',this.onItemtap)
	},
	
	// 显示详情
    onItemtap: function(list, index, item, record){
		var vw = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		vw.down('panel[itemId=my_show]').setData(record.data)
		vw.show(); 
		vw.setRecord(record); // 当前记录参数
    },
    onAddnew: function(list, index, item, record){
		var vw = Ext.create('Youngshine.view.student.Addnew');
		Ext.Viewport.add(vw); 
		vw.show(); //ext.setactive?
    },
});
