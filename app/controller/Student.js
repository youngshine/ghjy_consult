// 学生相关的控制器，
Ext.define('Youngshine.controller.Student', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	student: 'student',
			studentaddnew: 'student-addnew',
			studentshow: 'student-show'
        },
        control: {
			student: {
				addnew: 'studentAddnew', //itemtap
				itemtap: 'studentItemtap'
			},
			studentaddnew: {
				save: 'studentaddnewSave', 
				cancel: 'studentaddnewCancel'
			},
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	studentList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'student') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.student = Ext.create('Youngshine.view.student.List');
		Ext.Viewport.add(me.student);
		//me.student.onGenreChange(); //默认
		
		var obj = {
			"consultID": localStorage.consultID
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					Ext.Viewport.setActiveItem(me.student);
				};
			}   		
		});	  			 
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		me.studentshow = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(me.studentshow); //很重要，否则build后无法菜单，出错
		me.studentshow.down('panel[itemId=my_show]').setData(record.data)
		me.studentshow.show(); 
		me.studentshow.setRecord(record); // 当前记录参数
	},

	studentAddnew: function(win){		
		var me = this;
		
		if(!me.studentaddnew){
			me.studentaddnew = Ext.create('Youngshine.view.student.Addnew');
			Ext.Viewport.add(me.studentaddnew)
		}
		Ext.Viewport.setActiveItem(me.studentaddnew)
	},
	
	// 取消添加
	studentaddnewCancel: function(oldView){		
		var me = this; 
		oldView.destroy()
		//Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},	
	studentaddnewSave: function( obj )	{
    	var me = this; 

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				Ext.Ajax.request({
				    url: me.getApplication().dataUrl + 'createStudent.php',
				    params: obj,
				    success: function(response){
				        var text = response.responseText;
				        //record.set('fullEndtime','')
						
				    }
				});
			}
		});	
	},

			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('student controller init');
	}
});
