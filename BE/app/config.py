import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from datetime import timedelta

load_dotenv()

def mysql_uri() -> str:
    user = os.getenv("DB_USER", "root")
    password = os.getenv("DB_PASSWORD", "")
    host = os.getenv("DB_HOST", "localhost")
    name = os.getenv("DB_NAME", "")
    port = os.getenv("DB_PORT", "8889")
    
    return (f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}")

class Config:
    SQLALCHEMY_DATABASE_URI = mysql_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET", "88")
    
    # Expire the access token after 8 hours
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

def db_connection():
    uri = Config.SQLALCHEMY_DATABASE_URI
    print(uri)
    try:
        engine = create_engine(uri)
        connection = engine.connect()
        print("Database Connected!")
        connection.close()
        return True
    except OperationalError as e:
        raise RuntimeError(f"Database connection failed: {e}")

