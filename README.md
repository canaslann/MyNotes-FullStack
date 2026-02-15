# 📝 MyNotes - Notion-Like Note-Taking App

<div align="center">

![MyNotes Banner](https://img.shields.io/badge/MyNotes-Your%20Thoughts%20Our%20Mission-7d49de?style=for-the-badge)

A modern, Notion-inspired note-taking application with a refined brutalist design aesthetic. Built with React, TypeScript, Spring Boot, and Firebase.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-7d49de?style=for-the-badge)](https://frontend-production-5b37.up.railway.app/login)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment](#-deployment) • [Screenshots](#-screenshots)

</div>

---

## ✨ Features

### 🎨 **Refined Brutalism Design**
- Monospace (JetBrains Mono) + Serif (Playfair Display) typography
- High-contrast black-and-white palette with purple accents
- Geometric shadows and sharp borders
- Smooth micro-interactions

### 📄 **Block-Based Editor**
- **Slash Commands** - Type `/` to open command menu
- **Multiple Block Types** - Text, Heading, Bullet List, To-Do
- **Inline Editing** - Click to edit, Enter to save
- **Keyboard Navigation** - Arrow keys to move between blocks
- **Smart Block Types** - Backspace on empty block converts to text

### 🔐 **Authentication & Security**
- JWT-based authentication
- Secure password hashing with BCrypt
- Protected routes
- User-specific data isolation

### 🗂️ **Page Management**
- Create unlimited pages
- Hierarchical organization
- Delete pages with confirmation
- Real-time updates

### ⚡ **Performance**
- Optimistic UI updates
- Auto-save functionality
- Efficient state management with Zustand
- Fast Firebase Firestore backend

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### **Backend**
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=white)

- **Spring Boot 3.2** - Java framework
- **Spring Security** - Authentication & authorization
- **JWT (jjwt)** - Token-based auth
- **Firebase Firestore** - NoSQL database
- **Lombok** - Boilerplate reduction
- **Maven** - Dependency management

### **Deployment**
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?logo=railway&logoColor=white)

- **Railway** - Backend & Frontend hosting
- **GitHub** - Version control & CI/CD

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **Maven** 3.8+
- **Firebase** account with Firestore enabled

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/MyNotes-FullStack.git
cd MyNotes-FullStack
```

### 2️⃣ Backend Setup

```bash
cd MyNotesBackend
```

**Configure Firebase:**

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Generate a service account key (Settings → Service Accounts → Generate Key)
4. Save as `src/main/resources/firebase-service-account.json`

**Configure Application:**

Edit `src/main/resources/application.properties`:
```properties
firebase.config.path=firebase-service-account.json
server.port=8080
```

**Run Backend:**
```bash
./mvnw spring-boot:run
```

Backend runs at `http://localhost:8080`

### 3️⃣ Frontend Setup

```bash
cd mynotes-frontend
npm install
```

**Configure Environment:**

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
```

**Run Frontend:**
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 📦 Deployment

### Railway Deployment

**Backend:**
1. Create new project on [railway.app](https://railway.app)
2. Connect GitHub repository
3. Set root directory: `MyNotesBackend`
4. Add environment variables:
   ```
   PORT=8080
   FIREBASE_CONFIG=<your-firebase-json-content>
   ```
5. Deploy automatically

**Frontend:**
1. Add new service to same project
2. Set root directory: `mynotes-frontend`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```
4. Deploy automatically

**Note:** Make sure to update CORS settings in backend to allow your frontend domain.

---

## 📸 Screenshots

### Login Page
![Login](https://via.placeholder.com/800x400/0A0A0A/7d49de?text=Login+Page)

### Editor View
![Editor](https://via.placeholder.com/800x400/F5F5F5/7d49de?text=Block+Editor)

### Slash Commands
![Commands](https://via.placeholder.com/800x400/F5F5F5/7d49de?text=Slash+Commands)

---

## 🎯 Key Features Showcase

### Slash Commands
```
Type "/" to open command menu
↑↓ to navigate
Enter to select
```

### Keyboard Shortcuts
- **Enter** - Create new block (same type)
- **Backspace** (on empty block) - Convert to text or delete
- **↑↓** - Navigate between blocks
- **Shift+Enter** - New line in same block
- **/** - Open command menu
- **Esc** - Close command menu

### Block Types
- 📄 **Text** - Plain paragraph
- 📑 **Heading** - Large section header
- • **Bullet** - List item
- ☐ **Todo** - Checkbox task

---

## 🗂️ Project Structure

```
MyNotes-FullStack/
├── MyNotesBackend/              # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/mynotes/
│   │       ├── config/          # Security, Firebase, CORS
│   │       ├── controller/      # REST endpoints
│   │       ├── dto/             # Data transfer objects
│   │       ├── enums/           # Block types
│   │       ├── exception/       # Error handling
│   │       ├── mapper/          # Entity ↔ DTO conversion
│   │       ├── model/           # Domain models
│   │       ├── repository/      # Firestore data access
│   │       ├── security/        # JWT authentication
│   │       ├── service/         # Business logic
│   │       └── utils/           # Helper utilities
│   └── pom.xml
│
└── mynotes-frontend/            # React Frontend
    ├── src/
    │   ├── components/          # UI components
    │   ├── pages/               # Route pages
    │   ├── services/            # API calls
    │   ├── stores/              # Zustand state
    │   ├── types/               # TypeScript types
    │   ├── utils/               # Helpers
    │   └── styles/              # Global CSS
    └── package.json
```

---

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - BCrypt encryption
- **CORS Protection** - Configured allowed origins
- **Protected Routes** - Frontend route guards
- **User Isolation** - Each user sees only their data
- **Environment Variables** - Sensitive data externalized

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@canaslann](https://github.com/canaslann)
- LinkedIn: [Can Aslan](https://www.linkedin.com/in/can-aslan-287857297/)

---

## 🙏 Acknowledgments

- Inspired by [Notion](https://notion.so)
- Design philosophy: Refined Brutalism
- Icons by [Lucide](https://lucide.dev)
- Fonts: JetBrains Mono, Playfair Display, Inter

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕

</div>
