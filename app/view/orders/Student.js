// 查找选择学生
Ext.define('Youngshine.view.orders.Student',{
	extend: 'Ext.Sheet',
	xtype: 'orders-student',

	config: {
		//floating: true,
		//centered: true,
		// We give it a left and top property to make it floating by default
		//scrollable: 'vertical',
		enter: 'right',
		exit: 'right',
		right: 0,
		//top: 0,
		width: '50%',
		stretchY: true,

		hideOnMaskTap: true,
		modal: true, 
		
		styleHtmlContent: true,
		style: 'background:#fff;border-radius:10px 0 0 10px;',
		//cls: 'x-confirm',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
		items: [{
		    itemTpl: '{studentName}<span style="float:right;">{grade}</span>',
		    store: 'Student',
			striped: true
		}],
	},

    hide: function(animation) {
        this.callParent();
		this.destroy();
    },
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        //it's important to callParent to not break inheritance
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElementSwipe', //not use anonymous functions
			//tap	  : 'onTapToHide',
        });
    },   
    // swipe right to return to the previous
    onElementSwipe : function(e) {
        //fire event on component so swipe event is now on the component
        if(e.direction=='right'){
        	this.hide();
        };     
    },  	
    onTapToHide : function(e) {
        this.hide();    
    },
});