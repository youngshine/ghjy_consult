// 缴费的内容明细，用于退费，并且移出对应课程班级
Ext.define('Youngshine.view.student.AccntDetail', {
    extend: 'Ext.dataview.List',
	xtype: 'student-accntdetail',

    config: {
        layout: 'fit',
		parentRecord: null,
		
		store: 'AccntDetail',
		disableSelection: true,
		striped: true,
        itemTpl: [
			'<div><span>{title}</span></div>'+
			'<div><span style="color:#888;">{hour}课时{amount}元</span>' +
			'<span class="" style="float:right;color:red;">状态</span></div>'
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '报读内容',
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
