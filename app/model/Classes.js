// 某个咨询师的班级
Ext.define('Youngshine.model.Classes', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'classID'}, 
			{name: 'title'}, // 名称
			{name: 'kclistID'}, //所属课程
			{name: 'persons'}, // 计划招满人数
			{name: 'attendee'}, //实际报读人数
			{name: 'note'}, 
			{name: 'hour'}, // 要测评学科
			{name: 'amount'}, // 学科名称
			{name: 'beginDate'}, // 开课日期
			{name: 'timely_list'}, //上课时间列表
			{name: 'classType'}, // 科目
			
			{name: 'teacherID'}, // 班级教师，待定？
			{name: 'teacherName'},
			
			{name: 'created'},		
			{name: 'consultID'},//所属的咨询师
		
			{ name: 'fullDate', convert: function(value, record){
					return record.get('beginDate').substr(2,8);
				} 
			}, 
	    ]
    }
});