# Sunian Photos

A full-stack photo gallery built with *FastAPI* (backend) and *React + Vite* (frontend).  
Supports Firebase authentication, Cloudinary storage, albums, likes, comments, search, and role management.

---

## ⚙ Prerequisites

- Python 3.9+
- Node.js 18+
- A Firebase project (for Auth + Firestore)
- A Cloudinary account (for image storage)

---

## 📂 Project Structure


backend/    → FastAPI app
frontend/   → React + Vite app


---

## 🚀 Backend Setup

1. *Enter backend folder*
   bash
   cd backend
   

2. *Install dependencies*
   bash
   pip install -r requirements.txt
   

3. **Create .env file** in backend/:
   env
   APP_NAME=Sunian Photos API
   GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json   # path to Firebase service account file
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   CORS_ORIGINS=http://localhost:5173
   

4. *Run server*
   bash
   uvicorn main:app --reload --port 8000
   

API will be available at *[http://localhost:8000](http://localhost:8000)*

---

## 🎨 Frontend Setup

1. *Enter frontend folder*
   bash
   cd frontend
   

2. *Install dependencies*
   bash
   npm install
   

3. **Create .env file** in frontend/:
   env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   

4. *Run dev server*
   bash
   npm run dev
   

Frontend will be available at *[http://localhost:5173](http://localhost:5173)*

---

## 🔑 Notes

- **Frontend .env** → public Firebase config + Cloudinary cloud name.
- **Backend .env** → secrets (Firebase service account, Cloudinary API key/secret).
- Roles (admin, editor, visitor) are stored in Firestore under users/{uid}.
- Admin can change roles via /api/users/{uid}/role.

---

## ✅ Features

- Firebase Auth (signup/login)
- Cloudinary upload with EXIF metadata
- Albums, tags, privacy, licenses
- Likes ❤ and comments 💬
- Drag-and-drop batch upload
- Search and filters
- Role management (admin/editor/visitor)
