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
