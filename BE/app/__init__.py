from flask import Flask
from .config import Config, db_connection
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # Load configuration from the Config class
    app.config.from_object(Config)
    # Test database connection
    db_connection()

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Import user model
    from app.models import user  

    # Route registration
    from app.routes.base_routes import base
    from app.routes.auth_routes import register_bp, login_bp
    
    app.register_blueprint(base, url_prefix="/")
    app.register_blueprint(register_bp, url_prefix="/api/v1/register")
    app.register_blueprint(login_bp, url_prefix="/api/v1/login")
    
    return app