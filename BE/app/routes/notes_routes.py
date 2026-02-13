from flask import Blueprint, request
from app.services.notes_service import create_note, get_public_note, get_user_note, get_note_by_slug, update_note, delete_note
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import response_success, response_error

notes_bp = Blueprint("notes_bp", __name__)

@notes_bp.route("/", methods=["POST"])
@jwt_required()
def create_note_route():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()
    # Get the request data
    data = request.get_json()
    
    # Check if data is provided
    if not data:
        return response_error("No data provided.")
    
    # Validate password and password hint
    password = data.get("password") or None
    password_hint = data.get("password_hint") or None

    # Create the note using the service function
    note, message = create_note(user_id, data["title"], data["content"], data["status"], 
    password, password_hint)

    if not note:
        return response_error(message, 422)
    
    return response_success(note, message, 201)

@notes_bp.route("/", methods=["GET"])
def public_notes_route():
    # Get query parameters
    q = request.args.get("q", type=str)
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)
    sort = request.args.get("sort", default="created_at", type=str)
    order = request.args.get("order", default="desc", type=str)
    
    notes, meta, message = get_public_note(q, page, per_page, sort, order)

    return response_success(notes, message, 200, meta)

@notes_bp.route("/me", methods=["GET"])
@jwt_required()
def user_notes_route():
    # Get query parameters
    user_id = get_jwt_identity()
    q = request.args.get("q", type=str)
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)
    sort = request.args.get("sort", default="created_at", type=str)
    order = request.args.get("order", default="desc", type=str)
    
    notes, meta, message = get_user_note(user_id, q, page, per_page, sort, order)

    return response_success(notes, message, 200, meta)

@notes_bp.route("/<string:slug>", methods=["GET"])
@jwt_required(optional=True)
def get_note_slug(slug):
    # Password can be provided as a query parameter or in the JSON body
    password = request.args.get("password")
    if password is None and request.is_json:
        body = request.get_json()
        password = body.get("password")
    
    # Get user ID
    user_id = get_jwt_identity()

    # Call the service function to get the note by slug
    note, message, hint = get_note_by_slug(slug, password, user_id)

    # If the note is not found
    if not note:
        # If password is invalid or not given for a protected note
        if message in ("Password is required.", "Invalid password."):
            return response_error(message, 401, hint)
        return response_error(message, 404)
    
    return response_success(note, message)

@notes_bp.route("/<string:note_id>", methods=["PUT"])
@jwt_required()
def edit_note(note_id):

    data = request.get_json()
    user_id = get_jwt_identity()
    note, message = update_note(user_id, note_id, data)

    if not note:
        return response_error(message, 400)
    
    return response_success(note, message)

@notes_bp.route("/<string:note_id>", methods=["DELETE"])
@jwt_required()
def remove_note(note_id):
    user_id = get_jwt_identity()
    note, message = delete_note(user_id, note_id)

    if not note:
        return response_error(message, 404)
    
    return response_success(None, message)