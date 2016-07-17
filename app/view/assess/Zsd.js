// 查找选择添加 报读知识点
Ext.define('Youngshine.view.assess.Zsd',{
	extend: 'Ext.dataview.List',
	xtype: 'topic-zsd',

	config: {
		//emptyText: '选择学科',
		store: 'Zsd',
		itemTpl: '<div>{zsdName}</div>',
        // We give it a left and top property to make it floating by default
        right: 0,
        top: 40,
		width: 450,height: '80%',
		border: 5,
		style: 'border-color: black; border-style: solid;',

        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: true,

        // Make it hidden by default
        hidden: true,
        scrollable: true,
		
        items: [{
            docked: 'top',
            xtype: 'toolbar',
			ui: 'gray',
  		    title: '选择知识点'
        }],
		
		parentRecord: null
	},
	
	initialize: function(){
		this.callParent(arguments)
		this.on('itemtap',this.onItemtap)
	},
	
	// 显示详情
    onItemtap: function(list, index, item, record){
		var me = this
		console.log(me.getParentRecord())
		//console.log(record)
		var obj = {
			level: 3, //测评选择难度高3
			zsdID: record.data.zsdID, //选择知识点列表,zsdID非唯一unique
			subjectID: record.data.subjectID,
			gradeID: record.data.gradeID,
			assessID: me.getParentRecord().assessID
			//consultID: sessionStorage.consultID
	    }
		console.log(obj)	
		me.fireEvent('choose',obj,me)
		this.hide()
    }, 
});