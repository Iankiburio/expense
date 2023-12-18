from flask import Flask, request, jsonify
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_wtf import CSRFProtect
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, FloatField, SelectField
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
import os
from werkzeug.security import generate_password_hash
from expense_models import db, User, ExpenseCategory, Expense

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'  # Add session type
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
CORS(app)
csrf = CSRFProtect(app)

# Flask-Login setup
login_manager = LoginManager(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=1, max=80)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=120)])

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=1, max=80)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6, max=120)])

    def validate_username(self, field):
        if User.query.filter_by(username=field.data).first():
            raise ValidationError('Username is already in use.')

class ExpenseForm(FlaskForm):
    description = StringField('Description', validators=[DataRequired(), Length(min=1, max=255)])
    amount = FloatField('Amount', validators=[DataRequired(), NumberRange(min=0)])
    category_id = SelectField('Category', coerce=int, validators=[DataRequired()])

@app.route('/register', methods=['POST'])
def register():
    form = RegistrationForm()

    if form.validate_on_submit():
        existing_user = User.query.filter_by(username=form.username.data).first()

        if existing_user:
            return jsonify({'error': 'Username is already in use'}), 400

        hashed_password = generate_password_hash(form.password.data, method='sha256')

        new_user = User(
            username=form.username.data,
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'Registration successful'}), 201
    else:
        return jsonify({'error': 'Invalid registration data', 'form_errors': form.errors}), 400

# ... (Other routes)

# Require authentication for some routes
@app.before_request
def before_request():
    if request.endpoint and current_user.is_authenticated:
        if request.endpoint in ['create_expense', 'edit_delete_expense', 'expense_list']:
            # Add additional checks if needed
            pass

@app.route('/expenses', methods=['GET'])
@login_required
def expense_list():
    expenses = Expense.query.filter_by(user_id=current_user.id).all()
    return jsonify([expense.to_dict() for expense in expenses])

@app.route('/expenses', methods=['POST'])
@login_required
def create_expense():
    form = ExpenseForm()

    if form.validate_on_submit():
        data = request.json
        new_expense = Expense(
            description=data['description'],
            amount=data['amount'],
            user_id=current_user.id,
            category_id=data['category_id']
        )
        db.session.add(new_expense)
        db.session.commit()
        return jsonify({'message': 'Expense created successfully'}), 201
    else:
        return jsonify({'error': 'Invalid form data', 'form_errors': form.errors}), 400

@app.route('/expenses/<int:expense_id>', methods=['PUT', 'DELETE'])
@login_required
def edit_delete_expense(expense_id):
    expense = Expense.query.get_or_404(expense_id)

    if expense.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    if request.method == 'PUT':
        data = request.json
        expense.description = data['description']
        expense.amount = data['amount']
        expense.category_id = data['category_id']
        db.session.commit()
        return jsonify({'message': 'Expense updated successfully'})

    elif request.method == 'DELETE':
        db.session.delete(expense)
        db.session.commit()
        return jsonify({'message': 'Expense deleted successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
