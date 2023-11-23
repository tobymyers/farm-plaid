# config_dev.py

class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:centrate@localhost:5432/fieldviewlocal'
    print("from config_dev")
    # Other development configurations
    DATABASE_URL=SQLALCHEMY_DATABASE_URI
    LOCAL_DATABASE_URL = SQLALCHEMY_DATABASE_URI