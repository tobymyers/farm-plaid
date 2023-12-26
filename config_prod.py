

import os

class Config:
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    # Other production configurations
    CLOUD_DATABASE_URL = os.environ.get('DATABASE_URL')



# # config_prod.py

# class Config:
#     DEBUG = False
#     SQLALCHEMY_DATABASE_URI = 'postgresql://qwwyjzvsvlyzqj:d6edefaa80e6c75e2782acd4f8327ac5f7f2d714c6130b6ce6c4a19ed7e1c365@ec2-52-4-153-146.compute-1.amazonaws.com:5432/delcr43okma9ir'
#     # Other production configurations
#     CLOUD_DATABASE_URL = SQLALCHEMY_DATABASE_URI