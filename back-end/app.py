from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

db.drop_all()
db.create_all()

@app.route('/login', methods=['POST'])
def login():
    # Your login logic goes here
    # Example: validate credentials and return user information
    # For simplicity, just return a dummy user
    return jsonify({'username': 'dummy_user'})

@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([{'id': expense.id, 'description': expense.description, 'amount': expense.amount, 'date_added': expense.date_added} for expense in expenses])

@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    new_expense = Expense(description=data['description'], amount=data['amount'], date_added=datetime.utcnow())
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

if __name__ == '__main__':
    app.run(debug=True)
