// 大小班级相关
Ext.define('Youngshine.controller.Classes', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	classes: 'classes',
			class: 'class',
			classesaddnew: 'classes-addnew',
			classesedit: 'classes-edit',
			classesattendee: 'classes-attendee',
			student: 'classes-student', //查找选择学生
			//teacher: 'classes-teacher'
        },
        control: {
			classes: {
				addnew: 'classesAddnew',
				itemtap: 'classesItemtap', //包括'修改排课、删除‘’
				itemswipe: 'classesItemswipe' //delete
			},
			class: {
				itemtap: 'classItemtap', 
			},
			classesaddnew: {
				save: 'classesaddnewSave',
				cancel: 'classesaddnewCancel',
				student: 'classesaddnewStudent', //查找选择学生 
			}, 
			classesedit: {
				save: 'classeseditSave', 
				cancel: 'classeseditCancel'
			},
			/*
			teacher: {
				choose: 'teacherChoose'
			}, */
			student: {
				//search: '', //itemtap
				itemtap: 'studentItemtap'
			},
			'classes-attendee': {
				back: 'classesattendeeBack',
				addnew: 'classesattendeeAddnew',
				itemtap: 'classesattendeeItemtap', //更改金额
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
		me.classes = Ext.create('Youngshine.view.class.List');
		Ext.Viewport.add(me.classes);
		Ext.Viewport.setActiveItem(me.classes);
		
		//Ext.Viewport.setActiveItem(me.classes);
		//view.onGenreChange(); //默认
		var obj = {
			"schoolID": localStorage.schoolID,
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
					
				};
			} 
		})	  			 
	},

	classesItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; console.log(record.data)

		// 点击‘修改编辑’
		if(e.target.className == 'edit'){
			me.classesedit = Ext.create('Youngshine.view.classes.Edit');
			me.classesedit.setRecord(record)
			me.classesedit.down('datepickerfield[name=beginDate]')
				.setValue(new Date(record.data.beginDate))
			Ext.Viewport.add(me.classesedit); //否则build后无法显示
			Ext.Viewport.setActiveItem(me.classesedit); //show()?

			// 任课教师
			var obj = {
				"schoolID": localStorage.schoolID
			}		
			var store = Ext.getStore('Teacher'); 
			store.removeAll()
			store.clearFilter() 
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readTeacherList.php?data=' + JSON.stringify(obj));
			store.load({
				callback: function(records, operation, success){
				    if (success){
						// 任课教师selectfield，不用store,这样才能显示名字
						var selectBox = me.classesedit.down('selectfield[name=teacherID]')
						console.log(records)
						selectBox.updateOptions(records)
						selectBox.setValue(record.data.teacherID); 
						/*
						selectBox.updateOptions([
							{teacherName: record.data.teacherName,  teacherID: record.data.teacherID},
						    //{text: 'Third Option',  value: 'third'}
						]) */
					};
				} 
			})
			return
		}	
		// itemtap删除
		if(e.target.className == 'del'){
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
					}
				}]
			});
			Ext.Viewport.add(actionSheet);
			actionSheet.show();	
		
			function del(rec){
				console.log(rec)
				Ext.Ajax.request({
				    url: me.getApplication().dataUrl + 'deleteClasses.php',
				    params: {
						classID: rec.data.classID
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
			return false
		}	
		// 点击指定教师
		if(e.target.className == 'teacher'){
			me.teacher = Ext.create('Youngshine.view.classes.Teacher')
			me.teacher.setParentRecord(record) //参数classID
			Ext.Viewport.add(me.teacher)
			me.teacher.show()
			var obj = {
				"schoolID": localStorage.schoolID
			}		
			var store = Ext.getStore('Teacher'); 
			store.removeAll()
			store.clearFilter() 
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readTeacherList.php?data=' + JSON.stringify(obj));
			store.load({
				callback: function(records, operation, success){
				    if (success){
						//Ext.Viewport.setActiveItem(me.teacher);
					};
				} 
			})
			return
		}

		me.classesattendee = Ext.create('Youngshine.view.classes.Attendee');
		me.classesattendee.setParentRecord(record)
		me.classesattendee.down('label[itemId=title]').setHtml(record.data.title)
		
		// 获取当前测评记录
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取学生记录'});
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
	
	classItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this;

		me.classesattendee = Ext.create('Youngshine.view.class.Attendee');
		me.classesattendee.setParentRecord(record)
		me.classesattendee.down('label[itemId=title]').setHtml(record.data.title)
		
		// 获取当前测评记录
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取学生记录'});
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
		var me = this;
		console.log(e.target.parentNode)
		if(e.direction != 'left') return
		// left to delete
		//e.target.parentNode.find('.remove').show()
			
		list.setDisableSelection(false)	
		list.select(index,true); // 高亮当前记录
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [{
				text: '删除当前行',
				ui: 'decline',
				handler: function(){
					actionSheet.hide();
					list.deselect(index);	
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
			console.log(rec)
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteClasses.php',
			    params: {
					classID: rec.data.classID
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
	/* 选中，指定任课教师
	teacherChoose: function( obj,parentRecord,oldView)	{
    	var me = this; 
		console.log(obj)
    	Ext.Ajax.request({			
		    url: me.getApplication().dataUrl + 'updateClasses.php',
			params: obj,
			success: function(response){ // 服务器连接成功 
				var ret = Ext.JSON.decode(response.responseText);
				console.log(ret)
				//Ext.getStore('Classes').insert(0,ret); 
				// 前端更新，显示教师
				parentRecord.set('teacherName',obj.teacherName)
			},
		});
	}, */
	
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
	// 取消添加
	classeseditCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.classesedit,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.classes);
	},	
	classeseditSave: function( obj,oldView )	{
    	var me = this; 
		console.log(obj)
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'updateClasses.php',
		    params: obj,
		    success: function(result){
		        //var text = response.responseText; Ext.JSON.decode JSON.parse()
				console.log(result)
				//Ext.Viewport.setActiveItem(me.student);
				//rec.set(obj) //前端更新显示
				Ext.toast('修改成功',3000)
				Ext.Viewport.remove(me.classesedit,true); //remove 当前界面
		    }
		});
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
	classesattendeeItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		// 点击‘更改’金额
		if(e.target.className == 'amount'){
			Ext.Msg.show({
			  title   : '学生交费金额',
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
				//maxlength : 100, 
				//autocapitalize : false ,
				xtype: 'numberfield',
				value: record.data.amount.toString()
			  },
			  fn      : function(btn,text) {

				  if(btn=='ok' && text != 0) {
					  var obj = {
						  classstudentID: record.data.classstudentID,
						  amount: text
					  }
					  console.log(obj)
					  updateAmount(obj)
				  }
				  
			  }
			});
		}
		
		function updateAmount(obj){		
			Ext.Ajax.request({
	            url: me.getApplication().dataUrl + 'updateAttendee.php',
	            params: obj,
	            success: function(response){
					var ret = Ext.JSON.decode(response.responseText)
					console.log(ret)
					record.set('amount',obj.amount) // 刷新前端	
					Ext.toast(ret.message,3000)
				},
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
			hour: me.classesattendee.getParentRecord().data.hour, //默认课时
			amount: me.classesattendee.getParentRecord().data.amount,
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
				Ext.getStore('Student').remove(record) //选中的移除消失	
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
