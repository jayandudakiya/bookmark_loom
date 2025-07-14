# LinkLoom 🔖

MarkNest is a full-featured bookmarking web app that allows users to save, organize, and manage their favorite websites. Each user has their own account and can maintain a private collection of bookmarks with titles, URLs, and descriptions.

---

## ✨ Features

- ✅ User authentication (Sign Up & Login)
- ✅ Secure, user-based bookmark management
- ✅ Add new bookmarks with name, URL, and description
- ✅ Edit or delete existing bookmarks
- ✅ View a personalized list of all saved bookmarks
- ✅ Clean, responsive UI (mobile-friendly)

---

## 🛠️ Tech Stack

> You can swap or update the stack below to fit your choice.

- **Frontend:** HTML, CSS, JavaScript _(or React / Vue)_
- **Backend:** Node.js + Express
- **Authentication:** JWT / Sessions
- **Database:** MongoDB / PostgreSQL / SQLite
- **Password Storage:** Bcrypt or Argon2

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marknest.git
   cd marknest
   ```

# 🔐 Authentication Flo
- Users sign up with email & password
- Passwords hashed before storing (using bcrypt)
- JWT issued for session management
Auth middleware protects bookmark r

---
# 🔄 API Endpoints (Example)

## Auth
- `POST /api/auth/signup` — Register new user

- `POST /api/auth/login` — Login user

## Bookmarks (Protected)
- `GET /api/bookmarks` — List all bookmarks (user-specific)

- `POST /api/bookmarks` — Add new bookmark

- `PUT /api/bookmarks/:id` — Edit bookmark

- `DELETE /api/bookmarks/:id` — Delete bookmark


# 🧪 Usage

1. Create an account or log in
2. Use the dashboard to manage your bookmarks
3. Your bookmarks are private and tied to your account
