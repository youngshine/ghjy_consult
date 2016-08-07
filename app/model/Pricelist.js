// 某个学校的一对一课程
Ext.define('Youngshine.model.Pricelist', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'pricelistID'}, 
			{name: 'title'}, 
			{name: 'unitprice'}, 
			{name: 'amount'}, 
			{name: 'hour'}, 
			
			{name: 'schoolID'}, 
			{name: 'schoolName'},
        ]
    }
});