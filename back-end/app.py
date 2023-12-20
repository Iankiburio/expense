from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import secrets

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    token = db.Column(db.String(255), nullable=True)

db.drop_all()
db.create_all()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all(key in data for key in ['username', 'password']):
        return jsonify({'error': 'Missing username or password'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if user:
        if user.password == data['password']:
            # Generate a secure token and store it
            user.token = secrets.token_urlsafe(16)
            db.session.commit()
            return jsonify({'message': 'Login successful', 'token': user.token})
        else:
            return jsonify({'error': 'Invalid password'}), 401
    else:
        # If the user does not exist, create a new user with a token
        new_user = User(username=data['username'], password=data['password'], token=secrets.token_urlsafe(16))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered and logged in successfully', 'token': new_user.token})

@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{'id': expense.id, 'description': expense.description, 'amount': expense.amount, 'date_added': expense.date_added, 'category': expense.category} for expense in expenses])

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    if not all(key in data for key in ['description', 'amount', 'category']):
        return jsonify({'error': 'Missing data'}), 400

    new_expense = Expense(description=data['description'], amount=data['amount'], category=data['category'], date_added=datetime.utcnow())
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({'message': 'Expense added successfully'})

@app.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    expense = Expense.query.get(expense_id)
    if expense:
        db.session.delete(expense)
        db.session.commit()
        return jsonify({'message': 'Expense deleted successfully'})
    else:
        return jsonify({'message': 'Expense not found'}), 404

@app.route('/logout', methods=['POST'])
def logout():
    # Extract user information from the request
    data = request.get_json()
    if not all(key in data for key in ['username', 'token']):
        return jsonify({'error': 'Missing username or token'}), 400

    # Find the user by username and token
    user = User.query.filter_by(username=data['username'], token=data['token']).first()

    if user:
        # Clear the user session or token (modify as needed)
        user.token = None
        db.session.commit()
        return jsonify({'message': 'Logout successful'})
    else:
        return jsonify({'error': 'User not found or invalid token'}), 404

if __name__ == '__main__':
    app.run(debug=True)
