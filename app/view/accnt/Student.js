// 查找选择学生
Ext.define('Youngshine.view.accnt.Student',{
	extend: 'Ext.dataview.List',
	xtype: 'accnt-student',

	config: {
		striped: true,
		grouped: true,
		store: 'Student',
		itemTpl: '{studentName}<span style="float:right;">{grade}</span>',
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
				xtype: 'selectfield',
				itemId: 'schoolsub',
                placeHolder: '选择分校区',
				width: 180,
                store: 'Schoolsub',
				valueField: 'schoolsubID',
				displayField: 'fullname',
				autoSelect: false, 	
				defaultPhonePickerConfig: {
					doneButton: '确定',
					cancelButton: '取消'
				},
			},{
            	xtype: 'searchfield',
				placeHolder: '搜索姓名、电话...'
            }]
        }],
		
    	listeners: [{
			delegate: 'selectfield',
			event: 'change', // need return to work
			fn: 'onFilter'
		},{
			delegate: 'searchfield',
			//event: 'change', // need return to work
			event: 'keyup',
			fn: 'onFilter' //'onSearchChange' 						
    	}]
	},

	/* 搜索过滤
    onSearchChange: function(field,newValue,oldValue){
		var store = Ext.getStore('Student');
		// var store = this.down('list').store; //得到list的store: Myaroundroute
		store.clearFilter();
        store.filter('fullStudent', field.getValue(), true); 
		// 正则表达，才能模糊搜索?? true就可以anymatch
	},	*/
    onFilter: function(){
		var schoolsub = this.down('selectfield').getValue(),
			search = this.down('searchfield').getValue().trim()
		console.log(search)
		search = new RegExp("/*" + search); // 正则表达式，模糊查询
		var store = this.getStore(); //得到list的store: Myaroundroute
		store.clearFilter(); //filter is additive
		// 正则表达，才能模糊搜索?? true就可以anymatch
        //store.filter('studentName', field.getValue(), true); 
		if(schoolsub != null ){
			store.filter([
				{property: "schoolsubID", value: schoolsub},
				{property: "fullStudent", value: search}, // 姓名＋手机
			]);
		}else{
			store.filter("fullStudent", search, true);
		}
	},	
});