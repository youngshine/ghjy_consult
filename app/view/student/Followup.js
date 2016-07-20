/**
 * Displays a list of 与学生联络记录
 */
Ext.define('Youngshine.view.student.Followup', {
    extend: 'Ext.dataview.List',
	xtype: 'student-followup',
	
    config: {
		parentRecord: null,
		
		store: 'Followup',
        //itemHeight: 89,
		//disableSelection: true,
		striped: true,
        itemTpl: [
			'<div>{content}</div>' +
			'<div style="color:#888;font-size:0.8em;">'+
			'<span style="float:right;">{created}</span>'+
			'</div>'			
        ],
		
    	items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '沟通联络记录',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
				handler: function(){
					this.up('list').onBack()
				}	
			}]
		},{
    		xtype: 'label',
			scrollDock: 'top',
			docked: 'top',
			html: '<span class="addnew">＋添加</span>',
			//itemId: 'zsd',
			style: 'text-align:center;color:green;margin:10px;'
    	}],	
		
		listeners: [{
			element: 'element',
			delegate: 'span.addnew',
			event: 'tap',
			fn: 'onAddnew'
		}],
    },
	
    onAddnew: function(btn){
		var me = this; console.log(me.getParentRecord())
		
		Ext.Msg.show({
		  //title   : '',
		  msg     : null,
		  buttons : [{
		    itemId : 'cancel',
		    text   : '取消'
		  },{
		    itemId : 'ok',
		    text   : '提交',
		    ui     : 'confirm'
		  }],
		  prompt  : { 
			maxlength : 180, 
			autocapitalize : false ,
			xtype: 'textareafield',
			//value: 'test'
		  },
		  fn      : function(btn,text) {
		    // do some stuff
			  if(btn=='ok' && text.trim() != '') {
				  var obj = {
					  studentID: me.getParentRecord().data.studentID,
					  content: text
				  }
				  me.fireEvent('save',obj, me);
			  }
				  
		  }
		});
    },
    onBack: function(btn){
		var me = this;
		me.fireEvent('back', me);
    },
});
