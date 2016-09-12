// 全校所有班级，按分校区分组
Ext.define('Youngshine.view.classes.ClassAll', {
    extend: 'Ext.dataview.List',
	xtype: 'class-all',

    config: {
        layout: 'fit',

		store: '', //动态
		grouped: 'fullname',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div>{title}</div>'+
			'<div style="color:#888;">{timely_list}'+
			'<span style="float:right;">满班率：{enroll} / {persons}</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '全校班级',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
			}]
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
