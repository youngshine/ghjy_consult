// 某个咨询师的学生测评记录
Ext.define('Youngshine.model.Assess', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'assessID'}, 
			{name: 'studentID'}, // 学生
			{name: 'studentName'},
			{name: 'grade'}, 
			{name: 'level_list'}, //学生注册时候的水平：低1中2高3，对应学科

			{name: 'subjectID'}, // 要测评学科
			{name: 'subjectName'}, // 学科名称
			{name: 'gradeID'}, // 学科的年级
			{name: 'gradeName'},
			{name: 'semester'}, // 上下学期

			{name: 'created'},
		
			{name: 'consultID'},//所属的咨询师
		
			{ name: 'fullDate', convert: function(value, record){
					return record.get('created').substr(2,8);
				} 
			}, 
	    ]
    }
});