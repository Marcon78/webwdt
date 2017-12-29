#!/usr/bin/env python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mongoengine import MongoEngine


from config import config
from extensions import (
    lm, bcrypt, moment, mail, debug_toolbar, cache, jsglue
)

db = SQLAlchemy()
mongo_db = MongoEngine()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    config[config_name].init_app(app)
    db.init_app(app)
    mongo_db.init_app(app)
    lm.init_app(app)
    bcrypt.init_app(app)
    moment.init_app(app)
    mail.init_app(app)
    debug_toolbar.init_app(app)
    cache.init_app(app)
    jsglue.init_app(app)

    # 注册蓝图
    from app.main import main as blueprint_main
    app.register_blueprint(blueprint_main)

    from .auth import auth as blueprint_auth
    app.register_blueprint(blueprint_auth, url_prefix="/auth")

    return app
