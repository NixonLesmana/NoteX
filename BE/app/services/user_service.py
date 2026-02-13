import os, uuid
from werkzeug.utils import secure_filename
from app.models.user import User
from app import db

def is_valid_image(file):
    # Check if the file is an allowed image type
    allowed_extensions = {".jpg", ".jpeg", ".png"}

    # Get the file extension
    _, ext = os.path.splitext(file.lower())
    return ext in allowed_extensions

def random_filename(filename):
    # Get the file extension
    ext = os.path.splitext(filename)[1].lower()
    # Randomize the filename
    name = f"{uuid.uuid4()}{ext}"
    return name

def get_user_by_id(user_id):
    # Retrieve a user by their ID
    user = User.query.get(user_id)

    # Check if the user exists
    if not user:
        return None, "User not found."
    
    return user.to_json(), "User retrieved successfully."

def update_user(user_id, data, profile_img=None, thumbnail_img=None):
    # Retrieve the user by ID
    user = User.query.get(user_id)

    # Check if the user exists
    if not user:
        return None, "User not found."

    try:
        # Update password if provided
        if "password" in data and data["password"]:
            user.set_password(data["password"])

        # Update username and email if provided
        for field in ["username", "email"]:
            if field in data and data[field]:
                setattr(user, field, data[field])

        # Folder to store uploaded images
        os.makedirs("uploads", exist_ok=True)

        # Update profile image if provided
        if profile_img and is_valid_image(profile_img.filename):
            name = random_filename(profile_img.filename)
            filename = secure_filename(name)
            path = os.path.join("uploads", filename)
            profile_img.save(path)

            # Check if profile image already exists
            if user.profile_img:
                filename_old = user.profile_img.replace("/uploads/", "")
                filepath_old = os.path.join("uploads", filename_old)
                # Delete old profile image if it exists
                if os.path.exists(filepath_old):
                    os.remove(filepath_old)
            
            setattr(user, "profile_img", f"/uploads/{filename}")
        
        # Update thumbnail image if provided
        if thumbnail_img and is_valid_image(thumbnail_img.filename):
            name = random_filename(thumbnail_img.filename)
            filename = secure_filename(name)
            path = os.path.join("uploads", filename)
            thumbnail_img.save(path)

            # Check if thumbnail image already exists
            if user.thumbnail_img:
                filename_old = user.thumbnail_img.replace("/uploads/", "")
                filepath_old = os.path.join("uploads", filename_old)
                # Delete old profile image if it exists
                if os.path.exists(filepath_old):
                    os.remove(filepath_old)
            
            setattr(user, "thumbnail_img", f"/uploads/{filename}")

        db.session.add(user)
        db.session.commit()

        return user.to_json(), f"Update user {user.username} successful."

    except Exception as e:
        db.session.rollback()
        return None, f"Failed to update user: {str(e)}"