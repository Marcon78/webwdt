#!/usr/bin/env python
# -*- coding:utf-8 -*-
# from datetime import datetime
# from flask import request, jsonify
# from . import main
# from app.models.mongo_model import Trade
#
# @main.route("/trade/data", methods=["GET", "POST"])
# # def trade_data(start_time, end_time, handled):
# def trade_data():
#     # 定义列名
#     CONST_COLS = ["#", "status", "log_time", "handle_flag", "page_size", "page_no", "total_count",
#                   "start_time", "end_time", "message", "code"]
#
#     # 自定义参数
#     start_time = request.form.get("ajax_start_time")
#     end_time = request.form.get("ajax_end_time")
#     handled = request.form.get("ajax_handled")
#
#     # Build query parameters.
#     params = {
#         "log_time__gte": datetime.strptime(start_time, "%m/%d/%Y").strftime("%Y-%m-%d 00:00:00"),
#         "log_time__lte": datetime.strptime(end_time, "%m/%d/%Y").strftime("%Y-%m-%d 23:59:59"),
#     }
#
#     if handled == "2":
#         params["handle_flag"] = 1
#     elif handled == "3":
#         params["handle_flag"] = 0
#     elif params.get("handle_flag"):
#         del params["handle_flag"]
#
#     ####
#     # DataTables 发送到服务器的参数
#     #
#     # 绘制计数器。这个是用来确保Ajax从服务器返回的是对应的（Ajax是异步的，因此返回的顺序是不确定的）。 要求在服务器接收到此参数后再返回。
#     front_dt_draw = request.form.get("draw")
#     # 分页的第一条数据的起始位置，0代表第一条数据。
#     front_dt_start = request.form.get("start")
#     # 告诉服务器每页显示的条数，这个数字会等于返回的 data集合的记录数，可能会大于因为服务器可能没有那么多数据。这个也可能是-1，代表需要返回全部数据。
#     front_dt_length = request.form.get("length")
#     # 全局的搜索条件，条件会应用到每一列（searchable需要设置为true）。
#     front_dt_search_val = request.form.get("search[value]")
#     # 如果为 true代表全局搜索的值是作为正则表达式处理，为 false则不是。 注意：通常在服务器模式下对于大数据不执行这样的正则表达式，但这都是自己决定的。
#     front_dt_search_regx = request.form.get("search[regex]")
#     # front_dt_column_cnt = request.form.get("col_cnt") # 自定义参数
#     # order[i][column]
#     # order[i][dir]
#
#     ####
#     # 服务器需要返回的数据
#     #
#     filter_params = ""
#     order_params = []
#     for x in range(len(CONST_COLS)):
#         ord_idx = request.form.get("order["+str(x)+"][column]")
#         ord_dir = request.form.get("order["+str(x)+"][dir]")
#         if ord_idx and ord_dir:
#             order_params.append(("-" if ord_dir.lower() == "asc" else "") + CONST_COLS[int(ord_idx)])
#
#     #t = Trade.objects(**({'log_time__gte': '2017-06-01 00:00:00', 'log_time__lte': '2017-06-25 23:59:59', 'handle_flag': 1})).order_by("-log_time","handle_flag").limit(50)
#     queryset = Trade.objects(**params).filter(result__trades__1__exists=True).order_by(*order_params)
#     # sql_txt = """SELECT '', *
#     #              FROM tbl_purchaseinfo """\
#     #           + ("""ORDER BY """ + order_params if order_params else """""")\
#     #           + """ LIMIT(""" + front_dt_length + """)
#     #                OFFSET """ + front_dt_start + """;"""
#     # res = db.session.execute(sql_txt).fetchall()
#     back_dt = {
#         # 必要！Datatables发送的draw是多少，则服务器返回多少。
#         # 注意！！！出于安全的考虑，强烈要求把这个转换为整形，即数字后再返回，而不是纯粹的接受然后返回，目的是防止跨站脚本（XSS）攻击。
#         "draw": int(front_dt_draw),
#         # 必要！即没有过滤的记录数（数据库里总共记录数）。
#         "recordsTotal": queryset.count()
#     }
#     # 必要！过滤后的记录数（如果有接收到前台的过滤条件，则返回的是过滤后的记录数）。
#     back_dt["recordsFiltered"] = back_dt["recordsTotal"]
#     # 必要！表中中需要显示的数据。这是一个对象数组，也可以只是数组。
#     # 区别在于：纯数组前台无需用 columns 绑定数据，会自动按照顺序去显示；对象数组则需要用 columns 绑定数据才能正常显示。
#     back_dt_data = []
#     res = queryset.paginate(page=front_dt_start//10+1, per_page=10)
#     for r in res:
#         back_dt_data.append(list(r))
#     back_dt["data"] = back_dt_data
#     # 可选。你可以定义一个错误来描述服务器出了问题后的友好提示。
#     # back_dt["error"] = ""
#     # 自动绑定Id到tr节点上。string。
#     # DT_RowId
#     # 自动把这个类名添加到 tr。string。
#     # DT_RowClass
#     # 使用 jQuery.data() 方法把数据绑定到row中，方便之后用来检索（比如加入一个点击事件）。object。
#     # DT_RowData
#     # 自动绑定数据到 tr上，使用 jQuery.attr() 方法，对象的键用作属性，值用作属性的值。注意这个 需要 Datatables 1.10.5+的版本才支持。object。
#     # DT_RowAttr
#
#     # jsonify的作用实际上就是将传入的json形式数据序列化成为json字符串，作为响应的body，并且设置响应的Content-Type为application/json，构造出响应返回至客户端。
#     # 直接返回json.dumps的结果是可行的，因为flask会判断并使用make_response方法自动构造出响应，只不过响应头各个字段是默认的。
#     # 若要自定义响应字段，则可以使用make_response或Response自行构造响应。
#     return jsonify(back_dt)