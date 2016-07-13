// 教师相关的控制器，
Ext.define('Youngshine.controller.Teacher', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	teacher: 'teacher',
			teacheraddnew: 'teacher-addnew',
			teacheredit: 'teacher-edit',
			teacherkcb: 'teacher-kcb',
			teachercourse: 'teacher-course',
			teachercourseassess: 'teacher-course-assess'
        },
        control: {
			teacher: {
				addnew: 'teacherAddnew', //itemtap
				itemtap: 'teacherItemtap', //包括修改、课程表按钮
				itemswipe: 'teacherItemswipe' //delete
			},
			teacheraddnew: {
				save: 'teacheraddnewSave', 
				cancel: 'teacheraddnewCancel'
			},
			teacheredit: {
				save: 'teachereditSave', 
				cancel: 'teachereditCancel'
			},
			teachercourse: {
				back: 'teachercourseBack',
				itemtap: 'teachercourseItemtap'
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
		store.removeAll()
		store.clearFilter() 
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
	// 显示教师上课课时
	teacherItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		// 点击‘修改编辑’
		if(e.target.className == 'edit'){
			me.teacheredit = Ext.create('Youngshine.view.teacher.Edit');
			Ext.Viewport.add(me.teacheredit); //否则build后无法显示
			Ext.Viewport.setActiveItem(me.teacheredit); //show()?
			console.log(record.data)
			me.teacheredit.setRecord(record)
			return
		}
		// 点击‘教师课程表’
		if(e.target.className == 'kcb'){
			me.teacherkcb = Ext.create('Youngshine.view.teacher.Kcb');
			Ext.Viewport.add(me.teacherkcb); //否则build后无法显示
			//me.teacherkcb.show()
			//Ext.Viewport.setActiveItem(me.teacherkcb); //show()?
			console.log(record.data.teacherID)
			
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'readKcbListByTeacher.php',
			    params: {
					teacherID: record.data.teacherID
			    },
			    success: function(response){
					var arr = JSON.parse(response.responseText)
					console.log(arr)
					var content = ''
					Ext.Array.each(arr, function(name, index) {
						content += name.teach_weekday + ' ' +
							name.teach_timespan + '<br>' 
					});		
					console.log(content) 
					var obj = {
						teacherName: record.data.teacherName,
						kcb: content
					}  
					me.teacherkcb.down('panel[itemId=my_show]').setData(obj)
					me.teacherkcb.show();      
			    }
			});
			
			//me.teacheredit.setRecord(record)
			return
		}

		if(!me.teachercourse){
			me.teachercourse = Ext.create('Youngshine.view.teacher.Course')
			Ext.Viewport.add(me.teachercourse)
		}		
		me.teachercourse.setRecord(record); //带入当前知识点
		me.teachercourse.down('label[itemId=teacher]').setHtml(record.data.teacherName)
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取课时记录'});
		// 预先加载的数据
		var obj = {
			"teacherID": record.data.teacherID,
		}
		var store = Ext.getStore('Course'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readCourseList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				Ext.Viewport.setMasked(false);
				if (success){
					Ext.Viewport.setActiveItem(me.teachercourse);
				}else{
					Ext.toast(result.message,3000);
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
				//obj.created = new Date();
				Ext.getStore('Teacher').insert(0,obj)
		    }
		});
	},
	// 取消添加
	teachereditCancel: function(oldView){		
		var me = this; 
		oldView.destroy()
		//Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.teacher);
	},	
	teachereditSave: function( obj,oldView )	{
    	var me = this; 
		console.log(obj)
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'updateTeacher.php',
		    params: obj,
		    success: function(result){
		        //var text = response.responseText; JSON.parse()
				console.log(result)
				oldView.destroy()
				//Ext.Viewport.setActiveItem(me.student);
				//rec.set(obj) //前端更新显示
				Ext.toast('修改成功',3000)
		    }
		});
	},
	
	// 返回
	teachercourseBack: function(oldView){		
		var me = this;
		//Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.teacher);
	},
	// 显示该堂课时的家长评价
	teachercourseItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		me.teachercourseassess = Ext.create('Youngshine.view.teacher.course.Assess');
		//Ext.Viewport.add(me.teachercourseassess); //否则build后无法显示
		
		// ajax instead of jsonp 课时评价
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'readCourseAssess.php',
		    params: {
				courseID: record.data.courseID
		    },
		    success: function(response){
				var ret = JSON.parse(response.responseText)
				console.log(response)
				Ext.Viewport.add(me.teachercourseassess); //否则build后无法显示
				me.teachercourseassess.down('panel[itemId=my_show]').setData(ret)
				me.teachercourseassess.show(); 	         
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
