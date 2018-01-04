var TableData = function() {
	"use strict";
	//function to initiate DataTable
	//DataTable is a highly flexible tool, based upon the foundations of progressive enhancement,
	//which will add advanced interaction controls to any HTML table
	//For more information, please visit https://datatables.net/
    // 由于 js 文件独立，因此 jinja2 模板的变量不能直接使用，需要作为参数传递进来。
	var runDataTable_trade_server = function(ajax_url, data_per_page, logtime_start, logtime_end, handled) {
        var table = $("#sample_1").DataTable({
                "orderClasses": true,   // 高亮显示表格中排序的列。
                //"pageLength": "{{ AppConfig['WEBWDT_DATA_PER_PAGE'] }}",
                "pageLength": data_per_page,
                "processing": true,     // 是否显示处理状态(排序的时候，数据很多耗费时间长的话，也会显示这个)。
                "serverSide": true,     // 是否开启服务器模式
                "searching": false,     // 关闭全局搜索
                "columns":[
                    { "data": null },
                    { "data": null },
                    //{ "data": "status" },
                    { "data": "log_time" },
                    { "data": "handle_flag" },
                    //{ "data": "page_size" },
                    //{ "data": "page_no" },
                    { "data": "total_count" },
                    { "data": "start_time" },
                    { "data": "end_time" },
                    { "data": "message" }//,
                    //{ "data": "code" }
                ],
                // 由于第 0 列是展开按钮，第 1 列是行号，排序和搜索没有意义，所以禁用第 0 列和第 1 列的搜索和排序。
                "columnDefs": [
                    {
                        "targets": 0,
                        "searchable": false,
                        "orderable": false,
                        "class": "center details-control",
                        "defaultContent": ""
                    },
                    {
                        "targets": 1,
                        "searchable": false,
                        "orderable": false,
                        "class": "center"
                    },
                    {
                        "targets": 3,   // handle_flag
                        "class": "center hidden-xs",
                        "render": function (data, type, row, meta) {
                            return "<span class='label label-sm " + (data ? "label-success" : "label-danger") + "'>" + data + "</span>";
                        }
                    },
                    {
                        "targets": 7,   // message
                        "class": "hidden-xs"
                    }
                ],
                // 定义 DataTables 的组件元素的显示和显示顺序。
                //  1. `l` 代表 length，左上角的改变每页显示条数控件
                //  2. `f` 代表 filtering，右上角的过滤搜索框控件
                //  3. `t` 代表 table，表格本身
                //  4. `i` 代表 info，左下角的表格信息显示控件
                //  5. `p` 代表 pagination，右下角的分页控件
                //  6. `r` 代表 processing，表格中间的数据加载等待提示框控件
                //  7. `B` 代表 button，Datatables可以提供的按钮控件，默认显示在左上角
                // DataTables 自定义标签：
                //  1. < > - 这个尖括号就代表 html标签里的  <div></div>
                //  2. <"className" > - 代表添加了class的div  <div class="className"></div>
                //  3. <"#id" > - 代表添加了id的div <div id="id"></div>
                //"dom": "lr<'toolbar'>tfip",
                "dom": "lrf<'#gbtn-export.col-sm-6'>tip",
                // 因为 DT 默认会设置第 1 列升序排列。由于前面已经禁用，因此改为设置默认的排序列为第 2 列。
                "order": [[2, "asc"]],
				// "lengthMenu": [ [10, 25, 50, 75, 100, -1], [10, 25, 50, 75, 100, "All"] ],
                "ajax": {
                    //url: "{{ url_for('main.trade_data') }}",
                    url: ajax_url,
                    type: "POST",
                    data: {
                        //"col_cnt": 7,   // 列数，可以考虑把排序列信息传过去：[(0, "asc"), (1, "desc")]
                        // "ajax_start_time": "{{ form.qcd_logtime_start.data }}",
                        // "ajax_end_time": "{{ form.qcd_logtime_end.data }}",
                        // "ajax_handled": "{{ form.qcd_handled.data }}"
                        "ajax_start_time": logtime_start,
                        "ajax_end_time": logtime_end,
                        "ajax_handled": handled
                    }
                },
                "language": {
                    "aria": {
                        "sortAscending":  ": 以升序排列此列",
                        "sortDescending": ": 以降序排列此列"
                    },
                    "processing": "处理中...",
                    "lengthMenu": "每页 _MENU_ 条记录",
                    "zeroRecords": "没有查询到记录",
                    //"info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                    "info": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
                    "infoEmpty": "无记录",
                    "search": "搜索：",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "loadingRecords": "正在加载数据--请等待...",
                    "emptyTable": "未有相关数据",
                    "url": "",
                    "infoThousands": ",",
                    "paginate": {
                        "first": "首页",
                        "previous": "上一页",
                        "next": "下一页",
                        "last": "尾页 "
                    }
                },
                // if your datatable is too long to load (huge table in html for example),
                // You may have to use initComplete to prevent this,
                // since the div.toolbar node may not exist yet when $('div.toolbar').html is called.
                "initComplete": function(settings, json){
                    var api = new $.fn.dataTable.Api( settings );
                    if ( api.data().length>0 || json != undefined ) {
                        // $("div.toolbar").html(
                        $("div[id='gbtn-export']").html(
                            "<div class='btn-group'>"
                                + "<a class='btn btn-azure' href='javascript:;'>"
                                    + "<!--data-placement='top' data-toggle='tooltip' data-original-title='print the data.'>-->"
                                    + "<i class='fa fa-print'></i>"
                                + "</a>"
                                + "<button type='button' class='btn btn-azure'>"
                                    + "<!--data-placement='top' data-toggle='tooltip' data-original-title='export data in a specified format.'>-->"
                                    + "Export"
                                + "</button>"
                                + "<button type='button' class='btn btn-azure dropdown-toggle' data-toggle='dropdown' aria-expanded='true'>"
                                    + "<span class='caret'></span>"
                                + "</button>"
                                + "<ul class='dropdown-menu dropdown-light pull-right' role='menu'>"
                                    + "<li>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-code-o'> .json</i>"
                                        + "</a>"
                                    + "</li>"
                                    + "<li>"
                                        // + "<a href='{{ url_for(''main.exec_plan_export_xls'')}}'>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-excel-o'> .xls</i>"
                                        + "</a>"
                                    + "</li>"
                                    + "<li>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-text-o'> .csv</i>"
                                        + "</a>"
                                    + "</li>"
                                    + "<li>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-pdf-o'> .pdf</i>"
                                        + "</a>"
                                    + "</li>"
                                + "</ul>"
                            + "</div>");
                    }
                },
                "createdRow": function(row, data, dataIndex) {  // 在 rowCallback 之前执行。
                    //var $btnBuy  =  $('<button class="buy">购买</button>');
                    //var $btnLook =  $('<button class="look">查看</button>');
                    //$("td", row).eq(6).append($btnBuy).append($btnLook);
                    //if (!$("td", row).eq(3)) {
                    if (!data.handle_flag) {
                        $(row).addClass("danger");
                    }

                    // 如果没有明细数据，不显示展开内容。
                    if (data.total_count<=0) {
                        //$("td", row).eq(0).css("background", "");
                        $("td", row).eq(0).removeClass("details-control");
                    }
                },
                //"rowCallback": function(row, data, index) {
                //    // 每行中的时间列, 全局变量
                //    createTime = new Date(aData.createTime);    //后台返回的时间戳
                //    var year  = createTime.getFullYear()+'年';
                //    var month = createTime.getMonth()+1+'月';
                //    var date  = createTime.getDate()+'日'+createTime.getHours()+'时'+createTime.getMinutes()+'分'+createTime.getSeconds()+'秒';
                //    $('td:eq(5)', nRow).html(year+month+date);  //设置该列的值
                //
                //    // 每行中的状态列  该状态进行判断 并设置相关的列值
                //    var sellstatus = aData.sellstatus;
                //    if (sellstatus==2) {    // 使用权交易
                //        var num = aData.usemoney;
                //        $('td:eq(2)', nRow).html(num);  //设置该列的值
                //    }
                //    if (sellstatus==3) {    // 所有权交易
                //        var num = aData.allmoney;
                //        $('td:eq(2)', nRow).html(num);  //设置该列的值
                //    }
                //},
                "drawCallback": function(settings){
                    var api = this.api();
                    var startIndex= api.context[0]._iDisplayStart;  // 获取到本页开始的条数
                    api.column(1).nodes().each(function(cell, i) {
                        cell.innerHTML = "<b>" + (startIndex + i + 1) + "</b>";
                    });

                    $("#sample_1_paginate").append("  到第 <input style='height:28px;line-height:28px;width:40px;' class='margin text-center' id='changePage' type='text'> 页  <a class='btn btn-default shiny' style='margin-bottom:5px' href='javascript:void(0);' id='dataTable-btn'>确认</a>");
                    var oTable = $("#sample_1").dataTable();
                    $("#dataTable-btn").click(function(e) {
                        if($("#changePage").val() && $("#changePage").val() > 0) {
                            var redirectpage = $("#changePage").val() - 1;
                        } else {
                            var redirectpage = 0;
                        }
                        oTable.fnPageChange(redirectpage);
                        //oTable.page(redirectpage).draw(false);
                    });
                }
        });
		
        function format ( d ) {
			// `d` is the original data object for the row
			var tr_html = "";
			for (var i=0; i<d.trades.length; i++) {
                var x = Flask.url_for("main.trade_invoice", {"id": d.trades[i].trade_id});
				tr_html +=
				"<tr>"+
					"<th class='center'>"+(i+1)+"</th>"+
					"<td><a href='" + x + "' target='_blank'>"+d.trades[i].trade_id+"</a></td>"+
					"<td>"+d.trades[i].receiver_name+"</td>"+
                    "<td class='text-right'>"+d.trades[i].goods_count+"</td>"+
                    "<td class='text-right'>"+d.trades[i].paid+"</td>"+
					"<td>"+d.trades[i].created+"</td>"+
					"<td>"+d.trades[i].modified+"</td>"+
				"</tr>"
			}
			//return "<table cellpadding='5' cellspacing='0' border='0' style='padding-left:50px;'>"+
			//return "<table class='table table-striped table-bordered table-hover' id='nested_table_1'>"+
			return "<table class='table table-condensed table-hover' id='nested_table_1'>" +
					"<thead>" +
						"<tr>" +
							"<th class='center'>#</th>" +
							"<th>Trade Id</th>" +
							"<th>Receiver Name</th>" +
							"<th class='hidden-xs'>Goods Count</th>" +
							"<th>Goods Amount</th>" +
							"<th>Created Date</th>" +
							"<th class='hidden-xs'>Modified Date</th>" +
						"</th>" +
					"</thead>" +
					"<tbody>" +
						tr_html +
					"</tbody>" +
			"</table>";
        }

        // Add event listener for opening and closing details
        $("#sample_1 tbody").on("click", "td.details-control", function () {
            var tr = $(this).closest("tr");
            var row = table.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass("shown");
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass("shown");
            }
        } );

        // $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
	};

	var runDataTable_trade_client = function(data, data_per_page) {
        var table = $("#sample_1").DataTable({
                "orderClasses": true,   // 高亮显示表格中排序的列。
                //"pageLength": "{{ AppConfig['WEBWDT_DATA_PER_PAGE'] }}",
                "pageLength": data_per_page,
                "processing": true,     // 是否显示处理状态(排序的时候，数据很多耗费时间长的话，也会显示这个)。
                "serverSide": false,     // 是否开启服务器模式
                "searching": true,
                "columns":[
                    { "data": null },
                    { "data": null },
                    //{ "data": "status" },
                    { "data": "log_time" },
                    { "data": "handle_flag" },
                    //{ "data": "page_size" },
                    //{ "data": "page_no" },
                    { "data": "total_count" },
                    { "data": "start_time" },
                    { "data": "end_time" },
                    { "data": "message" }//,
                    //{ "data": "code" }
                ],
                // 由于第 0 列是展开按钮，第 1 列是行号，排序和搜索没有意义，所以禁用第 0 列和第 1 列的搜索和排序。
                "columnDefs": [
                    {
                        "targets": 0,
                        "searchable": false,
                        "orderable": false,
                        "class": "center details-control",
                        "defaultContent": ""
                    },
                    {
                        "targets": 1,
                        "searchable": false,
                        "orderable": false,
                        "class": "center"
                    },
                    {
                        "targets": 3,   // handle_flag
                        "class": "center hidden-xs",
                        "render": function (data, type, row, meta) {
                            return "<span class='label label-sm " + (data ? "label-success" : "label-danger") + "'>" + data + "</span>";
                        }
                    },
                    {
                        "targets": 7,   // message
                        "class": "hidden-xs"
                    }
                ],
                "data": data,
                // "dom": "lr<'toolbar'>tfip",
                "dom": "lrf<'#gbtn-export.col-sm-6'>tip",
                // 因为 DT 默认会设置第 1 列升序排列。由于前面已经禁用，因此改为设置默认的排序列为第 2 列。
                "order": [[2, "asc"]],
				// "lengthMenu": [ [10, 25, 50, 75, 100, -1], [10, 25, 50, 75, 100, "All"] ],
                "language": {
                    "aria": {
                        "sortAscending":  ": 以升序排列此列",
                        "sortDescending": ": 以降序排列此列"
                    },
                    "processing": "处理中...",
                    "lengthMenu": "每页 _MENU_ 条记录",
                    "zeroRecords": "没有查询到记录",
                    //"info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                    "info": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
                    "infoEmpty": "无记录",
                    "search": "搜索：",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "loadingRecords": "正在加载数据--请等待...",
                    "emptyTable": "未有相关数据",
                    "url": "",
                    "infoThousands": ",",
                    "paginate": {
                        "first": "首页",
                        "previous": "上一页",
                        "next": "下一页",
                        "last": "尾页 "
                    }
                },
                "initComplete": function(settings, json){
                    var api = new $.fn.dataTable.Api( settings );
                    if ( api.data().length>0 || json != undefined ) {
                        // $("div.toolbar").html(
                        $("div[id='gbtn-export']").html(
                            "<div class='btn-group'>"
                                + "<a class='btn btn-azure' href='javascript:;'>"
                                    + "<!--data-placement='top' data-toggle='tooltip' data-original-title='print the data.'>-->"
                                    + "<i class='fa fa-print'></i>"
                                + "</a>"
                                + "<button type='button' class='btn btn-azure'>"
                                    + "<!--data-placement='top' data-toggle='tooltip' data-original-title='export data in a specified format.'>-->"
                                    + "Export"
                                + "</button>"
                                + "<button type='button' class='btn btn-azure dropdown-toggle' data-toggle='dropdown' aria-expanded='true'>"
                                    + "<span class='caret'></span>"
                                + "</button>"
                                + "<ul class='dropdown-menu dropdown-light pull-right' role='menu'>"
                                    + "<li>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-code-o'> .json</i>"
                                        + "</a>"
                                    + "</li>"
                                    + "<li>"
                                        // + "<a href='{{ url_for(''main.exec_plan_export_xls'')}}'>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-excel-o'> .xls</i>"
                                        + "</a>"
                                    + "</li>"
                                    + "<li>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-text-o'> .csv</i>"
                                        + "</a>"
                                    + "</li>"
                                    + "<li>"
                                        + "<a href='javascript:;'>"
                                            + "<i class='fa fa-file-pdf-o'> .pdf</i>"
                                        + "</a>"
                                    + "</li>"
                                + "</ul>"
                            + "</div>");
                    }
                },
                "createdRow": function(row, data, dataIndex) {  // 在 rowCallback 之前执行。
                    //var $btnBuy  =  $('<button class="buy">购买</button>');
                    //var $btnLook =  $('<button class="look">查看</button>');
                    //$("td", row).eq(6).append($btnBuy).append($btnLook);
                    //if (!$("td", row).eq(3)) {
                    if (!data.handle_flag) {
                        $(row).addClass("danger");
                    }

                    // 如果没有明细数据，不显示展开内容。
                    if (data.total_count<=0) {
                        //$("td", row).eq(0).css("background", "");
                        $("td", row).eq(0).removeClass("details-control");
                    }
                },
                //"rowCallback": function(row, data, index) {
                //    // 每行中的时间列, 全局变量
                //    createTime = new Date(aData.createTime);    //后台返回的时间戳
                //    var year  = createTime.getFullYear()+'年';
                //    var month = createTime.getMonth()+1+'月';
                //    var date  = createTime.getDate()+'日'+createTime.getHours()+'时'+createTime.getMinutes()+'分'+createTime.getSeconds()+'秒';
                //    $('td:eq(5)', nRow).html(year+month+date);  //设置该列的值
                //
                //    // 每行中的状态列  该状态进行判断 并设置相关的列值
                //    var sellstatus = aData.sellstatus;
                //    if (sellstatus==2) {    // 使用权交易
                //        var num = aData.usemoney;
                //        $('td:eq(2)', nRow).html(num);  //设置该列的值
                //    }
                //    if (sellstatus==3) {    // 所有权交易
                //        var num = aData.allmoney;
                //        $('td:eq(2)', nRow).html(num);  //设置该列的值
                //    }
                //},
                "drawCallback": function(settings){
                    var api = this.api();
                    var startIndex= api.context[0]._iDisplayStart;  // 获取到本页开始的条数
                    api.column(1).nodes().each(function(cell, i) {
                        cell.innerHTML = "<b>" + (startIndex + i + 1) + "</b>";
                    });

                    $("#sample_1_paginate").append("  到第 <input style='height:28px;line-height:28px;width:40px;' class='margin text-center' id='changePage' type='text'> 页  <a class='btn btn-default shiny' style='margin-bottom:5px' href='javascript:void(0);' id='dataTable-btn'>确认</a>");
                    var oTable = $("#sample_1").dataTable();
                    $("#dataTable-btn").click(function(e) {
                        if($("#changePage").val() && $("#changePage").val() > 0) {
                            var redirectpage = $("#changePage").val() - 1;
                        } else {
                            var redirectpage = 0;
                        }
                        oTable.fnPageChange(redirectpage);
                        //oTable.page(redirectpage).draw(false);
                    });
                }
        });

        function format ( d ) {
			// `d` is the original data object for the row
			var tr_html = "";
			for (var i=0; i<d.trades.length; i++) {
                var x = Flask.url_for("main.trade_invoice", {"id": d.trades[i].trade_id});
				tr_html +=
				"<tr>"+
					"<th class='center'>"+(i+1)+"</th>"+
					"<td><a href='" + x + "' target='_blank'>"+d.trades[i].trade_id+"</a></td>"+
					"<td>"+d.trades[i].receiver_name+"</td>"+
                    "<td class='text-right'>"+d.trades[i].goods_count+"</td>"+
                    "<td class='text-right'>"+d.trades[i].paid+"</td>"+
					"<td>"+d.trades[i].created+"</td>"+
					"<td>"+d.trades[i].modified+"</td>"+
				"</tr>"
			}
			//return "<table cellpadding='5' cellspacing='0' border='0' style='padding-left:50px;'>"+
			//return "<table class='table table-striped table-bordered table-hover' id='nested_table_1'>"+
			return "<table class='table table-condensed table-hover' id='nested_table_1'>" +
					"<thead>" +
						"<tr>" +
							"<th class='center'>#</th>" +
							"<th>Trade Id</th>" +
							"<th>Receiver Name</th>" +
							"<th class='hidden-xs'>Goods Count</th>" +
							"<th>Goods Amount</th>" +
							"<th>Created Date</th>" +
							"<th class='hidden-xs'>Modified Date</th>" +
						"</th>" +
					"</thead>" +
					"<tbody>" +
						tr_html +
					"</tbody>" +
			"</table>";
        }

        // Add event listener for opening and closing details
        $("#sample_1 tbody").on("click", "td.details-control", function () {
            var tr = $(this).closest("tr");
            var row = table.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass("shown");
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass("shown");
            }
        } );

        // $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    };

	return {
		//main function to initiate template pages
		// init : function(exec_mode, data, ajax_url, data_per_page, logtime_start, logtime_end, handled) {
        init : function(exec_mode, data, ajax_url, data_per_page, logtime_start, logtime_end, handled) {
		    if ( exec_mode == "1" ) {
		        runDataTable_trade_client(data, data_per_page);
            }
            else
		    if ( exec_mode == "2" ) {
			    runDataTable_trade_server(ajax_url, data_per_page, logtime_start, logtime_end, handled);
            }
		}
	};
}();