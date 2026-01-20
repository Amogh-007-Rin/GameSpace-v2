-- GameSpace Database Schema
-- Generated from Django migrations for SQLite

-- Create core_game table
CREATE TABLE core_game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    developer VARCHAR(255),
    publisher VARCHAR(255),
    release_date DATE,
    cover_image_url TEXT,
    genre VARCHAR(100),
    average_rating DECIMAL(4,2) DEFAULT 0.0
);

-- Create core_user table (custom user model extending Django's AbstractUser)
CREATE TABLE core_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME,
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    is_staff BOOLEAN NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    date_joined DATETIME NOT NULL,
    email VARCHAR(254) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'GAMER',
    avatar_url TEXT,
    bio TEXT
);

-- Create core_user_groups table (Many-to-Many for user groups)
CREATE TABLE core_user_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    group_id INTEGER NOT NULL REFERENCES auth_group(id) ON DELETE CASCADE,
    UNIQUE(user_id, group_id)
);

-- Create core_user_user_permissions table (Many-to-Many for user permissions)
CREATE TABLE core_user_user_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES auth_permission(id) ON DELETE CASCADE,
    UNIQUE(user_id, permission_id)
);

-- Create core_forumthread table
CREATE TABLE core_forumthread (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    user_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    game_id INTEGER NOT NULL REFERENCES core_game(id) ON DELETE CASCADE
);

-- Create core_follow table
CREATE TABLE core_follow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME NOT NULL,
    follower_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    UNIQUE(follower_id, following_id)
);

-- Create core_libraryentry table
CREATE TABLE core_libraryentry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status VARCHAR(20) NOT NULL DEFAULT 'PLAYING',
    added_at DATETIME NOT NULL,
    game_id INTEGER NOT NULL REFERENCES core_game(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    UNIQUE(user_id, game_id)
);

-- Create core_review table
CREATE TABLE core_review (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 10),
    comment TEXT,
    created_at DATETIME NOT NULL,
    game_id INTEGER NOT NULL REFERENCES core_game(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES core_user(id) ON DELETE CASCADE,
    UNIQUE(user_id, game_id)
);