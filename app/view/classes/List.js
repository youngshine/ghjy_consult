/**
 * Displays a list of 各种班级（2015春季书法，2016秋季奥数
 */
Ext.define('Youngshine.view.classes.List', {
    extend: 'Ext.dataview.List',
	xtype: 'classes',
	
    config: {
		ui: 'round',
		store: 'Classes',
        //itemHeight: 89,
        //emptyText: '学生列表',
		disableSelection: true,
		striped: true,
		//pinHeaders: false,
        itemTpl: [
			'<div>{title}</div>'+
			'<div style="color:#888;">'+
			'<span>{beginDate}开课｜{hour}课时{amount}元</span>'+
			'<span style="float:right;">教师：{teacherName}</span>'+
			'</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '测评记录',
			ui: 'dark',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'gray',
				text: '大小班',
				handler: function(btn){
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
                listeners: {
                    scope: this,
                    //clearicontap: this.onSearchClearIconTap,
                    //keyup: this.onSearchKeyUp
                }
			},{
				xtype: 'spacer'	
			},{
				ui : 'plain',
				action: 'addnew',
				iconCls: 'add',
				//text: '新增',
				handler: function(){
					this.up('list').onAddnew()
				}		
			}]
/*		},{
    		xtype: 'searchfield',
			scrollDock: 'top',
			docked: 'top',
			placeHolder: 'search...',
			action: 'search' */
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
	
    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew', me);
    },
	
	// 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		//var store = Ext.getStore('Orders');
		var store = this.getStore(); 
		store.clearFilter();
        store.filter('title', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},	
    onSearchClear: function(field){
		var store = this.getStore(); //Ext.getStore('Orders');
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
