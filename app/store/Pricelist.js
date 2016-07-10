// 课时套餐，各个校区不同
Ext.define('Youngshine.store.Pricelist', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Pricelist',
	
    config: {
        model: 'Youngshine.model.Pricelist',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
    }
});
