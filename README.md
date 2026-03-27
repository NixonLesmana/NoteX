# NoteX

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![Flask](https://img.shields.io/badge/Backend-Flask-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![Railway](https://img.shields.io/badge/Backend%20Hosting-Railway-purple)

A modern full-stack note sharing platform that allows users to create, manage, and explore notes online.

NoteX enables users to publish notes publicly, keep notes private, or protect them with passwords.  
The platform is built with **Next.js**, **Python (Flask)**, and **MySQL**, and deployed using **Vercel** and **Railway**.

---

## Live Demo

🔗 **Live App:** https://notex-one.vercel.app/

---

## Screenshots

### Home Page
![Home Page](screenshots/home-page.png)

### My Notes
![My Notes](screenshots/my-notes.png)

### My Favorites
![My Favorites](screenshots/my-favorites.png)

### My Profile
![My Profile](screenshots/my-profile.png)

### Upload Notes
![Upload Notes](screenshots/upload-notes.png)

---

## Features

- User authentication with JWT
- Create, edit, and delete notes
- Public and private note visibility
- Password-protected notes
- Browse public notes
- Favorite notes
- Search notes instantly using the search bar
- Rich text editor for formatting notes
- Responsive user interface
- Secure REST API

---

## Tech Stack

### Frontend
- Next.js
- React
- Zustand
- Ant Design

### Backend
- Python
- Flask
- SQLAlchemy
- JWT Authentication
- Bcrypt password hashing
- REST API

### Database
- MySQL

### Deployment
- Vercel (Frontend hosting)
- Railway (Backend API + MySQL)

---

## Architecture
```text
User Browser
   ↓
Next.js Frontend (Vercel)
   ↓ API Requests
Flask Backend (Railway)
   ↓
MySQL Database (Railway)
```

---

## Project Structure
```text
NoteX
├── BE            # Flask backend API
├── FE            # Next.js frontend
├── screenshots   # Application screenshots used in README
├── README.md
└── LICENSE
```
---

## How to Use

1. Visit the website:

https://notex-one.vercel.app/

2. Create an account or log in.

3. Start creating notes.

4. Choose to make your notes:
   - Public
   - Private
   - Password protected

5. Browse notes shared by other users.

---

## Future Improvements

- **Real-time collaboration**  
  Allow multiple users to edit the same note simultaneously using WebSockets.

- **Advanced search and filtering**  
  Implement full-text search and filters by author, popularity, or date.

- **Note version history**  
  Track and restore previous versions of notes, similar to Git-style version control.

- **Tagging and categorization system**  
  Allow users to organize notes with tags and browse notes by topic.

- **Commenting and discussion system**  
  Enable users to comment on notes and start discussions.

- **Image and file attachments**  
  Allow users to embed images or upload files within notes.

- **User following system**  
  Let users follow other authors and see their latest notes in a personalized feed.

- **Performance optimization with caching**  
  Implement caching (e.g., Redis) to improve performance for frequently accessed notes.

---

## Author

Nixon Lesmana

---

## License

MIT License
