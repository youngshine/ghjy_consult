// 班级的子表：报读的学生，可能上的课时各不相同
Ext.define('Youngshine.view.class.Attendee', {
    extend: 'Ext.dataview.List',
	xtype: 'class-attendee',

    config: {
        layout: 'fit',
		parentRecord: null,
		
		store: 'Attendee',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div><span>{studentName}</span>'+
			'<span class="amount" style="float:right;color:#888;">{gender}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '班级学生',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			},{
				xtype: 'spacer'
			},{
				text: '结束班级',
				ui: 'decline',
				disabled: true,
				action: 'finish'
			}]
		},{
			xtype: 'label',
			docked: 'top',
			html: '',
			itemId: 'title',
			style: 'text-align:center;color:#888;font-size:0.9em;margin:5px;'
    	}],
		
		listeners: [{
			delegate: 'button[action=back]',
			event: 'tap',
			fn: 'onBack'
		}]
    },

	onBack: function(btn){
		var me = this;
		me.fireEvent('back',me);
	},
});
