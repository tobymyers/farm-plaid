from flask import Flask, render_template, request, jsonify, flash
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import json


app = Flask(__name__)

app.static_folder = 'static'
app.config['SECRET_KEY'] = 'your_secret_key'
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class Crop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

@app.route('/')
def index():
    crops = Crop.query.all()
    return render_template('index.html', crops=crops)

@app.route('/submit', methods=['POST'])
def submit():
    try:
        # Print the raw request data for inspection
        print("Raw request data:", request.data)

        # Manually parse JSON from request data
        data = json.loads(request.data.decode('utf-8'))
        print("Received data:", data)

        new_crop = Crop(name=data['crop'])
        db.session.add(new_crop)
        db.session.commit()

        flash('Your crop has been saved successfully!', 'success')
        return jsonify({'status': 'success'})
    except Exception as e:
        db.session.rollback()
        flash('There was an error. Please try again.', 'error')
        print(f"Error: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8000)
