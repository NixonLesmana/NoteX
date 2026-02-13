import uuid
from app import db, bcrypt
from datetime import datetime

class User(db.Model):
    # Define the table name
    __tablename__ = "users"

    # Fields
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    profile_img = db.Column(db.String(255))
    thumbnail_img = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship to Note model
    notes = db.relationship("Note", back_populates="users", lazy=True)

    # Relationship to Like model
    likes = db.relationship("Like", back_populates="user", lazy=True)

    # To decode password hash, use bcrypt's check_password_hash method
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    # Compare user's password with the stored hash
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_json(self, include_notes=True, include_likes=False):
        data = {
            "username": self.username,
            "email": self.email,
            "profile_img": self.profile_img,
            "thumbnail_img": self.thumbnail_img,
            "created_at": self.created_at.isoformat()
        }
        # Include notes if requested
        if include_notes:
            data["notes"] = [note.to_json(include_user=False) for note in self.notes]
        # Include likes if requested
        if include_likes:
            data["likes"] = [like.to_json(include_user=False, include_note=True) for like in self.likes]
        return data