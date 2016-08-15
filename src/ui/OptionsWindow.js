import {isString, isNumber, isBoolean, isObject} from 'd2-utilizr';

export var OptionsWindow;

OptionsWindow = function(c) {
    var t = this,

        appManager = c.appManager,
        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        optionConfig = c.optionConfig,

        showValues,
        hideEmptyRows,
        showTrendLine,
        targetLineValue,
        targetLineTitle,
        baseLineValue,
        baseLineTitle,
        sortOrder,

        rangeAxisMinValue,
        rangeAxisMaxValue,
        rangeAxisSteps,
        rangeAxisDecimals,
        rangeAxisTitle,
        domainAxisTitle,

        hideLegend,
        hideTitle,
        title,

        completedOnly,

        data,
        axes,
        general,
        events,
        window,

        comboBottomMargin = 1,
        checkboxBottomMargin = 2,
        separatorTopMargin = 6,
        cmpWidth = 340,
        labelWidth = 125,
        numberWidth = 80;

		showValues = Ext.create('Ext.form.field.Checkbox', {
			boxLabel: NS.i18n.show_values,
			style: 'margin-bottom:' + checkboxBottomMargin + 'px',
			checked: true
		});

		hideEmptyRows = Ext.create('Ext.form.field.Checkbox', {
			boxLabel: NS.i18n.hide_empty_category_items,
			style: 'margin-bottom:' + checkboxBottomMargin + 'px'
		});

		showTrendLine = Ext.create('Ext.form.field.Checkbox', {
			boxLabel: NS.i18n.trend_line,
			style: 'margin-bottom:' + checkboxBottomMargin + 'px'
		});

		targetLineValue = Ext.create('Ext.form.field.Number', {
			width: numberWidth,
			height: 18,
			listeners: {
				change: function(nf) {
					targetLineTitle.xable();
				}
			}
		});

		targetLineTitle = Ext.create('Ext.form.field.Text', {
			style: 'margin-left:1px; margin-bottom:1px',
			fieldStyle: 'padding-left:3px',
			emptyText: NS.i18n.target,
			width: cmpWidth - labelWidth - 5 - numberWidth - 1,
			maxLength: 100,
			enforceMaxLength: true,
			disabled: true,
			xable: function() {
				this.setDisabled(!targetLineValue.getValue() && !Ext.isNumber(targetLineValue.getValue()));
			}
		});

		baseLineValue = Ext.create('Ext.form.field.Number', {
			//cls: 'gis-numberfield',
			width: numberWidth,
			height: 18,
			listeners: {
				change: function(nf) {
					baseLineTitle.xable();
				}
			}
		});

		baseLineTitle = Ext.create('Ext.form.field.Text', {
			style: 'margin-left:1px; margin-bottom:1px',
			fieldStyle: 'padding-left:3px',
			emptyText: NS.i18n.base,
			width: cmpWidth - labelWidth - 5 - numberWidth - 1,
			maxLength: 100,
			enforceMaxLength: true,
			disabled: true,
			xable: function() {
				this.setDisabled(!baseLineValue.getValue() && !Ext.isNumber(baseLineValue.getValue()));
			}
		});

		sortOrder = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin-bottom:' + comboBottomMargin + 'px',
			width: cmpWidth,
			labelWidth: 125,
			fieldLabel: NS.i18n.sort_order,
			labelStyle: 'color:#333',
			queryMode: 'local',
			valueField: 'id',
			editable: false,
			value: 0,
			store: Ext.create('Ext.data.Store', {
				fields: ['id', 'text'],
				data: [
					{id: 0, text: NS.i18n.none},
					{id: -1, text: NS.i18n.low_to_high},
					{id: 1, text: NS.i18n.high_to_low}
				]
			})
		});

		aggregationType = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin-bottom:' + comboBottomMargin + 'px',
			width: cmpWidth,
			labelWidth: 125,
			fieldLabel: NS.i18n.aggregation_type,
			labelStyle: 'color:#333',
			queryMode: 'local',
			valueField: 'id',
			editable: false,
			value: 'DEFAULT',
			store: Ext.create('Ext.data.Store', {
				fields: ['id', 'text'],
				data: [
					{id: 'DEFAULT', text: NS.i18n.by_data_element},
					{id: 'COUNT', text: NS.i18n.count},
					{id: 'SUM', text: NS.i18n.sum},
					{id: 'STDDEV', text: NS.i18n.stddev},
					{id: 'VARIANCE', text: NS.i18n.variance},
					{id: 'MIN', text: NS.i18n.min},
					{id: 'MAX', text: NS.i18n.max}
				]
			})
		});

        // axes
		rangeAxisMinValue = Ext.create('Ext.form.field.Number', {
			width: numberWidth,
			height: 18,
			labelWidth: 125
		});

		rangeAxisMaxValue = Ext.create('Ext.form.field.Number', {
			width: numberWidth,
			height: 18,
			labelWidth: 125,
            style: 'margin-left:1px'
		});

		rangeAxisSteps = Ext.create('Ext.form.field.Number', {
			width: labelWidth + 5 + numberWidth,
			height: 18,
			fieldLabel: 'Range axis tick steps',
			labelStyle: 'color:#333',
			labelWidth: 125,
			minValue: 1
		});

		rangeAxisDecimals = Ext.create('Ext.form.field.Number', {
			width: labelWidth + 5 + numberWidth,
			height: 18,
			fieldLabel: 'Range axis decimals',
			labelStyle: 'color:#333',
			labelWidth: 125,
			minValue: 0,
            maxValue: 20
		});

		rangeAxisTitle = Ext.create('Ext.form.field.Text', {
			width: cmpWidth,
			fieldLabel: NS.i18n.range_axis_label,
			labelStyle: 'color:#333',
			labelWidth: 125,
			maxLength: 100,
			enforceMaxLength: true,
			style: 'margin-bottom:1px'
		});

		domainAxisTitle = Ext.create('Ext.form.field.Text', {
			width: cmpWidth,
			fieldLabel: NS.i18n.domain_axis_label,
			labelStyle: 'color:#333',
			labelWidth: 125,
			maxLength: 100,
			enforceMaxLength: true,
			style: 'margin-bottom:1px'
		});

        // general
		hideLegend = Ext.create('Ext.form.field.Checkbox', {
			boxLabel: NS.i18n.hide_legend,
			style: 'margin-bottom:' + checkboxBottomMargin + 'px'
		});

		hideTitle = Ext.create('Ext.form.field.Checkbox', {
			boxLabel: NS.i18n.hide_chart_title,
			style: 'margin-bottom:7px',
			listeners: {
				change: function() {
					title.xable();
				}
			}
		});

		title = Ext.create('Ext.form.field.Text', {
			style: 'margin-bottom:0',
			width: cmpWidth,
			fieldLabel: NS.i18n.chart_title,
			labelStyle: 'color:#333',
			labelWidth: 125,
			maxLength: 100,
			enforceMaxLength: true,
			xable: function() {
				this.setDisabled(hideTitle.getValue());
			}
		});

        // events
		completedOnly = Ext.create('Ext.form.field.Checkbox', {
			boxLabel: NS.i18n.include_only_completed_events_only,
			style: 'margin-bottom:' + checkboxBottomMargin + 'px',
		});

        data = {
			xtype: 'container',
			bodyStyle: 'border:0 none',
			style: 'margin-left:14px',
			items: [
				showValues,
				hideEmptyRows,
				showTrendLine,
				{
					xtype: 'container',
					layout: 'column',
					bodyStyle: 'border:0 none',
                    style: 'margin-top:' + (separatorTopMargin + 1) + 'px',
					items: [
						{
							bodyStyle: 'border:0 none; padding-top:3px; margin-right:5px; color:#333',
							width: 130,
							html: 'Target value / title:'
						},
						targetLineValue,
						targetLineTitle
					]
				},
				{
					xtype: 'container',
					layout: 'column',
					bodyStyle: 'border:0 none',
					items: [
						{
							bodyStyle: 'border:0 none; padding-top:3px; margin-right:5px; color:#333',
							width: 130,
							html: 'Base value / title:'
						},
						baseLineValue,
						baseLineTitle
					]
				},
                sortOrder,
                aggregationType
			]
		};

		axes = {
			bodyStyle: 'border:0 none',
			style: 'margin-left:14px',
			items: [
				{
					layout: 'column',
					bodyStyle: 'border:0 none',
					items: [
						{
							bodyStyle: 'border:0 none; padding-top:3px; margin-right:5px; color:#333',
							width: 130,
							html: 'Range axis min/max:'
						},
						rangeAxisMinValue,
						rangeAxisMaxValue
					]
				},
				rangeAxisSteps,
				rangeAxisDecimals,
				rangeAxisTitle,
				domainAxisTitle
			]
		};

		general = {
			bodyStyle: 'border:0 none',
			style: 'margin-left:14px',
			items: [
				hideLegend,
				hideTitle,
				title
			]
		};

		events = {
			bodyStyle: 'border:0 none',
			style: 'margin-left:14px',
			items: [
				completedOnly
			]
		};

		window = Ext.create('Ext.window.Window', {
			title: NS.i18n.chart_options,
			bodyStyle: 'background-color:#fff; padding:3px',
			closeAction: 'hide',
			autoShow: true,
			modal: true,
			resizable: false,
			hideOnBlur: true,
			getOptions: function() {
				return {
					showValues: showValues.getValue(),
                    hideEmptyRows: hideEmptyRows.getValue(),
					showTrendLine: showTrendLine.getValue(),
					completedOnly: completedOnly.getValue(),
					targetLineValue: targetLineValue.getValue(),
					targetLineTitle: targetLineTitle.getValue(),
					baseLineValue: baseLineValue.getValue(),
					baseLineTitle: baseLineTitle.getValue(),
                    sortOrder: sortOrder.getValue(),
                    aggregationType: aggregationType.getValue(),
					rangeAxisMaxValue: rangeAxisMaxValue.getValue(),
					rangeAxisMinValue: rangeAxisMinValue.getValue(),
					rangeAxisSteps: rangeAxisSteps.getValue(),
					rangeAxisDecimals: rangeAxisDecimals.getValue(),
					rangeAxisTitle: rangeAxisTitle.getValue(),
					domainAxisTitle: domainAxisTitle.getValue(),
					hideLegend: hideLegend.getValue(),
					hideTitle: hideTitle.getValue(),
					title: title.getValue()
				};
			},
			setOptions: function(layout) {
				showValues.setValue(Ext.isBoolean(layout.showValues) ? layout.showValues : false);
				hideEmptyRows.setValue(Ext.isBoolean(layout.hideEmptyRows) ? layout.hideEmptyRows : false);
				showTrendLine.setValue(Ext.isBoolean(layout.showTrendLine) ? layout.showTrendLine : false);

                completedOnly.setValue(Ext.isBoolean(layout.completedOnly) ? layout.completedOnly : false);

				// target line
				if (Ext.isNumber(layout.targetLineValue)) {
					targetLineValue.setValue(layout.targetLineValue);
				}
				else {
					targetLineValue.reset();
				}

				if (Ext.isString(layout.targetLineTitle)) {
					targetLineTitle.setValue(layout.targetLineTitle);
				}
				else {
					targetLineTitle.reset();
				}

				// base line
				if (Ext.isNumber(layout.baseLineValue)) {
					baseLineValue.setValue(layout.baseLineValue);
				}
				else {
					baseLineValue.reset();
				}

				if (Ext.isString(layout.baseLineTitle)) {
					baseLineTitle.setValue(layout.baseLineTitle);
				}
				else {
					baseLineTitle.reset();
				}

                sortOrder.setValue(Ext.isNumber(layout.sortOrder) ? layout.sortOrder : 0);
                aggregationType.setValue(Ext.isString(layout.aggregationType) ? layout.aggregationType : 'default');

				// rangeAxisMaxValue
				if (Ext.isNumber(layout.rangeAxisMaxValue)) {
					rangeAxisMaxValue.setValue(layout.rangeAxisMaxValue);
				}
				else {
					rangeAxisMaxValue.reset();
				}

				// rangeAxisMinValue
				if (Ext.isNumber(layout.rangeAxisMinValue)) {
					rangeAxisMinValue.setValue(layout.rangeAxisMinValue);
				}
				else {
					rangeAxisMinValue.reset();
				}

				// rangeAxisSteps
				if (Ext.isNumber(layout.rangeAxisSteps)) {
					rangeAxisSteps.setValue(layout.rangeAxisSteps);
				}
				else {
					rangeAxisSteps.reset();
				}

				// rangeAxisDecimals
				if (Ext.isNumber(layout.rangeAxisDecimals)) {
					rangeAxisDecimals.setValue(layout.rangeAxisDecimals);
				}
				else {
					rangeAxisDecimals.reset();
				}

				// range axis title
				if (Ext.isString(layout.rangeAxisTitle)) {
					rangeAxisTitle.setValue(layout.rangeAxisTitle);
				}
				else {
					rangeAxisTitle.reset();
				}

				// domain axis title
				if (Ext.isString(layout.domainAxisTitle)) {
					domainAxisTitle.setValue(layout.domainAxisTitle);
				}
				else {
					domainAxisTitle.reset();
				}

				hideLegend.setValue(Ext.isBoolean(layout.hideLegend) ? layout.hideLegend : false);
				hideTitle.setValue(Ext.isBoolean(layout.hideTitle) ? layout.hideTitle : false);

				// title
				if (Ext.isString(layout.title)) {
					title.setValue(layout.title);
				}
				else {
					title.reset();
				}
			},
			items: [
				{
					bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
					style: 'margin-bottom:6px; margin-left:2px',
					html: NS.i18n.data
				},
				data,
				{
					bodyStyle: 'border:0 none; padding:5px'
				},
				{
					bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
					style: 'margin-bottom:6px; margin-left:2px',
					html: NS.i18n.events
				},
				events,
				{
					bodyStyle: 'border:0 none; padding:5px'
				},
				{
					bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
					style: 'margin-bottom:6px; margin-left:2px',
					html: NS.i18n.axes
				},
				axes,
				{
					bodyStyle: 'border:0 none; padding:5px'
				},
				{
					bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
					style: 'margin-bottom:6px; margin-left:2px',
					html: NS.i18n.general
				},
				general
			],
			bbar: [
				'->',
				{
					text: NS.i18n.hide,
					handler: function() {
						window.hide();
					}
				},
				{
					text: '<b>' + NS.i18n.update + '</b>',
					handler: function() {
                        ns.app.viewport.update();

						window.hide();
					}
				}
			],
			listeners: {
				show: function(w) {
					if (ns.app.optionsButton.rendered) {
						ns.core.web.window.setAnchorPosition(w, ns.app.optionsButton);

						if (!w.hasHideOnBlurHandler) {
							ns.core.web.window.addHideOnBlurHandler(w);
						}
					}

					// cmp
					w.showValues = showValues;
                    w.hideEmptyRows = hideEmptyRows;
					w.showTrendLine = showTrendLine;
                    w.completedOnly = completedOnly;
					w.targetLineValue = targetLineValue;
					w.targetLineTitle = targetLineTitle;
					w.baseLineValue = baseLineValue;
					w.baseLineTitle = baseLineTitle;
                    w.sortOrder = sortOrder;
                    w.aggregationType = aggregationType;
					w.rangeAxisMaxValue = rangeAxisMaxValue;
					w.rangeAxisMinValue = rangeAxisMinValue;
					w.rangeAxisSteps = rangeAxisSteps;
					w.rangeAxisDecimals = rangeAxisDecimals;
					w.rangeAxisTitle = rangeAxisTitle;
					w.domainAxisTitle = domainAxisTitle;
					w.hideLegend = hideLegend;
					w.hideTitle = hideTitle;
					w.title = title;
				}
			}
		});

		return window;
};