// 缴费子表
Ext.define('Youngshine.model.AccntDetail', {
    extend: 'Ext.data.Model',

    config: {
	    fields: [
			{name: 'accntdetailID'}, 
			{name: 'accntID'}, 
			{name: 'title'}, 
			{name: 'pricelistID'}, // 一对一课程的套餐名称
			{name: 'unitprice'},  // 一对一单价
			{name: 'kclistID'}, 
			{name: 'hour'}, 
			{name: 'amount'}, // 金额
			
			{name: 'accntType'}, 
			{name: 'accntDate'}, 
			{name: 'studentID'}, // 金额
			{name: 'studentName'}, 
	    ]
    }
});