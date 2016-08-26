// 购买缴费的控制器，退费？？大小班或一对一退费，调出来
Ext.define('Youngshine.controller.Accnt', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	accnt: 'accnt',
			//accntmore: 'accnt-more', //缴费的购买课程明细：一对一或大小班
			accntaddnew: 'accnt-addnew', // 大小班与一对一，2个公用相同xtype
			//accntaddnew1to1: 'accnt-addnew-1to1',
			//accntaddnewclass: 'accnt-addnew-class',
			student: 'accnt-student',
			//pricelist: 'accnt-pricelist', //课程：一对一，大小班
			classes: 'accnt-classes',
        },
        control: {
			accnt: {
				//addnew_1to1: 'accntAddnew_1to1', // 购买缴费一对一套餐，一次一个套餐
				addnew: 'accntAddnew',// 购买报读大小班，一次可报读多个班
				itemtap: 'accntItemtap',
				itemswipe: 'accntItemswipe' // 删除
			}, /*
			accntaddnew1to1: {
				save: 'accntaddnew1to1Save', 
				cancel: 'accntaddnew1to1Cancel',
				student: 'accntaddnewStudent', //查找选择学生
				//pricelist: 'accntaddnewPricelist', //查找选择学生 
			}, */
			accntaddnew: {
				save: 'accntaddnewSave', 
				cancel: 'accntaddnewCancel',
				student: 'accntaddnewStudent', //查找选择学生
				classes: 'accntaddnewClasses', //查找选择学生
			},
			student: {
				itemtap: 'studentItemtap'
			}, /*
			pricelist: {
				itemtap: 'pricelistItemtap'
			}, */
			classes: {
				itemtap: 'classesItemtap'
			},
			accntmore: {
				back: 'accntmoreBack',
				//addnew: 'ordersstudyAddnew',
				itemtap: 'accntmoreItemtap', // '排课'点击按钮
				itemswipe: 'accntmoreItemswipe' // 删除
			},
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	accntList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'Accnt') return
 		   
		// 先show view,然后load data，会有默认load mask   
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.accnt = Ext.create('Youngshine.view.accnt.List');
		Ext.Viewport.add(me.accnt);
		Ext.Viewport.setActiveItem(me.accnt);
		
		var obj = {
			"consultID": localStorage.consultID
		}	
		console.log(obj)	
		var store = Ext.getStore('Accnt'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAccntList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
				console.log(records)
		        if (success){
					me.accnt.onToggle('大小班'); //一开始默认运行
				};
			}   		
		});	 			 
	},
	
	// 向左滑动，删除
	accntItemswipe: function( list, index, target, record, e, eOpts ){
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
					Ext.Viewport.remove(actionSheet,true); //移除dom
					list.setDisableSelection(true)
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
			    url: me.getApplication().dataUrl + 'deleteAccnt.php',
			    params: {
					accntID: rec.data.accntID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Accnt').remove(rec);
					}		         
			    }
			});
		}
	},	

	accntAddnew: function(accntType,win){		
		var me = this;
		
		if(accntType == '一对一'){
			me.accntaddnew = Ext.create('Youngshine.view.accnt.Addnew_1to1');
			// 当前学校的课时套餐价格表
			var objOne2one = {
				"schoolID": localStorage.schoolID,
				"current": 1 //禁用的课程不显示
			}		
			var store = Ext.getStore('Pricelist'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readPricelist.php?data=' + JSON.stringify(objOne2one));
			store.load({
				callback: function(records, operation, success){
					console.log(records)
				}   		
			});	 
		}else if(accntType == '大小班'){
			me.accntaddnew = Ext.create('Youngshine.view.accnt.Addnew_class');
			me.accntaddnew.down('list').getStore().removeAll()
			// 当前学校的大小班课程
			var objClass = {
				"schoolID": localStorage.schoolID,
				"schoolsubID": localStorage.schoolsubID,
				//"consultID": localStorage.consultID //咨询师的大小班
			}		
			var store = Ext.getStore('Classes'); 
			store.removeAll()
			store.clearFilter()
			store.getProxy().setUrl(me.getApplication().dataUrl + 
				'readClassesList.php?data=' + JSON.stringify(objClass));
			store.load({
				callback: function(records, operation, success){
					console.log(records)
				}   		
			});	
		}
		Ext.Viewport.add(me.accntaddnew)
		Ext.Viewport.setActiveItem(me.accntaddnew)
	},
	
	/* 取消添加
	accntaddnew1to1Cancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.accntaddnew1to1,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.accnt);
	},	
	accntaddnew1to1Save: function( obj,oldView )	{
    	var me = this; console.log(obj)

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				Ext.data.JsonP.request({
				    url: me.getApplication().dataUrl + 'createAccnt.php',
				    params: {
						data: JSON.stringify(obj)
					},
				    success: function(result){
						//oldView.destroy(); console.log(result)
						Ext.Viewport.remove(me.accntaddnew,true)
						Ext.Viewport.setActiveItem(me.accnt);
						obj.accntID = result.data.accntID
						obj.created = '刚刚';
						Ext.getStore('Accnt').insert(0,obj)					
				    }
				});
			}
		});	
	}, */
	// 取消添加
	accntaddnewCancel: function(oldView){		
		var me = this; 
		//oldView.destroy()
		Ext.Viewport.remove(me.accntaddnewclass,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.accnt);
	},	
	accntaddnewSave: function( obj,oldView )	{
    	var me = this; console.log(obj)

		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'createAccnt.php',
		    params: obj,
		    success: function(response){ 
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				console.log(ret.data.accntID)
				obj.accntID = ret.data.accntID
				//obj.created = '刚刚';
				Ext.getStore('Accnt').insert(0,obj)	
				
				Ext.Viewport.remove(me.accntaddnew,true)
				Ext.Viewport.setActiveItem(me.accnt);
				
				// 发送模版消息：电子收据
				wxTpl(obj); 

				function wxTpl(person){
					var objWx = {
						wxID       : person.wxID, // 发消息学生家长
						student    : person.studentName,
						accntID    : person.accntID,
						accntType  : person.accntType,
						accntDate  : person.accntDate,
						amount     : person.amount,
						amount_ys  : person.amount_ys,
					}
					console.log(objWx)
					Ext.Ajax.request({
					    url: me.getApplication().dataUrl+'weixinJS_gongzhonghao/wx_msg_tpl.php',
					    params: objWx,
					    success: function(response){
					        var text = response.responseText;
					        // process server response here
							console.log(text)//JSON.parse
					    }
					});
				} // 模版消息end
				
				/* php 后台无法处理，数组arrClassess???
				if(obj.accntType == '大小班'){
					//往class_student表，添加报读的班级，直接在后台php处理？？？
					var objClasses = {
						accntID: obj.accntID,
						studentID: obj.studentID,
						classID: obj.arrClasses['classID'],
					}
					Ext.Ajax.request({
					    url: me.getApplication().dataUrl + 'createClassStudent.php',
					    params: obj.arrClasses,
					    success: function(response){
					    	
					    }
					})
				}	*/		
		    }
		});
	},
	// 查找选择购买的学生（全校）
	accntaddnewStudent: function(btn)	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.accnt.Student');
		Ext.Viewport.add(me.student); //否则build后无法显示

		var obj = {
			"consultID": localStorage.consultID,
			"schoolID" : localStorage.schoolID 
			//必须带上校区，否则公众号学生没归属咨询师
		}	
		console.log(obj)	
		var store = Ext.getStore('Student'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        if (success){
					console.log(records)
					me.student.showBy(btn); // overlay show
				};
			}   		
		});	
	},
	studentItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.accntaddnew.down('textfield[name=studentName]')
			.setValue(record.data.studentName+'［'+record.data.grade+'］')
		me.accntaddnew.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
		// 发微信模版消息用
		me.accntaddnew.down('hiddenfield[name=wxID]').setValue(record.data.wxID)
	},
	
	// 查找选择购买大小班
	accntaddnewClasses: function(btn)	{
    	var me = this; 
		me.classes = Ext.create('Youngshine.view.accnt.Classes');
		Ext.Viewport.add(me.classes); //否则build后无法显示
		me.classes.show();	//overlay
		
		me.classes.getStore().clearFilter()
	},
	classesItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		
		var obj = {
			classID: record.data.classID,
			title: record.data.title,
			hour: record.data.hour,
			amount: record.data.amount,
		}
		console.log(obj); 
		
		list.getStore().removeAt(index); // 移除选中的
		
		var store = me.accntaddnew.down('list').getStore();
		store.insert(0,obj); //新增记录，排在最前面
		//Ext.getStore('Classes').remove(record) //选中的移除消失
		// 金额累加
		var ys = me.accntaddnew.down('textfield[name=amount_ys]'),
			ss = me.accntaddnew.down('textfield[name=amount]')
		var amt = parseInt(record.data.amount)
		ys.setValue(ys.getValue()+amt)
		ss.setValue(ss.getValue()+amt)
	},
	
	/* 查找选择校区的课时套餐价格
	accntaddnewPricelist: function(btn)	{
    	var me = this; 
		me.pricelist = Ext.create('Youngshine.view.accnt.Pricelist');
		Ext.Viewport.add(me.pricelist); //否则build后无法显示

		var obj = {
			"schoolID": localStorage.schoolID
		}	
		console.log(obj)	
		var store = Ext.getStore('Pricelist'); 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readPricelist.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
		        if (success){
					//Ext.Viewport.setActiveItem(me.student);
					me.pricelist.showBy(btn); // overlay show
				};
			}   		
		});	
	},
	pricelistItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		me.accntaddnew.down('textfield[name=taocan]').setValue(record.data.title)
		me.accntaddnew.down('hiddenfield[name=hour]').setValue(record.data.hour)
		me.accntaddnew.down('hiddenfield[name=amount]').setValue(record.data.unitprice)
	},
	
	// 显示课时套餐的报读课程知识点记录
	accntItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(record)
		if(!me.accntmore){
			me.accntmore = Ext.create('Youngshine.view.accnt.More')
			Ext.Viewport.add(me.accntmore)
		}		
		me.accntmore.setRecord(record); //带入当前知识点
		me.accntmore.down('label[itemId=taocan]').setHtml(record.data.taocan)
		
		Ext.Viewport.setMasked({xtype:'loadmask',message:'读取报读知识点'});
		// 预先加载的数据
		var obj = {
			"prepaidID": record.data.prepaidID,
		}
		var store = Ext.getStore('Study'); 
		store.getProxy().setUrl(this.getApplication().dataUrl + 
			'readStudyList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				Ext.Viewport.setMasked(false);
				if (success){
					Ext.Viewport.setActiveItem(me.accntmore);
				}else{
					Ext.toast('出错',3000);
				};
			}   		
		});	
	}, 
	// 返回
	accntmoreBack: function(oldView){		
		var me = this;
		//Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.orders);
	},
	ordersstudyAddnew: function(btn){		
    	var me = this; 
		me.studyzsd = Ext.create('Youngshine.view.orders.study.Zsd');
		Ext.Viewport.add(me.studyzsd); //否则build后无法显示
		me.studyzsd.show(); // overlay show
		
		// 选择学科，才显示知识点
		var store = Ext.getStore('Zsd');
		store.removeAll()
		store.clearFilter()
	},
	// 向左滑动，删除
	accntmoreItemswipe: function( list, index, target, record, e, eOpts ){
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
			console.log(rec)
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deleteStudy.php',
			    params: {
					studentstudyID: rec.data.studentstudyID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Study').remove(rec);
					}		         
			    }
			});
		}
	},	
	// 排课：单击‘排课kcb’
	accntmoreItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(e.target.className)
		
		if(e.target.className == 'kcb'){
			me.studykcb = Ext.create('Youngshine.view.orders.study.Kcb');
			Ext.Viewport.add(me.studykcb); //否则build后无法显示
			//me.studykcb.show()
			console.log(record.data)
			me.studykcb.setRecord(record)
			
			// 任课教师selectfield，没有store,这样才能显示名字
			var selectBox = me.studykcb.down('selectfield[name=teacherID]')
			console.log(selectBox)
			selectBox.setOptions([
			    {teacherName: record.data.teacherName,  teacherID: record.data.teacherID},
			    //{text: 'Third Option',  value: 'third'}
			])
			selectBox.setValue(record.data.teacherID);
			console.log(selectBox.getValue())
		}	
	},
	
	// 选中报读知识点
	studyzsdItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		list.hide()
		
		var obj = {
			zsdID: record.data.zsdID,
			zsdName: record.data.zsdName,
			subjectID: record.data.subjectID,
			studentID: me.ordersstudy.getRecord().data.studentID,
			prepaidID: me.ordersstudy.getRecord().data.prepaidID
		}
		Ext.data.JsonP.request({ //不采用批量添加子表（传递数组），单个添加2014-3-20
            url: me.getApplication().dataUrl +  'createStudy.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.studentstudyID = result.data.studentstudyID; // model数组添加项目
				Ext.getStore('Study').insert(0,obj); //新增记录，排在最前面
				Ext.toast('添加知识点成功',3000)		
            }
		});
	},
	
	// 排课：分配任课教师及上课时间
	studykcbDone: function(obj,oldView)	{
    	var me = this; 
		Ext.Ajax.request({
			url: me.getApplication().dataUrl +  'updateStudyByKcb.php',
			params: obj,
            success: function(response){
				Ext.toast('排课成功',3000)
				oldView.destroy()	
				// 要即时更新前端数据才能正确显示	record.set(obj)
            }
		})
		return
		
		Ext.data.JsonP.request({ //不采用批量添加子表（传递数组），单个添加2014-3-20
            url: me.getApplication().dataUrl +  'updateStudyByKcb.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.studentstudyID = result.data.studentstudyID; // model数组添加项目
				Ext.getStore('Study').insert(0,obj); //新增记录，排在最前面
				Ext.toast('添加知识点成功',3000)		
            }
		});
	}, */
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('accnt controller init');
	}
});
