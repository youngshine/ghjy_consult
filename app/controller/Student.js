// 学生相关的控制器，
Ext.define('Youngshine.controller.Student', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	student: 'student',
			studentaddnew: 'student-addnew',
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
		//list.down('button[action=done]').enable();
		//list.setSelectedRecord(record);
		//console.log(list.getSelectedRecord());
		//me.showStudent(record);	
		console.log(record.data)
		//list.destroy()
		
		if(!me.student){
			me.student = Ext.create('Youngshine.view.teach.Student')
			Ext.Viewport.add(me.student)
		}
		
		me.student.setRecord(record); //带入当前知识点
		me.student.down('label[itemId=zsd]').setHtml(record.data.zsdName)
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取学生列表'});
		// 预先加载的数据
		var obj = {
			"teacherID": record.data.teacherID,
			"zsdID": record.data.zsdID, // zsdID不唯一，因三个表
			"subjectID": record.data.subjectID
		}
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readStudentList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				if (success){
					Ext.Viewport.setMasked(false);
					Ext.Viewport.setActiveItem(me.student);
				}else{
					//me.alertMsg('服务请求失败',3000)
					Ext.Msg.alert(result.message);
				};
			}   		
		});	
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
