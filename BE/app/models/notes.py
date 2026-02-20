import uuid
from datetime import datetime
from app import db, bcrypt
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import func, select
from app.models.like import Like

class Note(db.Model):
    # Table name
    __tablename__ = "notes"

    # Fields
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    int_id = db.Column(db.Integer, autoincrement=True, unique=True, index=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.Enum("public", "private", "protected"), name="note_status", 
    default="public", nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)
    password_hint = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)

    # Relationship to User model
    users = db.relationship("User", back_populates="notes")

    # Relationship to Like model
    likes = db.relationship("Like", back_populates="note")

    #Encode password
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    # Compare user's password with the stored hash
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    @hybrid_property
    def like_count(self):
        return len(self.likes)

    @like_count.expression
    def like_count(cls):
        return (
            select([func.count(Like.id)]).where(Like.note_id == cls.id).label("like_count")
        )

    # Convert note object to JSON format
    def to_json(self, include_user=True, include_likes=True):
        data = {
            "id": self.id,
            "int_id": self.int_id,
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "status": self.status,
            "password_hint": self.password_hint,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "like_count": self.like_count
        }
        # Include user data
        if include_user and self.users:
            data["user"] = self.users.to_json(include_notes=False, include_likes=False)
        # Include likes data
        if include_likes:
            data["likes"] = [like.to_json(include_user=True, include_note=False) for like in self.likes]

        return data