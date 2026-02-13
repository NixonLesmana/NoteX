import uuid
from app import db
from app.models.user import User
from app.models.notes import Note
from sqlalchemy import asc, desc
from datetime import datetime


def create_note(user_id, title, content, status="public", password=None, password_hint=None):
    # Get the user by ID
    user = User.query.get(user_id)
    # If the user does not exist
    if not user:
        return None, "User not found."

    # Check if the status is valid
    if status not in {"public", "private", "protected"}:
        return None, "Invalid status."
    
    # Generate a unique slug
    slug = str(uuid.uuid4())

    # Create a new note instance
    note = Note(
        user_id=user_id,
        title=title,
        slug=slug,
        content=content,
        status=status,
        password_hint=(password_hint or None)
    )

    # Password is required if the note is protected
    if status == "protected" and not password:
        return None, "Password is required for protected notes." 
    if status == "protected" and password:
        note.set_password(password)

    try:
        # Add the note to database
        db.session.add(note)
        db.session.commit()

        return note.to_json(), "Note created successfully."
    except Exception as e:
        db.session.rollback()
        return None, f"Error creating note: {str(e)}"

def get_public_note(q=None, page=1, per_page=10, sort="created_at", order="desc"):
    # Query public notes
    notes = Note.query.filter(Note.deleted_at == None, Note.status == "public")

    # Search by title or content if q is provided
    if q:
        notes = notes.filter(Note.title.ilike(f"%{q}%") | Note.content.ilike(f"%{q}%"))

    # Map sort fields
    sort_map = {
        "title": Note.title,
        "created_at": Note.created_at,
        "updated_at": Note.updated_at,
        "user": User.username
    }

    # Get the sort column from the map, default to created_at if not found
    sort_column = sort_map.get(sort, Note.created_at)

    # Apply sorting based on the order parameter
    if order == "asc":
        notes = notes.order_by(asc(sort_column))
    else:
        notes = notes.order_by(desc(sort_column))
    
    # Paginate the results
    pagination = notes.paginate(page=page, per_page=per_page, error_out=False)

    # Notes data after pagination
    notes_data = [note.to_json() for note in pagination.items]

    # Meta information for pagination
    meta = {
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages,
        "total_items": pagination.total,
        "pages": pagination.pages,
        "sort": sort,
        "order": order,
        "q": q or ""
    }

    return notes_data, meta, "Public notes retrieved successfully."

def get_user_note(user_id, q=None, page=1, per_page=10, sort="created_at", order="desc"):
    
    
    # Query public notes
    notes = Note.query.filter(Note.deleted_at == None, Note.user_id == user_id)

    # Search by title or content if q is provided
    if q:
        notes = notes.filter(Note.title.ilike(f"%{q}%") | Note.content.ilike(f"%{q}%"))

    # Map sort fields
    sort_map = {
        "title": Note.title,
        "created_at": Note.created_at,
        "updated_at": Note.updated_at,
    }

    # Get the sort column from the map, default to created_at if not found
    sort_column = sort_map.get(sort, Note.created_at)

    # Apply sorting based on the order parameter
    if order == "asc":
        notes = notes.order_by(asc(sort_column))
    else:
        notes = notes.order_by(desc(sort_column))
    
    # Paginate the results
    pagination = notes.paginate(page=page, per_page=per_page, error_out=False)

    # Notes data after pagination
    notes_data = [note.to_json() for note in pagination.items]

    # Meta information for pagination
    meta = {
        "page": pagination.page,
        "per_page": pagination.per_page,
        "total_pages": pagination.pages,
        "total_items": pagination.total,
        "pages": pagination.pages,
        "sort": sort,
        "order": order,
        "q": q or ""
    }

    return notes_data, meta, "User's notes retrieved successfully."

def get_note_by_slug(slug, password=None, user_id=None):
    note = Note.query.filter_by(slug=slug).first()
    
    # If the note does not exist
    if not note:
        return None, "Note not found.", None
    
    # If the status is public
    if note.status == "public":
        return note.to_json(include_user=True), "Note retrieved successfully.", None
    
    # If the status is private
    if note.status == "private":
        # Only the owner can access the private note
        if user_id != note.user_id:
            return None, "Unauthorized access to private note.", None
        
        return note.to_json(include_user=True), "Note retrieved successfully.", None
    
    # If the status is protected
    if note.status == "protected":
        # If the note is protected, check the password
        if not password:
            return None, "Password is required.", note.password_hint
        
        # Check if the provided password is correct
        if not note.check_password(password):
            return None, "Invalid password.", note.password_hint
        
        return note.to_json(include_user=True), "Note retrieved successfully.", None
    
    return None, "Invalid note status.", None

def update_note(user_id, note_id, data):
    # Find the note by ID
    note = Note.query.filter_by(id=note_id, deleted_at=None).first()
    # Check if the user is the owner of the note
    if note.user_id != user_id:
        return None, "Unauthorized access to update note."
    # If the note does not exist
    if not note:
        return None, "Note not found."
    
    try:
        # Update the note fields
        if "title" in data:
            note.title = data["title"]
        if "content" in data:
            note.content = data["content"]
        if "status" in data:
            status = data["status"]

            # Validate the status
            if status not in ["public", "private", "protected"]:
                return None, "Invalid status."
            
            note.status = status

            # If the status is protected
            if status == "protected":
                password = data.get("password")
                password_hint = data.get("password_hint")

                if not password or not password_hint:
                    return None, "Password and password hint are required for protected notes."
                
                note.set_password(password)
                note.password_hint = password_hint
            else:
                note.password_hash = None
                note.password_hint = None
        
        
        db.session.commit()
        return note.to_json(), "Note updated successfully."
                
    except Exception as e:
        db.session.rollback()
        return None, f"Error updating note: {str(e)}"
    
    return note.to_json(include_user=True), "Note updated successfully."

def delete_note(user_id, note_id):
    # Find the note by ID
    note = Note.query.filter_by(id=note_id, deleted_at=None).first()
    # Check if the user is the owner of the note
    if note.user_id != user_id:
        return None, "Unauthorized access to update note."
    # If the note does not exist
    if not note:
        return None, "Note not found."
    
    try:
        # Delete the note
        note.deleted_at = datetime.utcnow()
        db.session.commit()
        return True, "Note deleted successfully."
    except Exception as e:
        db.session.rollback()
        return None, f"Error deleting note: {str(e)}"
    