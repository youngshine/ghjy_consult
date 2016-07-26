// 大小班级相关
Ext.define('Youngshine.controller.Classes', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	classes: 'classes',
			classesaddnew: 'classes-addnew',
			student: 'assess-student',
			assesstopic: 'assess-topic',
			topicshow: 'topic-show',
			zsd: 'topic-zsd'
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
			'classes-topic': {
				back: 'classestopicBack',
				addnew: 'classestopicAddnew',
				//save: '',
				hist: 'classestopicHist', //历年考点雷达图
				report: 'classestopicReport', //报告
				itemtap: 'classestopicItemtap', //答案及评分
				itemswipe: 'classestopicItemswipe' //delete
			},
			'topic-zsd': { //zsd
				choose: 'zsdChoose' // itemtap
			}
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
		console.log(e.target.className)
		//if(e.target.className == 'kcb'){
			me.classestopic = Ext.create('Youngshine.view.classes.Topic');
			//Ext.Viewport.add(me.classestopic); //否则build后无法显示
			//me.studykcb.show()
			me.classestopic.setParentRecord(record)
			var subject = record.data.subjectName + '｜' + record.data.gradeName + record.data.semester
			me.classestopic.down('toolbar').setTitle('测评：'+subject)
		//}	
		
		// 获取当前测评记录
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取课时记录'});
		var obj = {
			"classesID": record.data.classesID,
			"subjectID": record.data.subjectID, //题目按学科分3个表
		};
		console.log(obj)
		var store = Ext.getStore('Topic'); 
		store.removeAll();
		store.clearFilter()
        var url = this.getApplication().dataUrl + 
			'readTopicList.php?data=' + JSON.stringify(obj);
		store.getProxy().setUrl(url);
        store.load({
			callback: function(records, operation, success){
				Ext.Viewport.setMasked(false);
				if (success){
					Ext.Viewport.add(me.classestopic) // build?
					Ext.Viewport.setActiveItem(me.classestopic);
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
		/* swipe right to pop menu
		if(e.direction == 'right'){ 
			me.getApplication().getController('Main').menuNav()
			return 
		}  */
		if(e.direction != 'left') return
		// left to delete
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
			    url: me.getApplication().dataUrl + 'deleteAssess.php',
			    params: {
					classesID: rec.data.classesID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Assess').remove(rec);
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
	classestopicBack: function(oldView){		
		var me = this;
		//oldView.destroy()	
		console.log(me.classes)	
		//Ext.Viewport.remove(me.teachercourse); //remove 当前界面
		Ext.Viewport.setActiveItem(me.classes);
	},
	// 答案及对错评分
	classestopicItemtap: function(list, index, target, record, e, eOpts){		
		var me = this;
		if(e.target.className=='answer'){
			answer() //评分
			return false
		}
		
		me.topicshow = Ext.create('Youngshine.view.classes.Show');
		Ext.Viewport.add(me.topicshow); //很重要，否则build后无法菜单，出错
		me.topicshow.down('panel[itemId=my_show]').setData(record.data)
		me.topicshow.show(); 
		//me.studentshow.setRecord(record); // 当前记录参数
		
		// 评分
		function answer(){
			list.overlay = Ext.Viewport.add({
				xtype: 'panel',
				modal: true,
				hideOnMaskTap: true,
				centered: true,
				width: 320,
				height: 300,
				scrollable: true,
				styleHtmlContent: true,

		        items: [{	
		        	xtype: 'toolbar',
		        	docked: 'bottom',
					ui: 'light',
					items: [{
						xtype: 'selectfield',
						name: 'done', 
						width: 200,
						//label: '做题评分',
						//labelWidth: 150,
						autoSelect: false,
						options: [
						    {text: '做对', value: 1},
						    {text: '做错', value: 0},
							//{text: '尚未做题', value: 2},
						],
						value: record.data.done,
						defaultPhonePickerConfig: {
							doneButton: '确定',
							cancelButton: '取消'
						},
						listeners: {
							change: function(){
								this.up('panel').down('button[action=submit]').setDisabled(false)
							}
						}
					},{	
						text: '提交结果',
						ui: 'confirm',
						disabled: true,
						action: 'submit',
						handler: function(btn){
							//this.up('panel').onDone()
							done()
						}
					}]
				},{
					xtype: 'component',
					html: record.data.answer
				}],	
			})
			list.overlay.show()
			
			//评分
			function done(doneObj,view){
				var obj = {
					"done": list.overlay.down('selectfield[name=done]').getValue(), //doneObj.done,
					//'fullDone': doneObj.fullDone,
					"classestopicID": record.data.classestopicID
				}
				console.log(obj);
				Ext.Ajax.request({
					url: me.getApplication().dataUrl + 'updateTopicAssess.php',
					params: obj,
					success: function(response){	
						// 更新前端	
						record.set('done',obj.done)		
						//record.set('fullDone',doneObj.fullDone)
						Ext.toast('测评评分完成')
						list.overlay.destroy()
					}
				});
			}
		}
	},	
	// 向左滑动，删除
	classestopicItemswipe: function( list, index, target, record, e, eOpts ){
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
			    url: me.getApplication().dataUrl + 'deleteTopicAssess.php',
			    params: {
					classestopicID: rec.data.classestopicID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					console.log(ret)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Topic').remove(rec);
					}		         
			    }
			});
		}
	},	
	classestopicAddnew: function(obj,oldView){		
    	var me = this; 
		me.zsd = Ext.create('Youngshine.view.classes.Zsd');
		me.zsd.setParentRecord(obj)
		Ext.Viewport.add(me.zsd); //否则build后无法显示
		//me.topiczsd.show(); // overlay show
		
		// 当前学科年级学期的历年考试知识点hist
		var store = Ext.getStore('Zsd'); 
		store.removeAll();
		store.clearFilter()
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readZsdhistList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				console.log(records)
				me.zsd.show();
				console.log(me.zsd.getParentRecord())
			}   		
		});	
	},
	// 选中测评年级学科知识点，添加其题目用于测评
	zsdChoose: function( obj,oldView)	{
    	var me = this; 
		//list.hide()
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'正在创建题目'});
    	Ext.Ajax.request({			
		    url: Youngshine.app.getApplication().dataUrl + 
				'readTopicAndInsert.php',
			//callbackKey: 'callback',
			//timeout: 9000,
			params: obj,
			success: function(response){ // 服务器连接成功 
				Ext.Viewport.setMasked(false);
				var ret = JSON.parse(response.responseText);
				console.log(ret)
				Ext.getStore('Topic').insert(0,ret); //.load()
			},
		});
	},
	// 历年考点雷达图
	classestopicHist: function(obj)	{
    	var me = this; 
		
		me.classeshist = Ext.create('Youngshine.view.classes.PolarChart');
		Ext.Viewport.add(me.classeshist); //否则build后无法显示
		
		var store = Ext.getStore('Zsdhist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readZsdhistList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        console.log(records)
				if (success){
					//Ext.Viewport.setActiveItem(me.classeshist);
					me.classeshist.show(); // overlay show
				};
			}   		
		});	
	},
	// 测评报告
	classestopicReport: function(obj)	{
    	var me = this; 
		
		me.classesreport = Ext.create('Youngshine.view.classes.ReportChart');
		
		var student = '<div>姓名：'+obj.studentName+'</div>' + 
					  '<div>学科：'+obj.gradeName+obj.subjectName+'</div>' 
		me.classesreport.down('component[itemId=student]').setHtml(student)
		
		var store = Ext.getStore('Topic')
		var zsd = '<div>测评知识点：</div>'
		store.each(function(record){
			zsd = zsd + '<div>［'+record.data.fullDone + '］'+record.data.zsdName+'</div>'
		})
		me.classesreport.down('component[itemId=zsd]').setHtml(zsd)
		
		var store = Ext.getStore('Zsdhist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readZsdhistList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        console.log(records)
				if (success){
					Ext.Viewport.add(me.classesreport); //否则build后无法显示
					//Ext.Viewport.setActiveItem(me.classeshist);
					me.classesreport.show(); // overlay show
				};
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
