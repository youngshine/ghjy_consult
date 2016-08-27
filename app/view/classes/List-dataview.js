/**
 * Displays a list of 各个校区班级课程 product as pricelist
 */
Ext.define('Youngshine.view.classes.List', {
    extend: 'Ext.Container',
	xtype: 'classes',

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
				text: '大小班级',
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
				action: 'addnew'	
			}]
		},{
			xtype: 'dataview',
			store: 'Classes',
			inline: true,
			scrollable: true,
			style: 'text-align:center;margin:10px 0px',
	        itemTpl: '<div style="background:#fff;margin:5px;padding:10px;width:150px;">'+
				'<div>{title}</div><hr>'+
				'<div style="color:#888;font-size:0.8em;">课时：{hour}</div>'+
				'<div style="color:#888;font-size:0.8em;">金额：{amount}元</div>'+
				'<br><div style="color:green;"><span class="edit">编辑</span>｜'+
				'<span class="del">删除</span></div></div>'
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

    onAddnew: function(btn){
		this.fireEvent('addnew',this)
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
