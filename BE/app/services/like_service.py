from app import db
from app.models.like import Like
from app.models.user import User
from app.models.notes import Note

def toggle_like(user_id, note_id):
    user = User.query.get(user_id)
    if not user:
        return None, "User not found."

    note = Note.query.get(note_id)
    if not note:
        return None, "Note not found."

    # Check if the like already exists
    like = Like.query.filter(Like.user_id == user_id, Like.note_id == note_id).first()

    if like:
        try:
            db.session.delete(like)
            db.session.commit()
            return None, "Like removed successfully."
        except Exception as e:
            db.session.rollback()
            return None, f"Error removing like: {str(e)}"
    else:
        try:
            new_like = Like(user_id=user_id, note_id=note_id)
            db.session.add(new_like)
            db.session.commit()
            return True, "Like added successfully."
        except Exception as e:
            db.session.rollback()
            return None, f"Error adding like: {str(e)}"