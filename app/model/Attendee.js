// 某个班级的报读学生（可能学生报读课时与默认课时不同，少报）
Ext.define('Youngshine.model.Attendee', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'classstudentID'}, 
			{name: 'hour'}, // 该学生报读课时不同一，有的会少报
			{name: 'amount'}, 
			{name: 'studentID'}, 
			{name: 'studentName'},
			{name: 'gender'},
			{name: 'classID'}, 
	    ]
    }
});