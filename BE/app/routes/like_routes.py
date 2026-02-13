from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.like_service import toggle_like
from app.utils.response import response_success, response_error

like_bp = Blueprint("like_bp", __name__)

@like_bp.route("/<string:note_id>", methods=["POST"])
@jwt_required()
def like_note(note_id):
    user_id = get_jwt_identity()
    
    like, message = toggle_like(user_id, note_id)

    if not like:
        return response_error(message, 404)

    return response_success(like, message, 200)