# Book Heaven — MERN Stack

A starter full-stack Book Heaven application using React + Vite, Express, MongoDB/Mongoose, JWT and bcrypt.

## Requirements
- Node.js (LTS) and npm
- MongoDB Community Server running locally OR a MongoDB Atlas connection string

## 1. Configure backend
Open a terminal:
```bash
cd book-heaven-mern/backend
npm install
```
Copy `.env.example` to `.env` and edit values. On Windows CMD:
```cmd
copy .env.example .env
```
Set `MONGO_URI`, `JWT_SECRET`, and `ADMIN_CODE` in `.env`.

Start backend:
```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 2. Configure frontend (open a second terminal)
```bash
cd book-heaven-mern/frontend
npm install
```
Copy `.env.example` to `.env`:
```cmd
copy .env.example .env
```
Start React:
```bash
npm run dev
```
Open `http://localhost:5173`.

## 3. Connect frontend and backend
- Backend starts on port 5000.
- Frontend API base URL is `VITE_API_URL=http://localhost:5000/api`.
- `frontend/src/api.js` uses Axios and automatically sends the JWT token in the Authorization header.
- CORS in `backend/server.js` allows `http://localhost:5173`.
- Both terminals must remain running while you use the app.

## 4. Create an admin
1. Register a normal account in the website.
2. Log in.
3. Open the Admin page.
4. Enter the `ADMIN_CODE` value from `backend/.env`.
5. The account becomes an admin and can add/delete books.

Keep the admin code and JWT secret private. Do not publish `.env`.

## API routes
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Logged in | Current profile |
| POST | `/api/auth/make-admin` | Logged in + admin code | Enable admin |
| GET | `/api/books` | Public | List books |
| GET | `/api/books/:id` | Public | Book details |
| POST | `/api/books` | Admin | Add book |
| PUT | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book |
| GET | `/api/favorites` | Logged in | List favorites |
| POST | `/api/favorites/:bookId` | Logged in | Add favorite |
| DELETE | `/api/favorites/:bookId` | Logged in | Remove favorite |
| GET | `/api/cart` | Logged in | View cart |
| POST | `/api/cart/:bookId` | Logged in | Add to cart |
| DELETE | `/api/cart/:bookId` | Logged in | Remove from cart |

## Troubleshooting
- `MongoDB connection failed`: start MongoDB service or verify the Atlas URI and network access.
- `Network Error`: make sure backend is running on port 5000 and frontend `.env` points to `http://localhost:5000/api`.
- CORS error: check `CLIENT_URL` in backend `.env` is `http://localhost:5173`.
- After changing a Vite `.env` file, stop and restart the frontend dev server.
