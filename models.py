from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)

class Field(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    polygon_name = db.Column(db.String(100), nullable=False)
    area = db.Column(db.Float, nullable=False)
    current_crop = db.Column(db.String(50))
    plant_date = db.Column(db.Date)
    harvest_date = db.Column(db.Date)

    # Foreign key relationship with User
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('fields', lazy=True))

class Coordinate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    # Foreign key relationship with Field
    field_id = db.Column(db.Integer, db.ForeignKey('field.id'), nullable=False)
    field = db.relationship('Field', backref=db.backref('coordinates', lazy=True))
