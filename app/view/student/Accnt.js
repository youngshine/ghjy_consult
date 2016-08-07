/**
 * Displays a list of 学生的所有缴费
 */
Ext.define('Youngshine.view.student.Accnt', {
    extend: 'Ext.dataview.List',
	xtype: 'student-accnt',
	
    config: {
		parentRecord: null,
		
		store: 'Accnt',
        //itemHeight: 89,
		//disableSelection: true,
		striped: true,
        itemTpl: [
			'<div>{accntType}<span style="float:right;">{amount}</span></div>' +
			'<div style="color:#888;font-size:0.9em;">{accntDate}'+
			'<span style="float:right;">{title}</span>'+
			'</div>'			
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '缴费记录',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
				handler: function(){
					this.up('list').onBack()
				}	
			}]
    	}],	
    },

    onBack: function(btn){
		var me = this;
		me.fireEvent('back', me);
    },
});
