// 购买课时订单相关的控制器，
Ext.define('Youngshine.controller.Orders', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
           	orders: 'orders',
			ordersaddnew: 'orders-addnew',
			ordersshow: 'orders-show'
        },
        control: {
			orders: {
				addnew: 'ordersAddnew', //itemtap
				itemtap: 'ordersItemtap'
			},
			ordersaddnew: {
				save: 'ordersaddnewSave', 
				cancel: 'ordersaddnewCancel',
				student: 'ordersaddnewStudent', //查找选择学生 
			},
        }
    },

	// sidemenu跳转这里 student list of a particular consultant
	ordersList: function(){
		var me = this;
		var curView = Ext.Viewport.getActiveItem();
		if(curView.xtype == 'orders') return
 
		Ext.Viewport.remove(curView,true); //remove 当前界面
		me.orders = Ext.create('Youngshine.view.orders.List');
		Ext.Viewport.add(me.orders);
		//me.student.onGenreChange(); //默认
		
		var obj = {
			"consultID": localStorage.consultID
		}	
		console.log(obj)	
		var store = Ext.getStore('Orders'); 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readOrdersList.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){
		        //Ext.Viewport.setMasked(false);
				console.log(records)
		        if (success){
					Ext.Viewport.setActiveItem(me.orders);
				};
			}   		
		});	  			 
	},
	ordersItemtap: function( list, index, target, record, e, eOpts )	{
    	var me = this; 
		me.studentshow = Ext.create('Youngshine.view.student.Show');
		Ext.Viewport.add(me.studentshow); //很重要，否则build后无法菜单，出错
		me.studentshow.down('panel[itemId=my_show]').setData(record.data)
		me.studentshow.show(); 
		me.studentshow.setRecord(record); // 当前记录参数
	},

	ordersAddnew: function(win){		
		var me = this;
		
		if(!me.studentaddnew){
			me.ordersaddnew = Ext.create('Youngshine.view.orders.Addnew');
			Ext.Viewport.add(me.ordersaddnew)
		}
		Ext.Viewport.setActiveItem(me.ordersaddnew)
		
		// 当前校区的课时套餐价格表
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Pricelist'); 
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readPricelist.php?data=' + JSON.stringify(obj));
		store.load({
			callback: function(records, operation, success){

			}   		
		});	
	},
	
	// 取消添加
	ordersaddnewCancel: function(oldView){		
		var me = this; 
		oldView.destroy()
		//Ext.Viewport.remove(me.studentaddnew,true); //remove 当前界面
		Ext.Viewport.setActiveItem(me.orders);
	},	
	ordersaddnewSave: function( obj )	{
    	var me = this; 

    	Ext.Msg.confirm('',"确认提交保存？",function(btn){	
			if(btn == 'yes'){
				Ext.Ajax.request({
				    url: me.getApplication().dataUrl + 'createOrders.php',
				    params: obj,
				    success: function(response){
				        var text = response.responseText;
				        //record.set('fullEndtime','')						
				    }
				});
			}
		});	
	},
	// 查找选择购买的学生
	ordersaddnewStudent: function()	{
    	var me = this; 
		me.student = Ext.create('Youngshine.view.orders.Student');
		//Ext.Viewport.add(me.teachercourseassess); //否则build后无法显示
		return
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
		console.log('orders controller init');
	}
});
