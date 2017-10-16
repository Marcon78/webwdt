#!/usr/bin/env python
from flask import (current_app, url_for, request, render_template, redirect, make_response, abort)
from flask_login import login_required, current_user
from flask_sqlalchemy import get_debug_queries

from . import main
from app import db
from app.models.user import Role, User
from app.models.mongo_model import ExecutionPlan


@main.after_app_request
def after_request(response):
    for query in get_debug_queries():
        if query.duration >= current_app.config["WEBWDT_DB_QUERY_TIMEOUT"]:
            current_app.logger.warning(
                "Slow query: %s\nParameters: %s\nDuration: %f\nContext: %s\n"
                % (query.statement,
                   query.parameters,
                   query.duration,
                   query.context)
            )
    return response


@main.route("/shutdown")
def server_shutdown():
    if not current_app.testing:
        abort(404)  # Not Found
    shutdown = request.environ.get("werkzeug.server.shutdown")
    if not shutdown:
        abort(500)  # Internal Server Error
    shutdown()
    return "Shutting down..."


@main.route("/")
# @login_required
def index():
    return render_template("index.html",
                           top_active=None,
                           breadcrumb=["home"])

@main.route("/execplan")
def execplan():
    page = request.args.get("page", 1, type=int)
    pagination = ExecutionPlan.objects.paginate(page=page, per_page=100)
    exec_plans = pagination.items
    return render_template("exec_plan.html",
                           breadcrumb=["home", "execplan"],
                           exec_plans=exec_plans)
