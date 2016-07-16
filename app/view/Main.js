Ext.define('Youngshine.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'mainview',
	id: 'mainview',
	
    requires: [
        'Ext.TitleBar',
		'Youngshine.view.Menu'
    ],
    config: {
		//scrollable: true,
        layout: 'fit',
        items: [{
			xtype: 'toolbar',
			docked: 'top',
			//style: 'background:#74B446', //flat
			//ui: 'green',
			title: '根号教育－咨询端',
			items: [{
				iconCls: 'list',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					btn.up('panel').onMenu()
				} 
			},{
				xtype: 'spacer'			
			},{
				iconCls: 'settings',
				iconMask: true,
				ui: 'plain',
				handler: function(btn){
					// menu -> onMember
					//Ext.Viewport.remove(Ext.Viewport.getActiveItem(),true); //remove 当前界面
			    	//Ext.Viewport.setActiveItem(Ext.create('Youngshine.view.member.Edit'));
					btn.up('panel').onSetup()
				} 
			}]	
		},{	
            xtype: 'carousel',

            //the direction is horizontal
            direction: 'vertical',

            //we turn on direction lock so you cannot scroll diagonally
            directionLock: true,

            //and give it the items array
            items: [{
                xtype: 'image',
                //cls: 'my-carousel-item-img',
                src: 'resources/images/carousel03.jpg'
			},{
                xtype: 'image',
                //cls: 'my-carousel-item-img',
                src: 'resources/images/carousel02.jpg'
			},{
                xtype: 'image',
                //cls: 'my-carousel-item-img',
                src: 'resources/images/carousel01.jpg'		
            }]
        }],
    },
	
	onMenu: function(){
		/*
		var me = this;
		var menu = Ext.create('Youngshine.view.Menu')
		Ext.Viewport.setMenu(menu, {
			side: 'left',
			cover: false //reveal: true
		});
		Ext.Viewport.toggleMenu('left');	*/
		Youngshine.app.getApplication().getController('Main').menuNav() 
	},
	// 设置密码 ，small window-overlay
	onSetup: function(){
		var me = this; 
		this.overlay = Ext.Viewport.add({
			xtype: 'panel',
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			width: 330,height: 270,
			scrollable: true,

	        items: [{	
	        	xtype: 'toolbar',
	        	docked: 'top',
	        	title: '密码修改',
			},{
				xtype: 'fieldset',
				width: 300,
				//margin: '10 10 0 10',
				items: [{
					xtype: 'textfield',
					readOnly: true,
					label: '咨询师',
					value: localStorage.consultName
				},{	
					xtype : 'passwordfield',
					itemId : 'psw1',
					//margin: '1 10 0 10',
					label : '新密码', //比对确认密码
					scope: this
				},{
					xtype : 'passwordfield',
					itemId : 'psw2',
					//margin: '1 10 0 10',
					label : '确认密码', 
					scope: this
				}]	
			},{
				xtype: 'button',
				text: '保存',
				action: 'save',
				margin: '-15 10 15',
				ui: 'confirm',
				handler: function(btn){
					var me = this;
					var psw1 = this.up('panel').down('passwordfield[itemId=psw1]').getValue().trim(),
						psw2 = this.up('panel').down('passwordfield[itemId=psw2]').getValue().trim()
					console.log(psw1)
					if(psw1.length<6){
						Ext.toast('密码少于6位',3000); return
					}
					if(psw1!= psw2){
						Ext.toast('确认密码错误',3000); return
					}
					// ajax
					Ext.Ajax.request({
					    url: Youngshine.app.getApplication().dataUrl + 'updatePsw.php',
					    params: {
					        psw1     : psw1,
							consultID: localStorage.consultID
					    },
					    success: function(response){
					        var text = response.responseText;
					        // process server response here
							Ext.toast('密码修改成功',3000)
							me.up('panel').destroy()
					    }
					});
				}
			}],	
		})
		this.overlay.show()
	},	
	
    //use initialize method to swipe back 右滑返回
    initialize : function() {
        this.callParent();
        this.element.on({
            scope : this,
            swipe : 'onElSwipe' //not use anonymous functions
        });
    },   
    onElSwipe : function(e) {
        if(e.direction=='right'){
        	this.onMenu();
        };     
    },

});
