// 测评的题目
Ext.define('Youngshine.model.Topic', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'assesstopicID'}, 
			{name: 'studentID'}, // 学生
			{name: 'studentName'},
			{name: 'zsdID'}, // 补习知识点
			{name: 'zsdName'}, // 知识点名称，前端显示用
			{name: 'subjectID'}, // 学科
			{name: 'subjectName'}, // 学科名称
			{name: 'gradeName'}, //关联表的字段名称
			{name: 'gid'}, //题目id字符
			{name: 'content'}, 	
			{name: 'answer'}, //题目id字符
			{name: 'objective_answer'}, 
			{name: 'level'}, //测评结果：低1中2高3
		
			{name: 'done'}, //做题结果：错0，对1
			//{name: 'created'},
		
			{ name: 'fullLevel', convert: function(value, record){
					var level = record.get('level');
					if(level==1)
						return '低';
					if(level==2)
						return '中';
					if(level==3)
						return '高';
				} 
			},
			{ name: 'fullDone', convert: function(value, record){
					var done = record.get('done');
					if(done==1) return '做对';
					if(done==0) return '做错';
					if(done==2 ||done==null) return '尚未做题';
				} 
			},
		]	
    }
});