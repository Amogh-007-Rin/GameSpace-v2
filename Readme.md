# 🎮 GameSpace - Social Video Game Database

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stack](https://img.shields.io/badge/Stack-Django%20%7C%20React%20%7C%20SQLite-green)

**GameSpace** is a full-stack web application that combines a comprehensive video game database with a social network. It solves the fragmentation problem in gaming by allowing users to track their game library, write verified reviews, and interact with friends—all in one place.

---

## 📑 Table of Contents
- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Database Architecture](#database-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

---

## 🧐 About the Project

Gamers currently rely on Wikis for data, Reddit for discussion, and Metacritic for ratings. **GameSpace** unifies these experiences. 

It allows users to:
1.  **Track** their gaming journey (Playing, Completed, Wishlist).
2.  **Discover** new games through a social feed of friends' activities.
3.  **Discuss** games in dedicated forum threads linked to specific titles.

---

## 🚀 Key Features

* **🔐 Role-Based Authentication:** Secure JWT login/registration with custom profiles for Gamers and Admins.
* **📚 Library Management:** Users can add games to personal lists with status tracking (`Playing`, `Completed`, `Dropped`).
* **⭐ Verified Reviews:** Anti-spam review system ensuring one review per game per user.
* **🤝 Social Graph:** Follow/Unfollow system with a real-time **Activity Feed** showing what friends are playing.
* **💬 Community Forums:** Thread-based discussions nested under specific games.
* **🔎 Advanced Search:** Filter games by genre, platform, and developer.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
* **Framework:** React.js (v19)
* **Language:** TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **State Management:** TanStack Query (React Query)
* **HTTP Client:** Axios
* **Routing:** React Router DOM
* **Icons:** Lucide React
* **Animations:** Framer Motion

### **Backend (Server)**
* **Framework:** Django & Django REST Framework (DRF)
* **Authentication:** SimpleJWT (Stateless)
* **Database:** SQLite and MySQL and Postgresql (You can setup any SQL database of your favourite database providers )
* **CORS Handling:** django-cors-headers

---

## 🗄️ Database Architecture

The project uses a **Relational Database (SQLite)** designed around the concept of a "Library Entry".

* **Users** ↔ **Games**: Many-to-Many relationship (via `LibraryEntry`).
* **Users** ↔ **Users**: Self-referencing Many-to-Many relationship (via `Follows`).
* **Games** ↔ **Reviews**: One-to-Many relationship.
* **Games** ↔ **ForumThreads**: One-to-Many relationship.

> *See `backend/core/models.py` for the full model definitions.*

---

## 💻 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
* Node.js (v18+)
* Python (v3.10+)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GameSpace-v2
```

### 2. Backend Setup (Django)

# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# Run Migrations
python manage.py migrate

# (Optional) Seed the database with sample games
python manage.py seed_games

# Start Server
python manage.py runserver
```

### 3. Frontend Setup (React)
```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Development Server
npm run dev
```

The app should now be running at http://localhost:5173 (Frontend) and http://127.0.0.1:8000 (Backend).

---

## 🔑 Environment Variables

The backend uses Django's default settings. For production, create a `.env` file in the `backend` directory with:

```env
# Security
SECRET_KEY=your_django_secret_key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com

# CORS (for production)
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 📖 API Documentation

The backend includes auto-generated Swagger documentation.

Start the backend server and visit http://127.0.0.1:8000/api/schema/swagger-ui/ to test endpoints interactively.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| GET | `/api/games/` | Get list of games |
| POST | `/api/library/` | Add game to library |
| POST | `/api/reviews/` | Create a review |
| POST | `/api/users/{id}/follow/` | Follow a user |
| GET | `/api/social/feed/` | Get activity feed |
| GET/POST | `/api/games/{id}/threads/` | Forum threads for a game |

---

## 📁 Project Structure

```
GameSpace-v2/
├── backend/
│   ├── db.sqlite3
│   ├── manage.py
│   ├── core/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── management/commands/seed_games.py
│   └── game_space/
│       ├── settings.py
│       └── urls.py
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── api/client.ts
│   │   ├── context/AuthContext.tsx
│   │   ├── components/Navbar.tsx
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       ├── BrowsePage.tsx
│   │       ├── GameDetailPage.tsx
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   └── public/
├── requirements.txt
└── README.md
```

👥 Contributors
01. PARAM PATEL - Coding for fun.
01. AMOGH DATH -  Just a night coder.


📄 License
This project is licensed under the MIT License.