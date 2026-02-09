from flask import Flask
from .config import Config, db_connection

def create_app():
    app = Flask(__name__)
    # Load configuration from the Config class
    app.config.from_object(Config)
    # Test database connection
    db_connection()
    
    return app