// 某个咨询师的订单列表：购买课时
Ext.define('Youngshine.model.Pricelist', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
			{name: 'pricelistID'}, 
			{name: 'title'}, 
			{name: 'unitprice'}, 
			{name: 'hour'}, 
			{name: 'schoolID'}, 
			{name: 'schoolName'},
        ]
    }
});