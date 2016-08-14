// 查找选择添加 一对一报读知识点
Ext.define('Youngshine.view.one2one.study.Zsd',{
	extend: 'Ext.dataview.List',
	xtype: 'study-zsd',

	config: {
		parentRecord: null, //父窗口的参数 setParentRecord()
		//emptyText: '选择学科',
		striped: true,
		store: 'Zsd',
		itemTpl: '<div><span>{zsdName}</span>'+
			'<span style="float:right;color:#888;">{times}</span></div>',
        // We give it a left and top property to make it floating by default
        right: 0,
        top: 0,
		width: 450,height: '100%',
		border: 5,
		style: 'border-color: black; border-style: solid;',

        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: true,

        // Make it hidden by default
        hidden: true,
        scrollable: true,

        // Insert a title docked at the top with a title
        items: [{
            docked: 'top',
            xtype: 'toolbar',
			ui: 'light',
            items: [{
				text: '确定',
				action: 'choose',
				ui: 'confirm',
				disabled: true
			},{	
				xtype: 'spacer'
			},{	
				xtype: 'selectfield',
				itemId: 'subject', 
				placeHolder: '选择学科',
				width: 150,
				autoSelect: false,
				options: [
				    {text: '数学', value: 1},
				    {text: '物理', value: 2},
				    {text: '化学', value: 3}
				],
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
				xtype: 'selectfield',
				itemId: 'grade', 
				placeHolder: '选择年级',
				width: 150,
				disabled: true,
				autoSelect: false,
				options: [
				    {text: '九年级', value: '九年级'},
				    {text: '八年级', value: '八年级'},
				    {text: '七年级', value: '七年级'},
				    {text: '六年级', value: '六年级'},
				    {text: '五年级', value: '五年级'},
				    {text: '四年级', value: '四年级'},
				    {text: '三年级', value: '三年级'},
				    {text: '二年级', value: '二年级'},
				    {text: '一年级', value: '一年级'}
				],	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},	
            }]
        }],
		
    	listeners: [{
			delegate: 'selectfield[itemId=subject]',
			event: 'change', // need return to work
			fn: 'onSubject' 
		},{
			delegate: 'selectfield[itemId=grade]',
			event: 'change', // need return to work
			fn: 'onGrade'							
    	}]
	},

	initialize: function(){
		this.callParent(arguments)
		//this.on('itemtap',this.onItemtap)
		this.on('select',this.onSelect)
	},
	onSelect: function(list, record){
		var me = this
		me.down('button[action=choose]').setDisabled(false)
		
		me.down('button[action=choose]').on('tap',function(){
			var obj = {
				zsdID: record.data.zsdID,
				zsdName: record.data.zsdName,
				subjectID: record.data.subjectID,
				times: record.data.times,
				studentID: me.getParentRecord().data.studentID,
				//prepaidID: me.ordersstudy.getRecord().data.prepaidID
				accntID: me.getParentRecord().data.accntID
		    }
			console.log(obj);	
			me.fireEvent('choose',obj,me)
			//me.destroy()
			me.deselectAll()
			me.getStore().remove(record); // list.remove(record)???
			this.setDisabled(true)
		})
	},
	
	// 搜索过滤
    onSubject: function(field,newValue,oldValue){
		console.log(newValue)
		var me = this;
		me.down('selectfield[itemId=grade]').setDisabled(false)
		
		var obj = {
			"subjectID": newValue,
		}
		var store = Ext.getStore('Zsd'); 
		store.removeAll();
		store.clearFilter()
		store.getProxy().setUrl(Youngshine.app.getApplication().dataUrl + 
			'readZsdList.php?data='+JSON.stringify(obj) );
		store.load({ //异步async
			callback: function(records, operation, success){
				console.log(records)
			}   		
		});	
	},	
	onGrade: function(field,newValue,oldValue){
		console.log(newValue)
		var store = Ext.getStore('Zsd');
		// var store = this.down('list').store; //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('gradeName', newValue, true);
	},
	
});