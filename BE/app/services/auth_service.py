from app.models.user import User
from app import db
from flask_jwt_extended import create_access_token

def register_user(input_username, input_email, input_password):
    try:
        # Check if the username or email already exists
        if User.query.filter((User.username == input_username) | (User.email == input_email)).first():
            return None, "Username or email already exists."
        
        # Create a new user 
        new_user = User(username=input_username, email=input_email)
        new_user.set_password(input_password)
        db.session.add(new_user)
        db.session.commit()

        return new_user, "User registered successfully."
        
    except Exception as e:
        db.session.rollback()
        return None, f"An error occurred: {str(e)}"

def login_user(input_username, input_password):
    # Check if the user exists
    user = User.query.filter(User.username == input_username).first()

    # If user is not found, return an error message
    if not user:
        return None, "User not found."

    # Check if the provided password matches the stored password hash
    if not user.check_password(input_password):
        return None, "Incorrect password."

    token = create_access_token(identity=str(user.id))

    user_data = {
        "username": user.username,
        "email": user.email,
        "profile_img": user.profile_img,
        "thumbnail_img": user.thumbnail_img,
        "token": token
    }

    return user_data, "Login successful."


