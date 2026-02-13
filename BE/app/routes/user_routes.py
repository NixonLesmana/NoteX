from app.services.user_service import get_user_by_id, update_user
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import response_success, response_error

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/", methods=["GET"])

# Bearer token authentication is required to access this route
@jwt_required()
def get_user():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()  

    # Retrieve the user information using the service function
    user, message = get_user_by_id(user_id)

    # Check if the user was found
    if not user:
        return response_error(message, 404)
    
    return response_success(user, message, 200)

@user_bp.route("/", methods=["PUT"])
@jwt_required()
def edit_user():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    # Get the data from the request form and files
    data = request.form.to_dict()
    profile_img = request.files.get("profile_img")
    thumbnail_img = request.files.get("thumbnail_img")

    # Check if there is any data or images to update
    if not data and not profile_img and not thumbnail_img:
        return response_error("No data or images provided.", 400)

    # Call the service function to update the user information
    user, message = update_user(user_id, data, profile_img, thumbnail_img)

    if not user:
        return response_error(message, 400)

    return response_success(user, message, 200)
    