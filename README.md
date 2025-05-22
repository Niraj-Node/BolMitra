# 💬 BolMitra - Real-time Chat App

**BolMitra** is a modern, real-time chat application built using the MERN stack and Socket.io. It features JWT authentication, online/offline user tracking, read-receipt, Zustand for global state, Cloudinary for image upload, and a sleek UI with TailwindCSS and DaisyUI.

## 🌐 Live

🔗 [https://bolmitra-d0bd.onrender.com](https://bolmitra-d0bd.onrender.com)

---

## 🚀 Features

- ✅ JWT Authentication & Authorization
- 🔐 Protected Routes & Secure API Access
- 💬 Real-Time Messaging with Socket.io
- 👀 Online/Offline User Status
- ✅ Read Receipts for Message Tracking
- 🌍 Global State with Zustand
- 🖼️ Cloudinary for Media Uploads
- 🎨 TailwindCSS + DaisyUI for modern UI
- 💥 Error Handling on both Frontend & Backend
- 📦 Production Build Ready

---

## 🛠️ Tech Stack

- **Frontend**: React, Zustand, Vite, TailwindCSS, DaisyUI
- **Backend**: Node.js, Express, MongoDB, JWT, Socket.io
- **Others**: Cloudinary, Render, Zustand, CORS, Dotenv

---

## 🧩 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Niraj-Node/bolmitra.git
cd bolmitra
````

### 2️⃣ Create `.env` file in root

```env
# === General App Settings ===
MONGODB_URI=your_mongodb_connection
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# === Cloudinary ===
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# === Frontend ENV (Vite) ===
VITE_API_BASE_URL=/api
VITE_API_BASE_URL_DEV=http://localhost:5000/api
VITE_DEFAULT_PROFILE_PIC=
VITE_SERVER_BASE_URL=/
VITE_SERVER_BASE_URL_DEV=http://localhost:5000
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Build the App

```bash
npm run build
```

### 5️⃣ Start the Server

```bash
npm start
```

---

## 🧪 Development Scripts

```bash
npm run dev       # Run in development mode (Vite + Node)
npm run build     # Build for production
npm run start     # Start production server
```

---

## 📸 Screenshots

![SignIn](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943983/signin_vuwtn3.png)
![DarkTheme](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943905/dark-theme_sudmux.png)
![LightTheme](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943904/light-theme_wjqb8u.png)
![Dashboard](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943901/dashboard_ephbkh.png)
![Profile](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943904/profile_p4kcri.png)
![Chat](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943905/chat_js0rpn.png)
![OnlineFilter](https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943902/online-filter_yhuksm.png)

## 🎥 Demo Video

<a href="https://youtu.be/iwMt5m0hcIk" target="_blank">
  <img src="https://res.cloudinary.com/dnpe65c4v/image/upload/v1747943904/profile_p4kcri.png" alt="Demo Thumbnail" width="300"/>
</a>


---

## 🙌 Contributions

Feel free to open issues or PRs. Suggestions are welcome!