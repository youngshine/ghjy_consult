// 对应某个大小班课程的班级列表（可能开多个班）
Ext.define('Youngshine.view.classes.ClassList',{
	extend: 'Ext.dataview.List',
	xtype: 'class-list',

	config: {
		parentRecord: null, //父窗口的参数 setParentRecord()
		//emptyText: '选择学科',
		striped: true,
		store: 'Classes',
		itemTpl: '<div>{title}</div>'+
			'<div style="font-size:0.8em;color:#888;">上课：{timely_list}</div>'+
			'<div style="font-size:0.8em;color:#888;">校区：{fullname}</div>',
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
			title: '分配班级',
			ui: 'light',
            items: [{
				text: '确定',
				action: 'choose',
				ui: 'confirm',
				disabled: true
            }]
        }],
	},

	initialize: function(){
		this.callParent(arguments)
		//this.on('itemtap',this.onItemtap)
		this.on('select',this.onSelect)
	},
	onSelect: function(list, record){
		var me = this
		me.down('button[action=choose]').setDisabled(false)
		
		// 把当前课程学生加入选中班级成员
		me.down('button[action=choose]').on('tap',function(){
			var obj = {
				classID: record.data.classID,
				studentID: me.getParentRecord().data.studentID,
				accntdetailID: me.getParentRecord().data.accntdetailID //更改状态
		    }
			console.log(obj);	
			me.fireEvent('choose',obj,me)
			me.destroy()
		})
	},
	
});