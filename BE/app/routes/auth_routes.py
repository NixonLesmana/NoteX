from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user

register_bp = Blueprint("register_bp", __name__)
login_bp = Blueprint("login_bp", __name__)

@register_bp.route("/", methods=["POST"])
def register():
    # Extract data from the request
    data = request.json

    # Validate required fields (username, email, password)
    required_fields = ["username", "email", "password"]
    if not all(fields in data and data[fields] for fields in required_fields):
        return jsonify({"message": "Missing required fields: username, email, and password."}), 422

    # Call the service function to register the user
    user, message = register_user(
        input_username=data["username"],
        input_email=data["email"],
        input_password=data["password"]
    )

    # Check if the user was created successfully
    if not user:
        return jsonify({"message": message}), 400
    
    user_data = {
        "username": user.username,
        "email": user.email,
    }

    return jsonify({"data": user_data, "message": "Register successful"}), 201

@login_bp.route("/", methods=["POST"])
def login():
    # Extract data from the request
    data = request.json

    # Validate required fields (username, password)
    required_fields = ["username", "password"]
    if not all(fields in data and data[fields] for fields in required_fields):
        return jsonify({"message": "Missing required fields: username and password."}), 422

    # Call the service function to login the user
    user_data, message = login_user(data["username"], data["password"])

    # Check if the login was successful
    if not user_data:
        return jsonify({"message": message}), 401
    
    return jsonify({"data": user_data, "message": "Login successful"}), 200