// 课时套餐价格相关的控制器，
Ext.define('Youngshine.controller.Pricelist', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	pricelist: 'pricelist',
			pricelistaddnew: 'pricelist-addnew',
        },
        control: {
			pricelist: {
				addnew: 'pricelistAddnew', //itemtap
				itemtap: 'pricelistItemtap',
				itemswipe: 'pricelistItemswipe', //delete
				itemtaphold: 'pricelistItemtaphold' //delete
			},
			pricelistaddnew: {
				save: 'pricelistaddnewSave', 
				cancel: 'pricelistaddnewCancel'
			},
        }
    },

	// sidemenu跳转这里 teaching zsd list of a particular teacher
	pricelistList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'pricelist') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.teacher = Ext.create('Youngshine.view.pricelist.List');
		Ext.Viewport.add(me.teacher);
		//view.onGenreChange(); //默认
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Pricelist');
		store.removeAll()
		store.clearFilter() 
		store.getProxy().setUrl(me.getApplication().dataUrl + 
			'readPricelist.php?data=' + JSON.stringify(obj));
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
	pricelistItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 

	},
	// 向左滑动，删除
	pricelistItemtaphold: function( list, index, target, record, e, eOpts ){
		console.log(e);console.log(record)
		//if(e.direction !== 'left') return false

		var me = this;
		//list.select(index,true); // 高亮当前记录 disableSelection
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
					//list.deselect(index); // cancel高亮当前记录
				}
			}]
		});
		Ext.Viewport.add(actionSheet);
		actionSheet.show();	
		
		function del(rec){
			// ajax instead of jsonp
			Ext.Ajax.request({
			    url: me.getApplication().dataUrl + 'deletePricelist.php',
			    params: {
					pricelistID: rec.data.pricelistID
			    },
			    success: function(response){
					var ret = JSON.parse(response.responseText)
					Ext.toast(ret.message,3000)
					if(ret.success){
						Ext.getStore('Pricelist').remove(rec);
					}		         
			    }
			});
		}
	},	

	pricelistAddnew: function(win){		
		var me = this;

		if(!me.pricelistaddnew){
			me.pricelistaddnew = Ext.create('Youngshine.view.pricelist.Addnew');
			Ext.Viewport.add(me.pricelistaddnew)
		}
		Ext.Viewport.setActiveItem(me.pricelistaddnew)
	},
	
	// 取消添加
	pricelistaddnewCancel: function(oldView){		
		var me = this; 
		//Ext.Viewport.remove(me.teacheraddnew,true); //remove 当前界面	
		Ext.Viewport.remove(oldView)
		Ext.Viewport.setActiveItem(me.pricelist);
	},	
	pricelistaddnewSave: function( obj,oldView )	{
    	var me = this; 
		// ajax or jsonp(data:obj)
		Ext.data.JsonP.request({
		    url: me.getApplication().dataUrl + 'createPricelist.php',
		    params: {
				data: JSON.stringify(obj)
			},
		    success: function(result){
		        console.log(result)
		        //record.set('fullEndtime','')
				oldView.destroy()
				Ext.Viewport.setActiveItem(me.pricelist);
				//obj.teacherID = result.data.teacherID
				//obj.created = new Date();
				Ext.getStore('Pricelist').load(); //.insert(0,obj)
		    }
		});
	},
			
	/* 如果用户登录的话，控制器launch加载相关的store */
	launch: function(){
	    this.callParent(arguments);
		console.log('pricelist controller launch');
	},
	init: function(){
		this.callParent(arguments);
		console.log('pricelist controller init');
	}
});
