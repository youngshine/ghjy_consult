// 测评相关控制器，报名前
Ext.define('Youngshine.controller.Assess', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	assess: 'assess',
			assessaddnew: 'assess-addnew',
			student: 'assess-student',
			assesschart: 'assess-chart',
        },
        control: {
			assess: {
				addnew: 'assessAddnew',
				itemtap: 'assessItemtap', //包括'排课‘’
				itemswipe: 'assessItemswipe' //delete
			},
			assessaddnew: {
				save: 'assessaddnewSave',
				cancel: 'assessaddnewCancel',
				student: 'assessaddnewStudent', //查找选择学生 
			},
			student: {
				//search: '', //itemtap
				itemtap: 'studentItemtap'
			},
        }
    },

	// sidemenu跳转这里 teaching zsd list of a particular teacher
	assessList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'assess') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.assess = Ext.create('Youngshine.view.assess.List');
		Ext.Viewport.add(me.assess);
		//Ext.Viewport.setActiveItem(me.assess);
		//view.onGenreChange(); //默认
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			"teacherID"  : 0
		}		
		var store = Ext.getStore('Assess');
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readAssessList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
			    if (success){
					Ext.Viewport.setActiveItem(me.assess);
				};
			} 
		})	  			 
	},

	assessItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		console.log(e.target.className)
		
		//if(e.target.className == 'kcb'){
			me.kcbteacher = Ext.create('Youngshine.view.assess.Teacher');
			Ext.Viewport.add(me.kcbteacher); //否则build后无法显示
			//me.studykcb.show()
			console.log(record.data)
			me.kcbteacher.setRecord(record)
			
			// 任课教师selectfield，没有store,这样才能显示名字
			var selectBox = me.kcbteacher.down('selectfield[name=teacherID]')
			console.log(selectBox)
			selectBox.setOptions([
			    {teacherName: record.data.teacherName,  teacherID: record.data.teacherID},
			    //{text: 'Third Option',  value: 'third'}
			])
			selectBox.setValue(record.data.teacherID);
			console.log(selectBox.getValue())
		//}	
	},	
	// 向左滑动，删除
	assessItemswipe: function( list, index, target, record, e, eOpts ){
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
			    url: me.getApplication().dataUrl + 'deleteAssess.php',
			    params: {
					assessID: rec.data.assessID
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
	
	assessAddnew: function(win){		
		var me = this;
		if(!me.assessaddnew){
			me.assessaddnew = Ext.create('Youngshine.view.assess.Addnew');
			Ext.Viewport.add(me.assessaddnew)
		}
		Ext.Viewport.setActiveItem(me.assessaddnew)
	},
	// 取消添加
	assessaddnewCancel: function(oldView){		
		var me = this;
		//Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.assess);
	},	
	assessaddnewSave: function( obj,oldView )	{
    	var me = this; 
		// ajax or jsonp(data:obj)
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createAssess.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
		        //record.set('fullEndtime','')
				oldView.destroy()
				Ext.Viewport.setActiveItem(me.assess);
				obj.assessID = result.data.assessID
				obj.created = new Date();
				Ext.getStore('Assess').insert(0,obj)
		    }
		});
	},
	// 查找选择的学生
	assessaddnewStudent: function(btn)	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.assess.Student');
		Ext.Viewport.add(me.student); //否则build后无法显示

		var obj = {
			"consultID": localStorage.consultID
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
		me.assessaddnew.down('textfield[name=studentName]')
			.setValue(record.data.studentName+'［'+record.data.grade+'］')
		me.assessaddnew.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
	},
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
	},
	init: function(){
		this.callParent(arguments);
		console.log('assess controller init');
	}
});
