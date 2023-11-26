from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from datetime import datetime
import os
from flask_migrate import Migrate
from dotenv import load_dotenv
from config_dev import Config as DevConfig
from config_prod import Config as ProdConfig
#import requests

# Import your models from another file
from models import User, Field, Coordinate, db

# Load environment variables from the .env file
#load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def load_config():
    if os.environ.get('FLASK_ENV') == 'production':
        app.config.from_object('config_prod.Config')

        print("Configured for production environment.")
    else:
        app.config.from_object('config_dev.Config')
        print("Configured for development environment.")

# Call the function to load the configuration
load_config()

#database_url = os.environ.get('CLOUD_DATABASE_URL', os.environ.get('LOCAL_DATABASE_URL'))

#app.config['SQLALCHEMY_DATABASE_URI'] = database_url

#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://qwwyjzvsvlyzqj:d6edefaa80e6c75e2782acd4f8327ac5f7f2d714c6130b6ce6c4a19ed7e1c365@ec2-52-4-153-146.compute-1.amazonaws.com:5432/delcr43okma9ir'


# Initialize Flask-Migrate
migrate = Migrate(app, db)



# Define a route for the root URL
@app.route('/')
def load_page():
    return render_template('index.html')

@app.route('/api_doc.html')
def api_doc():
    return render_template('api_doc.html')

@app.route('/about')
def about():
    return render_template('about.html')



# API endpoint to get fields and coordinates by user ID
@app.route('/api/get_fields_coordinates/<int:user_id>', methods=['GET'])
def get_fields_coordinates(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User ID not found'}), 404

    fields = Field.query.filter_by(user=user).all()
    fields_data = []

    for field in fields:
        coordinates = [{'latitude': coord.latitude, 'longitude': coord.longitude} for coord in field.coordinates]
        fields_data.append({
            'fieldName': field.polygon_name,
            'area': field.area,
            'currentCrop': field.current_crop,
            'plantDate': field.plant_date.strftime('%Y-%m-%d'),
            'harvestDate': field.harvest_date.strftime('%Y-%m-%d'),
            'coordinates': coordinates,
        })

    return jsonify({'fields': fields_data}), 200






# Routes for saving field data
@app.route('/save_field', methods=['POST'])
def save_field():
    try:
        data = request.get_json()

        # Extract data from the request
        field_name = data.get('fieldName')
        email = data.get('email')
        area = float(''.join(filter(str.isdigit, data.get('area'))))
        current_crop = data.get('currentCrop')

        
        plant_date = datetime.strptime(data.get('plantDate'), '%Y-%m-%d').date()
        harvest_date = datetime.strptime(data.get('harvestDate'), '%Y-%m-%d').date()

        coordinates = data.get('coordinates', [])



        # Ensure coordinates are in the required format
        if isinstance(coordinates[0], dict):
            print("isdict")
            coordinates = [{'latitude': point['lat'], 'longitude': point['lng']} for point in coordinates]
        elif isinstance(coordinates[0], (float, int)):
            print("is not dict")
            coordinates = [{'latitude': point[0], 'longitude': point[1]} for point in coordinates]

        # Save user (if not exists)
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email)
            db.session.add(user)
            db.session.commit()

        # Save field
        field = Field(
            polygon_name=field_name,
            area=area,
            current_crop=current_crop,
            plant_date=plant_date,
            harvest_date=harvest_date,
            user=user
        )
        db.session.add(field)
        db.session.commit()

        # Save coordinates
        for coordinate in coordinates:
            lat, lon = coordinate  # Assuming coordinates is a list of tuples (latitude, longitude)
            coord = Coordinate(latitude=lat, longitude=lon, field=field)
            db.session.add(coord)
        db.session.commit()

        return jsonify({'message': 'Field data saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500






# Initialize the SQLAlchemy object with the Flask app
db.init_app(app)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=True, port=port)
