import os
from flask import Blueprint, send_from_directory, current_app, abort
from werkzeug.utils import secure_filename

file_bp = Blueprint("file_bp", __name__)

@file_bp.route("/<path:filename>", methods=["GET"])
def show_file(filename):
    # Secure the filename
    save_name = secure_filename(filename)

    # Get the upload folder path
    path = current_app.config.get("UPLOAD_FOLDER", os.path.join(os.getcwd(), "uploads"))

    # Find the file in the upload folder
    file_path = os.path.join(path, save_name)

    # If the file does not exist 
    if not os.path.exists(file_path):
        abort(404, description="File not found.")
    
    return send_from_directory(path, save_name)

