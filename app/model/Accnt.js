// 缴费，主表
Ext.define('Youngshine.model.Accnt', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'accntID'}, 
			{name: 'accntType'}, // 类别：一对一、大小班
			
			//{name: 'pricelistID'}, // 一对一课程的套餐名称
			//{name: 'title'}, 
			//{name: 'unitprice'}, 
			//{name: 'hour'}, 
			
			{name: 'accntDate'}, 
			{name: 'amount'}, // 实收金额
			{name: 'amount_ys'}, // 应收
			{name: 'amount_owe'}, // 欠款，后来补缴时再修改为0
			
			{name: 'note'}, 
			
			{name: 'studentID'}, // 咨询师创建的
			{name: 'studentName'},
			
			{name: 'consultID'}, // 咨询师创建的
			{name: 'consultName'},
			
			{name: 'created'},
		
			{ name: 'fullDate', convert: function(value, record){
					//return record.get('created').substr(2,8);
				} 
			}, 
	    ]
    }
});