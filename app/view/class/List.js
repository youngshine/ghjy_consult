/**
 * Displays a list of 各个校区班级课程 product as pricelist
 */
Ext.define('Youngshine.view.class.List', {
    extend: 'Ext.Container',
	xtype: 'class',

    config: {
		layout: 'fit',
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		//title: '课时套餐价格',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				text: '大小班级课程',
				handler: function(btn){
					//btn.up('main').onMenu()
					Youngshine.app.getApplication().getController('Main').menuNav()
				} 	
			}]
		},{
			xtype: 'dataview',
			store: 'Classes',
			inline: true,
			scrollable: true,
			style: 'text-align:center;margin:10px 0px',
	        itemTpl: '<div style="background:#fff;margin:5px;padding:10px;width:160px;">'+
				'<div>{title}</div><hr>'+
				'<div style="color:#888;font-size:0.8em;">定员{persons}人</div>'+
				'<div style="color:#888;font-size:0.8em;">{hour}课时、{amount}元</div>'+
				'<div style="color:#888;font-size:0.8em;">{weekday}{timespan}</div>'+
				'<div style="color:#888;font-size:0.8em;">教师：{teacherName}</div></div>'
    	}],
		
		listeners: [{
			delegate: 'dataview',
			event: 'itemtap',
			fn: 'onItemtap'
		},{
			delegate: 'button[action=addnew]',
			event: 'tap',
			fn: 'onAddnew'	
		}]
    },

    onItemtap: function(dataview, index, target, record,e){
		this.fireEvent('itemtap',dataview, index, target, record,e)
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
			//this.destroy();
        };     
    }, 
});
