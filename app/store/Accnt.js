// 缴费主记录
Ext.define('Youngshine.store.Accnt', {
    extend: 'Ext.data.Store',
	requires: 'Youngshine.model.Accnt',
	
    config: {
        model: 'Youngshine.model.Accnt',
        proxy: {
            type: 'jsonp',
			callbackKey: 'callback',
			url: '',
			reader: {
				type: "json",
				rootProperty: "data"
			}
        },
		sorters: {
			property: 'created',
			direction: 'DESC'
		}
    }
});
