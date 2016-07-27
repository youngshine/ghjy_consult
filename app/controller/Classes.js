// 大小班级相关
Ext.define('Youngshine.controller.Classes', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	classes: 'classes',
			classesaddnew: 'classes-addnew',
			classesattendee: 'classes-attendee',
			student: 'classes-student', //查找选择学生
        },
        control: {
			classes: {
				addnew: 'classesAddnew',
				itemtap: 'classesItemtap', //包括'排课‘’
				itemswipe: 'classesItemswipe' //delete
			},
			classesaddnew: {
				save: 'classesaddnewSave',
				cancel: 'classesaddnewCancel',
				student: 'classesaddnewStudent', //查找选择学生 
			},
			student: {
				//search: '', //itemtap
				itemtap: 'studentItemtap'
			},
			'classes-attendee': {
				back: 'classesattendeeBack',
				addnew: 'classesattendeeAddnew',
				itemswipe: 'classesattendeeItemswipe' //delete
			},
        }
    },

	// sidemenu跳转这里：班级
	classesList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'classes') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.classes = Ext.create('Youngshine.view.classes.List');
		
		//Ext.Viewport.setActiveItem(me.classes);
		//view.onGenreChange(); //默认
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			"teacherID": 0 //班级尚未确定教师
		}		
		var store = Ext.getStore('Classes');
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readClassesList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    console.log(records)
				if (success){
					Ext.Viewport.add(me.classes);
					Ext.Viewport.setActiveItem(me.classes);
				};
			} 
		})	  			 
	},

	classesItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 

		me.classesattendee = Ext.create('Youngshine.view.classes.Attendee');
		me.classesattendee.setParentRecord(record)
		me.classesattendee.down('label[itemId=title]').setHtml(record.data.title)
		
		// 获取当前测评记录
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取课时记录'});
		var obj = {
			"classID": record.data.classID,
			//"subjectID": record.data.subjectID, //题目按学科分3个表
		};
		console.log(obj)
		var store = Ext.getStore('Attendee'); 
		store.removeAll();
		store.clearFilter()
        var url = this.getApplication().dataUrl + 
			'readAttendeeList.php?data=' + JSON.stringify(obj);
		store.getProxy().setUrl(url);
        store.load({
			callback: function(records, operation, success){
				console.log(records)
				Ext.Viewport.setMasked(false);
				if (success){
					Ext.Viewport.add(me.classesattendee) // build?
					Ext.Viewport.setActiveItem(me.classesattendee);
				}else{
					Ext.toast(result.message,3000);
				};
			} 
        }); 
	},	
	// 向左滑动，删除
	classesItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(list)
		var me = this;
		if(e.direction != 'left') return
		// left to delete
			
		list.setDisableSelection(false)	
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					list.setDisableSelection(true)	
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
					list.setDisableSelection(true)	
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteClasses.php',
			    params: {
					classesID: rec.data.classesID
			    },
			    success: function(response){
					console.log(response)
					var ret = Ext.JSON.decode(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Classes').remove(rec);
					}		         
			    }
			});
		}
	},	
	
	classesAddnew: function(win){		
		var me = this;
		//if(!me.classesaddnew){
			me.classesaddnew = Ext.create('Youngshine.view.classes.Addnew');
			Ext.Viewport.add(me.classesaddnew)
		//}
		Ext.Viewport.setActiveItem(me.classesaddnew)
	},
	// 取消添加
	classesaddnewCancel: function(oldView){		
		var me = this;
		Ext.Viewport.remove(me.classesaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.classes);
	},	
	classesaddnewSave: function( obj,oldView )	{
    	var me = this; 
		// ajax or jsonp(data:obj)
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createClasses.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
		        //record.set('fullEndtime','')
				//oldView.destroy()
				Ext.Viewport.remove(me.classesaddnew,true); //remove 当前界面
				Ext.Viewport.setActiveItem(me.classes);
				obj.classesID = result.data.classesID
				obj.created = '刚刚';
				Ext.getStore('Classes').insert(0,obj)
				Ext.toast(result.message,3000)
		    }
		});
	},
	// 查找选择的学生
	classesaddnewStudent: function(btn)	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.classes.Student');
		Ext.Viewport.add(me.student); //否则build后无法显示

		var obj = {
			"consultID": localStorage.consultID,
			"schoolID" : localStorage.schoolID
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					//Ext.Viewport.setActiveItem(me.student);
					me.student.showBy(btn); // overlay show
				};
			}   		
		});	
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.classesaddnew.down('textfield[name=studentName]')
			.setValue(record.data.studentName+'［'+record.data.grade+'］')
		me.classesaddnew.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
	},
	
	// 返回
	classesattendeeBack: function(oldView){		
		var me = this;
		//oldView.destroy()	
		console.log(me.classes)	
		Ext.Viewport.remove(me.classesattendee,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.classes);
	},
	
	// 向左滑动，删除
	classesattendeeItemswipe: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		if(e.direction !== 'left') return false

		var me = this;
		list.setDisableSelection(false)
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					list.setDisableSelection(false)
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
					list.setDisableSelection(false)
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteAttendee.php',
			    params: {
					classstudentID: rec.data.classstudentID
			    },
			    success: function(response){
					var ret = Ext.JSON.decode(response.responseText)
					console.log(ret)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Attendee').remove(rec);
					}		         
			    }
			});
		}
	},	
	classesattendeeAddnew: function(rec,oldView){		
    	var me = this; 
		me.student = Ext.create('Youngshine.view.classes.Student');
		me.student.setParentRecord(rec) //参数：当前班级classID
		Ext.Viewport.add(me.student); //否则build后无法显示
		//me.topiczsd.show(); // overlay show
		
		var obj = {
			"schoolID": localStorage.schoolID
		}
		// 报读学生范围：全校，而不是当前咨询师的学生
		var store = Ext.getStore('Student'); 
		store.removeAll();
		store.clearFilter()
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readStudentListByAll.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				console.log(records)
				me.student.show(); //overlay.show
				console.log(me.student.getParentRecord())
			}   		
		});	
	},
	
	// itemtap添加班级的学生，如何修改报读课时费用？？
	studentItemtap: function( list, index, target, record, e, eOpts)	{
    	var me = this; 
		
		var obj = {
			studentID: record.data.studentID,
			studentName: record.data.studentName,
			classID: me.classesattendee.getParentRecord().data.classID
		}
		console.log(obj);
		Ext.Ajax.request({ //不采用批量添加子表（传递数组），单个添加2014-3-20
            url: me.getApplication().dataUrl +  'createAttendee.php',
            params: obj,
            success: function(response){
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText); // JSON.parse
				console.log(ret)
				//更新前端store，最新插入记录ID，才能删除修改
				obj.classstudentID = ret.id; // model数组添加项目
				Ext.getStore('Attendee').insert(0,obj); //新增记录，排在最前面
				//Ext.toast('班级添加学生成功',3000)	
				Ext.getStore('Student').remove(record) //选中的溢出	
            }
		});
	},

	
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('classes controller init');
	}
});
