//* Displays a list of course
Ext.define('Youngshine.view.teacher.Course', {
    extend: 'Ext.dataview.List',
	xtype: 'teacher-course',

    //id: 'courseList',

    config: {
        layout: 'fit',
		store: 'Course',
		disableSelection: true,
        //itemHeight: 89,
        emptyText: '－－－空白－－－',
		//disableSelection: true,
        itemTpl: [
			'<div style="color:#888;">{beginTime}｜{studentName}'+
			'<div>{zsdName}</div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '课时列表',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'teacher',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
    	}],
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'		
		}]
		
		//selectedRecord: null,
    },
	
	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
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
		var me = this;
		//if(e.target.className != "prodinfo") // 滑动商品名称等panel才退回
		//	return
		if(e.direction=='right'){
        	//Ext.Viewport.setActiveItem( Youngshine.app.getController('Teach').getTopicteach() );
			//this.destroy();
			me.onBack();
        };     
    }, 

});
