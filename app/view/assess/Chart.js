Ext.define('Youngshine.view.assess.Chart', {
    extend: 'Ext.Panel',
    xtype: 'assess-chart',

    requires: [
        'Ext.chart.Chart',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Category'
    ],

    config: {
        cls: 'card1',
        layout: 'fit',
        items: [{
    		xtype: 'toolbar',
    		docked: 'top',
    		title: '历年考点雷达图表',
			items: [{
				ui : 'back',
				action: 'back',
				text : '返回',
				handler: function(){
					//this.up('list').onBack()
					this.up('panel').destroy()
				}
			}]	
		},{
            xtype: 'chart',
            store: {
		        fields: ['id', 'amount', 'name'],
		        data: [
		            {id: 1, amount: 100, name: 'Other'},
		            {id: 2, amount: 250, name: 'Pharmacology'},
		            {id: 3, amount: 275, name: 'Energy'},
		            {id: 4, amount: 500, name: 'Textiles'},
		            {id: 5, amount: 750, name: 'Agriculture'},
		            {id: 6, amount: 900, name: 'Technology'}
		        ]	
            },
            background: 'white',
            flipXY: true,

            colors: [
                "blue"
            ],

            series: [
                {
                    type: 'bar',
                    xField: 'name',
                    yField: ['amount']
                }
            ],
            axes: [
                {
                    type: 'category',
                    position: 'left',
                    fields: 'name'
                }
            ]
        }]
    }
});