/**
 * Displays a list of 报读某个知识点的学生列表
 */
Ext.define('Youngshine.view.student.List', {
    extend: 'Ext.dataview.List',
	xtype: 'student',

    //id: 'studentList',

    config: {
		//record: null,
		//layout: 'fit',
		ui: 'round',
		store: 'Student',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
        itemTpl: [
            '<div>{studentName}<span style="color:#888;">［{grade}{phone}］</span>'+
			'<span class="followup" style="float:right;color:green;">联络</span>'+
			'<span class="edit" style="float:right;color:green;">编辑｜</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '注册学生',
			items: [{
				text: '学生',
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
                xtype: 'searchfield',
                placeHolder: 'Search...',
				//width: 150,
				//label: '测评记录',
				action: 'search',
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
    onAddnew: function(list, index, item, record){
		this.fireEvent('addnew',this)
    },
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var store = Ext.getStore('Student');
		// var store = this.down('list').store; //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('fullStudent', field.getValue(), true); // 正则表达，才能模糊搜索?? true就可以anymatch
	},	
    onSearchClear: function(field){
		var store = Ext.getStore('Student');
		store.clearFilter();
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
        console.log(e.target)
		//if(e.target.className != "prodinfo") // 滑动商品名称等panel才退回
		//	return
		if(e.direction=='right'){
        	Youngshine.app.getApplication().getController('Main').menuNav()
        };     
    }, 
});
