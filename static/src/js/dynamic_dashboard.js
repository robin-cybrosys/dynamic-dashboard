odoo.define('dynamic_odoo_dashboard.Dashboard', function (require) {
    "use strict";
    var AbstractAction = require('web.AbstractAction');
    var ajax = require('web.ajax');
    var core = require('web.core');
    var Widget = require('web.Widget');
    var rpc = require('web.rpc');
    var session = require('web.session');
    var web_client = require('web.web_client');
    var _t = core._t;
    var QWeb = core.qweb;
    var Dialog = require('web.Dialog');
    // var jsPDF = require('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    var Dialog = require('web.Dialog');
    var DynamicDashboard = AbstractAction.extend({
        template: 'dynamic_odoo_dashboard',
        events: {
            'click .add_block': '_onClick_add_block',
            'click .block_setting': '_onClick_block_setting',
            'click .block_delete': '_onClick_block_delete',
            'click #search-button': 'search_chart',
            'click #searchclear': 'clear_search',
            'click #dropdownNavbar': 'navbar_toggle',
            'click #dropdownMenuButton': 'dropdown_toggle',
            'click .chart_item_export': 'export_item',
            'click #edit_layout': '_onClick_edit_layout',
            'click #save_layout': '_onClick_save_layout',
            'change #theme-toggle': 'switch_mode',
            'click .tile': '_onClick_tile',
            // 'change .grid-stack': 'grid_change',
        },
        init: function (parent, context) {
            this.action_id = context['id'];
            this._super(parent, context);
            this.block_ids = []
            // console.log('init')
        },

        start: function () {
            var self = this;
            this.set("title", 'Dashboard');
            return this._super().then(function () {
                self.render_dashboards();
                self.gridstack_init(self);
                self.gridstack_off(self);
            });
        },
        willStart: function () {
            var self = this;
            return $.when(this._super()).then(function () {
                return self.fetch_data();
            });
        },

        fetch_data: function () {
            var self = this;
            var def1 = this._rpc({
                model: 'dashboard.block',
                method: 'get_dashboard_vals',
                args: [[], this.action_id]
            }).then(function (result) {
                self.block_ids = result;
                // console.log('fetch')
            });
            return $.when(def1);
        },

        switch_mode: function () {
            var self = this;
            if ($('#theme-toggle').is(':checked')) {
                // Checkbox is checked, apply dark theme
                $('.o_action_manager').addClass('dark-theme');
                localStorage.toggleState = true;
                var x = localStorage.getItem("toggleState");
                $(".theme_icon").removeClass('bi-moon-stars-fill');
                $(".theme_icon").addClass('bi-sun-fill');
                $(".dropdown-export").addClass('dropdown-menu-dark');

            } else {
                localStorage.toggleState = false;
                $(".theme_icon").removeClass('bi-sun-fill');
                $(".theme_icon").addClass('bi-moon-stars-fill');
                $(".dropdown-export").removeClass('dropdown-menu-dark');
                $('.o_action_manager').removeClass('dark-theme');
            }
        },

        get_colors: function (x_axis) {
            var color = []
            for (var j = 0; j < x_axis.length; j++) {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                color.push("rgb(" + r + "," + g + "," + b + ")");
            }
            return color
        },

        get_values_bar: function (block) {
            var labels = block['x_axis']
            var data = {
                labels: labels,
                datasets: [{
                    label: "",
                    data: block['y_axis'],
                    backgroundColor: this.get_colors(block['x_axis']),
                    borderColor: 'rgba(200, 200, 200, 0.75)',
                    borderWidth: 1
                }]
            };

            var options = {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                        //         xAxes: [{
                        // ticks: {
                        //     fontColor: '#616161'
                        // }
                        // }]
                    }
                },
                bar_data = [data, options]
            return bar_data;
        },

        get_values_pie: function (block) {
            var data = {
                labels: block['x_axis'],
                datasets: [{
                    label: '',
                    data: block['y_axis'],
                    backgroundColor: this.get_colors(block['x_axis']),
                    hoverOffset: 4
                }]
            };
            var options = {},
                pie_data = [data, options]
            return pie_data;
        },

        get_values_line: function (block) {
            var labels = block['x_axis']
            var data = {
                labels: labels,
                datasets: [{
                    label: '',
                    data: block['y_axis'],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            };
            var options = {},
                line_data = [data, options]
            return line_data;

        },

        get_values_doughnut: function (block) {
            var data = {
                labels: block['x_axis'],
                datasets: [{
                    label: '',
                    data: block['y_axis'],
                    backgroundColor: this.get_colors(block['x_axis']),
                    hoverOffset: 4
                }]
            };
            var options = {},
                doughnut_data = [data, options]
            return doughnut_data;

        },
        get_values_polarArea: function (block) {
            var data = {
                labels: block['x_axis'],
                datasets: [{
                    label: '',
                    data: block['y_axis'],
                    backgroundColor: this.get_colors(block['x_axis']),
                    hoverOffset: 4
                }]
            };
            var options = {},
                polarArea_data = [data, options]
            return polarArea_data;
        },

        get_values_radar: function (block) {
            var data = {
                labels: block['x_axis'],
                datasets: [{
                    label: '',
                    data: block['y_axis'],
                    fill: true,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            };
            var options = {
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    }
                },
                radar_data = [data, options]
            return radar_data;
        },

        gridstack_off: function (self) {
            var gridstack = self.$('.grid-stack').data('gridstack');
            gridstack.enableMove(false);  // Disable move functionality
            gridstack.enableResize(false);
        },
        gridstack_on: function (self) {
            var gridstack = self.$('.grid-stack').data('gridstack');
            gridstack.enableMove(true);  // Disable move functionality
            gridstack.enableResize(true);
        },
        gridstack_init: function (self) {
            self.$('.grid-stack').gridstack({
                animate: true,
                duration: 200,
                handle: '.grid-stack-item-content',
                draggable: {
                    handle: '.grid-stack-item-content',
                    scroll: true
                },
                alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            });
            self.gridstack_off(self);
        },
        gridstack_data: function (self) {
            var list = [];
            var grid_data_list = [];
            self.$('.grid-stack-item').each(function () {
                var el = $(this);
                grid_data_list.push({
                    'id': el.data('id'),
                    'x': el.data('gs-x'),
                    'y': el.data('gs-y'),
                    'width': el.data('gs-width'),
                    'height': el.data('gs-height')
                })
            });
            _.each(this.block_ids, function (block) {
                list.push(block)
            });
            // console.log(grid_data_list, "grid_data_list");
            // console.log(list, "list");
        },
        layout_fetch: function () {
            if (localStorage.getItem("grid_data") === null) {
                console.log("layout not found")
                localStorage.grid_data = '[]'
            } else {
                // FETCHING SAVED LAYOUT FROM LOCAL STORAGE MEMORY
                var storedList = JSON.parse(localStorage.getItem("grid_data"));
                // console.log(storedList)
                this.block_ids.forEach(item2 => {
                    // console.log(item2,"blockids")
                    let match = storedList.find(item1 => item1.id === item2.id);
                    // console.log(match, "test1")
                    // console.log(typeof storedList[0].id,"test2")
                    // console.log(typeof item2.id, "fail")
                    if (match) {
                        item2.x_pos = match.x;
                        item2.y_pos = match.y;
                        item2.width = match.width;
                        item2.height = match.height;
                    } else {
                    }
                });
            }
        },
        dashboard_data_render: function (self) {
            _.each(this.block_ids, function (block) {
                // console.log(block)
                if (block['type'] == 'tile') {
                    self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardTile', {widget: block}));
                } else {
                    self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardChart', {widget: block}));
                    var element = $('[data-id=' + block['id'] + ']')
                    if (!('x_axis' in block)) {
                        return false
                    }
                    var ctx = self.$('.chart_graphs').last()
                    var type = block['graph_type']
                    var chart_type = 'self.get_values_' + `${type}(block)`
                    var data = eval(chart_type)
                    var chart = new Chart(ctx, {
                        type: type,
                        data: data[0],
                        options: data[1]
                    });
                    var myChart = chart.config.data;
                    console.log(myChart);
                    var png_data = chart.toBase64Image();
                    block['png_data'] = png_data;
                    console.log(png_data, "test");
                    // console.log(chart.config,"test")
                }
            });
            // toggling dropdown for exporting, clicked item, closing all others
            // when clicked on one, also when mouse leaves parent.
            self.$(".block_export").on({
                click: function () {
                    if ($(this).next(".dropdown-export").is(':visible')) {
                        $(this).next(".dropdown-export").hide();
                    } else {
                        $('.dropdown-export').hide();
                        $(this).next(".dropdown-export").show();
                    }
                }
            });
            self.$(".grid-stack-item").on({
                mouseleave: function () {
                    $('.dropdown-export').hide();
                }
            });
        },

        render_dashboards: function () {
            var self = this;
            self.$("#save_layout").hide();
            this.layout_fetch(self);
            this.dashboard_data_render(self);
            var x = localStorage.getItem("toggleState");
            var checkbox = self.$(".toggle");
            if (x == 'true') {
                checkbox.prop('checked', true)
                $('.o_action_manager').addClass('dark-theme');
                self.$(".theme_icon").removeClass('bi-moon-stars-fill');
                self.$(".theme_icon").addClass('bi-sun-fill');
                self.$(".dropdown-export").addClass('dropdown-menu-dark');
            } else {
                $('.o_action_manager').removeClass('dark-theme');
                self.$(".theme_icon").removeClass('bi-sun-fill');
                self.$(".theme_icon").addClass('bi-moon-stars-fill');
                self.$(".dropdown-export").removeClass('dropdown-menu-dark');
            }

        },
        navbar_toggle: function () {
            $('.navbar-collapse').toggle();
        },
        export_item: function (e) {
            var type = $(e.currentTarget).attr('data-type');
            console.log(type, "click type");
            var $target = $(e.currentTarget).closest('.export_option').siblings('.row').find('#canvas');
            var canvas = $target[0];
            var dataTitle = canvas.getAttribute("data-title");
            // var ctx = canvas.getContext("2d");
            // Create a new canvas with a white background
            var bgCanvas = document.createElement("canvas");
            bgCanvas.width = canvas.width;
            bgCanvas.height = canvas.height;
            var bgCtx = bgCanvas.getContext("2d");
            bgCtx.fillStyle = "white";
            bgCtx.fillRect(0, 0, canvas.width, canvas.height);
            // Draw the chart onto the new canvas
            bgCtx.drawImage(canvas, 0, 0);

            // Export the new canvas as an image
            var imgData = bgCanvas.toDataURL("image/png");
            if (type === 'png') {
                console.log(type, "export fn");
                $('.chart_png_export').attr({
                    href: imgData,
                    download: `${dataTitle}.png`
                    // download: "chart.png")
                });
            }
            if (type === 'pdf') {
                console.log(type, "export fn");
                var pdf = new jsPDF();
                var imgPdfData = bgCanvas.toDataURL("image/png");
                pdf.addImage(imgPdfData, 'PNG', 0, 0);
                pdf.save(`${dataTitle}.pdf`);

            }
            // pdf.addImage(imagePdfData, 'PNG', 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
//             for (let prop in $target[0]) {
//     if (typeof $target[prop] === 'function') {
//         console.log(prop, 'is a function');
//     }
// }
            //         var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Line(lineChartData,options);
            // var url=document.getElementById("canvas").toDataURL();
            // document.getElementById("url").innerHTML=url;

            // var content = $target.html();
            // var pdf = new report.PDF();
            // pdf.addHTMLContent(content);
            // pdf.download("export.pdf");
            //         var self = this;
            //         var type = $(e.currentTarget).attr('data-type');
            //         console.log(type, "click type");
            //       var chartCanvas = $(e.currentTarget).parentsUntil('.card-body').find('.chart_canvas');
            // console.log(chartCanvas.html());
            // if ($(this).next(".dropdown-export").is(':visible')) {
            //     $(this).next(".dropdown-export").hide();
            // } else {
            //     $('.dropdown-export').hide();
            //     $(this).next(".dropdown-export").show();
            // }


            // ajax.jsonRpc('/create/tile', 'call', {
            //     'type': type,
            //     'action_id': self.action_id
            // }).then(function (result) {
            //     // console.log(typeof result['id'])
            //     if (result['type'] == 'tile') {
            //         objects.push({
            //             'id': result['id'],
            //             'x': 0,
            //             'y': 0,
            //             'width': 2,
            //             'height': 2
            //         })
            //         console.log(objects, "final")
            //         localStorage.grid_data = JSON.stringify(objects);
            //         result['width'] = 2,
            //             result['height'] = 2,
            //             self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardTile', {widget: result}));
            //     }
            // });

        },
        dropdown_toggle: function () {
            $('.dropdown-addblock').toggle();
        },
        on_reverse_breadcrumb: function () {
            var self = this;
            $('.o_dynamic_dashboard').empty();
            this.render_dashboards();

            // web_client.do_push_state({});
            // location.reload();
        },

        search_chart: function (e) {
            e.stopPropagation()
            var self = this;
            var search_input = self.$("#search-input-chart").val();
            this.myDiv = self.$('.o_dynamic_dashboard');
            self.$('.o_dynamic_dashboard').empty();
            ajax.jsonRpc("/custom_dashboard/search_input_chart", 'call', {
                'search_input': search_input
            })
                .then(function (res) {
                    _.each(self.block_ids, function (block) {
                        if (res.includes(block['id'])) {
                            if (block['type'] == 'tile') {
                                self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardTile', {widget: block}));
                            } else {
                                self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardChart', {widget: block}));
                                var element = $('[data-id=' + block['id'] + ']')
                                if (!('x_axis' in block)) {
                                    return false
                                }
                                var ctx = self.$('.chart_graphs').last()
                                var type = block['graph_type']
                                var chart_type = 'self.get_values_' + `${type}(block)`
                                var data = eval(chart_type)
                                var chart = new Chart(ctx, {
                                    type: type,
                                    data: data[0],
                                    options: data[1]
                                });
                            }
                        }
                    });
                    self.gridstack_init(self);
                    self.gridstack_off(self);
                });
        },
        clear_search: function () {
            var self = this;
            self.$("#search-input-chart").val("");
            // self.$('.o_dynamic_dashboard').empty();
            // self.render_dashboards();
            location.reload();

        },
        _onClick_block_setting: function (event) {
            event.stopPropagation();
            var self = this;
            var id = $(event.currentTarget).closest('.block').attr('data-id');
            console.log(self.block_ids, "1")
            var options = {
                on_reverse_breadcrumb: self.on_reverse_breadcrumb,
            };

            this.do_action({
                type: 'ir.actions.act_window',
                res_model: 'dashboard.block',
                view_mode: 'form',
                res_id: parseInt(id),
                views: [[false, 'form']],
                context: {'form_view_initial_mode': 'edit'},
            }, options)
        },
        _onClick_block_delete: function (event) {
            event.stopPropagation();
            var self = this;
            var id = $(event.currentTarget).closest('.block').attr('data-id');
            console.log(self.block_ids, "2")
            var options = {
                on_reverse_breadcrumb: self.on_reverse_breadcrumb,
            };
            bootbox.confirm({
                message: "Are you sure you want to delete this item?",
                title: "Delete confirmation",
                buttons: {
                    cancel: {
                        label: 'NO, GO BACK',
                        className: 'btn-primary'
                    },
                    confirm: {
                        label: 'YES, I\'M SURE',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        rpc.query({
                            model: 'dashboard.block',
                            method: 'unlink',
                            args: [parseInt(id)], // ID of the record to unlink
                        }).then(function (result) {
                            location.reload()
                            // self.clear_search();
                        }).catch(function (error) {
                            console.log('Error unlinking record: ', error);
                        });
                    } else {
                        // do nothing
                    }
                }
            });
        },
        grid_change: function (event, items) {
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let element = item.el;
                let data = $('.grid-stack').data('gridstack')
                // .data('gridstack').getData(element);
                // console.log(data);
            }
        },

        _onClick_add_block: function (e) {
            var self = this;
            var type = $(e.currentTarget).attr('data-type');
            // FETCHING SAVED LAYOUT FROM LOCAL STORAGE MEMORY
            var objects = JSON.parse(localStorage.getItem("grid_data"));
            // console.log(objects, "initial")

            ajax.jsonRpc('/create/tile', 'call', {
                'type': type,
                'action_id': self.action_id
            }).then(function (result) {
                // console.log(typeof result['id'])
                if (result['type'] == 'tile') {
                    objects.push({
                        'id': result['id'],
                        'x': 0,
                        'y': 0,
                        'width': 2,
                        'height': 2
                    })
                    // console.log(objects, "final")
                    localStorage.grid_data = JSON.stringify(objects);
                    result['width'] = 2,
                        result['height'] = 2,
                        self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardTile', {widget: result}));
                } else {
                    objects.push({
                        'id': result['id'],
                        'x': 0,
                        'y': 0,
                        'width': 5,
                        'height': 6
                    })
                    // console.log(objects, "final")
                    localStorage.grid_data = JSON.stringify(objects);
                    result['width'] = 5,
                        result['height'] = 6,
                        self.$('.o_dynamic_dashboard').append(QWeb.render('DynamicDashboardChart', {widget: result}));
                    var element = $('[data-id=' + result['id'] + ']')
                    var ctx = self.$('.chart_graphs').last()
                    var options = {
                        type: 'bar',
                        data: {
                            labels: [],
                            datasets: [
                                {
                                    data: [],
                                    borderWidth: 1
                                },
                            ]
                        },
                    }
                    var chart = new Chart(ctx, {
                        type: "bar",
                        data: options
                    });
                }
            });

            self.$('.grid-stack').gridstack({
                draggable: {
                    handle: '.grid-stack-item-content',
                    scroll: true,
                }
            });
            location.reload();
        },
        _onClick_edit_layout: function (e) {
            e.stopPropagation();
            var self = this;
            self.$("#edit_layout").hide();
            self.$("#save_layout").show();
            self.gridstack_on(self);
        },

        _onClick_save_layout: function () {
            // e.stopPropagation();
            var self = this;
            self.$("#edit_layout").show();
            self.$("#save_layout").hide();
            var grid_data_list = [];
            $('.grid-stack-item').each(function () {
                var el = $(this);
                grid_data_list.push({
                    'id': el.data('id'),
                    'x': el.data('gs-x'),
                    'y': el.data('gs-y'),
                    'width': el.data('gs-width'),
                    'height': el.data('gs-height')
                })
            });
            // console.log(grid_data_list, "grid_data_listt");
            var json_grid;
            json_grid = JSON.stringify(grid_data_list);
            localStorage.grid_data = json_grid;
            self.gridstack_off(self);
            self.clear_search();
            // location.reload();
        },

        _onClick_tile: function (e) {
            e.stopPropagation();
            var self = this;
            var id = $(e.currentTarget).attr('data-id');
            ajax.jsonRpc('/tile/details', 'call', {
                'id': id
            }).then(function (result) {
                if (result['model_name']) {
                    self.do_action({
                        name: result['model_name'],
                        type: 'ir.actions.act_window',
                        res_model: result['model'],
                        view_mode: 'tree,form',
                        views: [[false, 'list'], [false, 'form']],
                        domain: result['filter']
                    });
                } else {
                    Dialog.alert(this, "Configure the tile's model and parameters.");
                }
            });
        },
    });
    core.action_registry.add('dynamic_odoo_dashboard', DynamicDashboard);
    return DynamicDashboard;
});
