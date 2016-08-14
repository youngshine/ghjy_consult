// 学生相关的控制器，
Ext.define('Youngshine.controller.Student', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	student: 'student',
			studentaddnew: 'student-addnew',
			studentedit: 'student-edit',
			studentstudy: 'student-study',
			studentshow: 'student-show',
			studentaccnt: 'student-accnt',
			studentfollowup: 'student-followup'
        },
        control: {
			student: {
				addnew: 'studentAddnew', //itemtap
				itemtap: 'studentItemtap', //包含：修改
				itemswipe: 'studentItemswipe'
			},
			studentaddnew: {
				save: 'studentaddnewSave', 
				cancel: 'studentaddnewCancel'
			},
			studentedit: {
				save: 'studenteditSave', 
				cancel: 'studenteditCancel'
			},
			studentaccnt: {
				back: 'studentaccntBack'
			},
			studentfollowup: {
				back: 'studentfollowupBack',
				save: 'studentfollowupSave', 
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
		Ext.Viewport.setActiveItem(me.student);
		
		var obj = {
			"consultID": localStorage.consultID,
			"schoolID" : localStorage.schoolID 
			//来自公众号的学生，没有归属咨询师怎么办？让校长归属 
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					
				};
			}   		
		});	  
		
		// 某个学校的分校区1-n个，表先加载进来，添加修改用
		var objSub = {
			"schoolID": localStorage.schoolID
		}		
		var storeSchoolsub = Ext.getStore('Schoolsub'); 
		storeSchoolsub.removeAll()
		storeSchoolsub.clearFilter() 
		storeSchoolsub.getProxy().setUrl(me.getApplication().dataUrl + 
			'readSchoolsubList.php?data=' + JSON.stringify(objSub));
		storeSchoolsub.load({
			callback: function(records, operation, success){
			    if (success){
					console.log(records)
				};
			} 
		})			 
	},
	
	// 向左滑动，删除
	studentItemswipe: function( list, index, target, record, e, eOpts ){
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
			    url: me.getApplication().dataUrl + 'deleteStudent.php',
			    params: {
					studentID: rec.data.studentID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Student').remove(rec);
					}		         
			    }
			});
		}
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		// 点击‘修改编辑’
		if(e.target.className == 'edit'){
			me.studentedit = Ext.create('Youngshine.view.student.Edit');
			Ext.Viewport.add(me.studentedit); //否则build后无法显示
			Ext.Viewport.setActiveItem(me.studentedit); //show()?
			console.log(record.data)
			me.studentedit.setRecord(record)
			
			// 任课教师selectfield，不用store,这样才能显示名字
			var selectBox = me.studentedit.down('selectfield[name=schoolsubID]')
			selectBox.updateOptions(Ext.getStore('Schoolsub').data.items); 
			console.log(Ext.getStore('Schoolsub').data.items)
			selectBox.setValue(record.data.schoolsubID); 
			return
		}
		// 沟通联络记录
		if(e.target.className == 'followup'){
			me.studentfollowup = Ext.create('Youngshine.view.student.Followup');
			me.studentfollowup.setParentRecord(record)
			
			Ext.Viewport.setMasked({xtype:'loadmask',message:'读取联络记录'});
			// 预先加载的数据
			var obj = {
				"studentID": record.data.studentID,
			}
			var store = Ext.getStore('Followup'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(this.getApplication().dataUrl + 
				'readFollowupList.php?data='+JSON.stringify(obj) );
			store.load({ //异步async
				callback: function(records, operation, success){
					Ext.Viewport.setMasked(false);
					if (success){
						Ext.Viewport.add(me.studentfollowup) // build?
						Ext.Viewport.setActiveItem(me.studentfollowup);
					}else{
						Ext.toast(result.message,3000);
					};
				}   		
			});	
			return
		}
		// 沟通联络记录
		if(e.target.className == 'accnt'){
			me.studentaccnt = Ext.create('Youngshine.view.student.Accnt');
			me.studentaccnt.setParentRecord(record)
			Ext.Viewport.add(me.studentaccnt) // build?
			Ext.Viewport.setActiveItem(me.studentaccnt);
			
			// 预先加载的数据
			var obj = {
				"studentID": record.data.studentID,
			}
			console.log(obj)
			var store = Ext.getStore('Accnt'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(this.getApplication().dataUrl + 
				'readAccntListByStudent.php?data='+JSON.stringify(obj) );
			store.load({ //异步async
				callback: function(records, operation, success){
					if (success){
						
					}else{
						Ext.toast(result.message,3000);
					};
				}   		
			});	
			return
		}
		// 场景二维码
		if(e.target.className == 'qrcode'){
			var overlay = Ext.Viewport.add({
				xtype: 'panel',
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				width: 450,height: 480,
				scrollable: true,
				hidden: true,
		        items: [{	
		        	xtype: 'toolbar',
		        	docked: 'top',
		        	title: '一键扫码注册',
				},{
					xtype: 'component',
					html: ''
				}],	
			})
			//this.overlay.show()
			Ext.Ajax.request({
			    url: 'script/weixinJS_gongzhonghao/wx_qrcode.php',
			    params: {
					studentID: record.data.studentID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					console.log(ret)
					overlay.show()
					
					//overlay.down('image').setSrc(ret.img)  
					var img = '<img src=' + ret.img + ' />'
					overlay.setHtml(img) 
					overlay.down('toolbar').setTitle(record.data.studentName+'｜'+record.data.phone)
			    }
			});	
			return
		}
/*		
		me.studentshow = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(me.studentshow); //很重要，否则build后无法菜单，出错
		me.studentshow.down('panel[itemId=my_show]').setData(record.data)
		me.studentshow.show(); 
		me.studentshow.setRecord(record); // 当前记录参数
*/
		me.studentstudy = Ext.create('Youngshine.view.student.Study');
		Ext.Viewport.add(me.studentstudy); //否则build后无法显示
		//me.teacherkcb.show()
		//Ext.Viewport.setActiveItem(me.teacherkcb); //show()?
		console.log(record.data.studentID)
		
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'readStudyListByStudent.php',
		    params: {
				studentID: record.data.studentID
		    },
		    success: function(response){
				var arr = JSON.parse(response.responseText)
				console.log(arr)
				var content = ''
				Ext.Array.each(arr, function(name, index) {
					content += name.zsdName + '<br>' + 
						'<span style="font-size:0.8em;color:#888;">' + 
						name.times + '课时；' +
						name.teacherName + '老师' + '</span><br>'
				});		
				console.log(content) 
				var obj = {
					studentName: record.data.studentName,
					kcb: content
				}  
				me.studentstudy.down('panel[itemId=my_show]').setData(obj)
				me.studentstudy.show();      
		    }
		});		
	},

	// 缴费记录的返回
	studentaccntBack: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.studentaccnt,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},
	
	studentAddnew: function(win){		
		var me = this;
		
		//if(!me.studentaddnew){
			me.studentaddnew = Ext.create('Youngshine.view.student.Addnew');
			Ext.Viewport.add(me.studentaddnew);
		/*}else{
			// 清除部分，保留重复填写项，就不能destroy or remove
			me.studentaddnew.down('textfield[name=studentName]').setValue('')
			me.studentaddnew.down('textfield[name=phone]').setValue('')
			me.studentaddnew.down('textfield[name=addr]').setValue('')
		} */
		Ext.Viewport.setActiveItem(me.studentaddnew)
	},
	
	// 取消添加
	studentaddnewCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},	
	studentaddnewSave: function( obj,oldView )	{
    	var me = this; 

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				Ext.data.JsonP.request({
				    url: me.getApplication().dataUrl + 'createStudent.php',
				    params: {
						data: JSON.stringify(obj)
					},
				    success: function(result){
				        console.log(result)
						Ext.toast(result.message,3000)
						if(result.success){
							//var text = response.responseText; JSON.parse()
							//oldView.destroy()
							Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
							Ext.Viewport.setActiveItem(me.student);
							obj.studentID = result.data.studentID; //删除用
							//obj.created = new Date();
							Ext.getStore('Student').insert(0,obj)
						}
				    }
				});
			}
		});	
	},
	// 取消添加
	studenteditCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.studentedit,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},	
	studenteditSave: function( obj,oldView )	{
    	var me = this; 

		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'updateStudent.php',
		    params: obj,
		    success: function(result){
		        //var text = response.responseText; JSON.parse()
				//oldView.destroy()
				//Ext.Viewport.setActiveItem(me.student);
				//rec.set(obj) //前端更新显示
				Ext.toast('修改成功',3000)
				Ext.Viewport.remove(me.studentedit,true); //remove 当前界面
		    }
		});
	},
	
	studentfollowupBack: function(oldView){		
		var me = this;
		//oldView.destroy()	
		Ext.Viewport.remove(me.studentfollowup,true); //remove/destroy 当前界面
		Ext.Viewport.setActiveItem(me.student);
	},
	// 添加沟通记录
	studentfollowupSave: function(obj,oldView){		
		var me = this;
		Ext.data.JsonP.request({
            url: me.getApplication().dataUrl + 'createFollowup.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result)
				if(result.success){
					obj.studentfollowID = result.data.studentfollowID; 
					obj.created = '刚刚'
					Ext.getStore('Followup').insert(0,obj)
				}	
				Ext.toast(result.message,3000)
			},
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
