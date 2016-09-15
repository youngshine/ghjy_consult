// 一对一课时套餐的子表：
// 报读知识点记录以及安排一对一教师（教师一旦安排，不能随意改动
Ext.define('Youngshine.view.one2one.Study', {
    extend: 'Ext.dataview.List',
	xtype: 'one2one-study',

    config: {
        //layout: 'fit',
		record: null,
		
		store: 'Study',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div><span>{zsdName}</span></div>'+
			'<div><span style="color:#888;">{times}课时｜{timely_list}</span>'+
			'<span style="float:right;color:green;">排课</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '报读知识点',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'title',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
		},{
    		xtype: 'button',
			text: '＋添加记录',
			action: 'addnew',
			ui: 'plain',
			scrollDock: 'bottom',
			docked: 'bottom',
			style: 'color:green;margin-top:10px;'
    	}],
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
		},{
			delegate: 'button[action=addnew]',
			event: 'tap',
			fn: 'onAddnew'		
		}]
    },

    onAddnew: function(btn){
		var me = this;
		me.fireEvent('addnew',me.getRecord(), me);
    },	
	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
	},

});
