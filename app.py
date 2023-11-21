from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from datetime import datetime

# Import your models from another file
from models import User, Field, Coordinate, db

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration for the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Define a route for the root URL
@app.route('/')
def load_page():
    return render_template('index.html')


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
    app.run(debug=True, port=8000)
