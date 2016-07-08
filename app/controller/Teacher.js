// 教师相关的控制器，
Ext.define('Youngshine.controller.Teacher', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	teacher: 'teacher',
			teacheraddnew: 'teacher-addnew',
        },
        control: {
			teacher: {
				addnew: 'teacherAddnew', //itemtap
				itemtap: 'teacherItemtap',
				itemswipe: 'teacherItemswipe' //delete
			},
			teacheraddnew: {
				save: 'teacheraddnewSave', 
				cancel: 'teacheraddnewCancel'
			},
        }
    },

	// sidemenu跳转这里 teaching zsd list of a particular teacher
	teacherList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'teacher') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.teacher = Ext.create('Youngshine.view.teacher.List');
		Ext.Viewport.add(me.teacher);
		//view.onGenreChange(); //默认
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Teacher'); 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readTeacherList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    //Ext.Viewport.setMasked(false);
			    if (success){
					Ext.Viewport.setActiveItem(me.teacher);
				};
			} 
		})	  			 
	},
	//zsdSelect: function(list,record){
	teacherItemtap: function( list, index, target, record, e, eOpts )	{
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
	// 向左滑动，删除
	teacherItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false

		var me = this;
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					del(record)
				}
			},{
				text: '取消',
				scope: this,
				handler: function(){
					actionSheet.hide();
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteTeacher.php',
			    params: {
					teacherID: rec.data.teacherID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Teacher').remove(rec);
					}		         
			    }
			});
		}
	},	

	teacherAddnew: function(win){		
		var me = this;
		//var vw = Ext.create('Youngshine.view.teacher.Addnew');
		//Ext.Viewport.add(vw); //很重要，否则build后无法菜单，出错
		//vw.down('panel[itemId=my_show]').setData(record.data)
		//vw.show();
		
		if(!me.teacheraddnew){
			me.teacheraddnew = Ext.create('Youngshine.view.teacher.Addnew');
			Ext.Viewport.add(me.teacheraddnew)
		}
		Ext.Viewport.setActiveItem(me.teacheraddnew)
	},
	
	// 取消添加
	teacheraddnewCancel: function(oldView){		
		var me = this;
		//Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.teacher);
	},	
	teacheraddnewSave: function( obj,oldView )	{
    	var me = this; 
		// ajax or jsonp(data:obj)
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createTeacher.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
		        //record.set('fullEndtime','')
				oldView.destroy()
				Ext.Viewport.setActiveItem(me.teacher);
				obj.teacherID = result.data.teacherID
				obj.created = new Date();
				Ext.getStore('Teacher').insert(0,obj)
		    }
		});
	},

			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('teach controller init');
	}
});
