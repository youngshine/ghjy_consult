/**
 * Displays a list of 教师
 */
Ext.define('Youngshine.view.teacher.List', {
    extend: 'Ext.dataview.List',
	xtype: 'teacher',

    config: {
		record: null, //父窗口记录参数传递
		
		store: 'Teacher',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
        itemTpl: [
            '<div>{teacherName}</div>'+
			'<div style="font-size:0.8em;"><span style="color:#888;">{subjectName}</span>'+
			'<span class="edit" style="float:right;color:green;">编辑</span></div>'
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
		},{
			xtype: 'toolbar',
			docked: 'top',
			ui: 'gray',
			items: [{
				width: '100%',
				padding: '0 0',
				defaults: {flex: 1},
				xtype: 'segmentedbutton',
				allowDepress: false,
				//allowMultiple: false,
				//allowToggle: false,
				items: [{
					text: '数学',
					//pressed: true,
				},{
        			text: '物理',
				},{
        			text: '化学',
				}], ///* 会同时触发2次，api示例不会啊
				listeners:{
			        toggle: function(container, button, pressed){
			            console.log(pressed)
						if(pressed){
							button.up('list').onToggle(button)
						} //toggle会运行两次
							
			        }
				} //*/
			}]	
    	}],

    },
	
    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew', me);

		//var vw = Ext.create('Youngshine.view.teacher.Addnew');
		//Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		//vw.down('panel[itemId=my_show]').setData(record.data)
		//vw.show(); 
		//vw.setRecord(record); // 当前记录参数
    },
	
	// 会运行两次,why"""""????? api中demo不会啊"
	onToggle: function(selBtn){
		var me = this; 
		//console.log(seg.getPressedButtons()[0].getText())
		//console.log(this.down('segmentedbutton').getPressedButtons()[0].getText())
		//var segbtn = this.down('segmentedbutton');
		console.log(selBtn.getText())
		//me.fireEvent('segmentedbuttonToggle', segbtn,me);

		var subject = selBtn.getText(),
			store = me.getStore(); //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('subjectName', subject, true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	} 
});
