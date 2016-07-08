/**
 * Displays a list of 教师
 */
Ext.define('Youngshine.view.teacher.List', {
    extend: 'Ext.dataview.List',
	xtype: 'Teacher',

    config: {
        store: 'Teacher',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
        itemTpl: [
            '<div><span>{teacherName}</span><span style="float:right;color:#888;">{subjectName}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '教师',
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
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'zsd',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
    	}],
		
		record: null,
    },
	
	// 显示知识点
	onZsd: function(){
		var me = this;
		me.fireEvent('zsd',me)
	},
    onAddnew: function(list, index, item, record){
		var vw = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		vw.down('panel[itemId=my_show]').setData(record.data)
		vw.show(); 
		vw.setRecord(record); // 当前记录参数
    },
});
