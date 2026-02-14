# MyNotes Frontend

A modern, Notion-like note-taking application built with React, TypeScript, and Tailwind CSS. Features a refined brutalist design aesthetic with smooth animations and intuitive block-based editing.

## 🎨 Design Philosophy

**Refined Brutalism**: A bold yet elegant aesthetic combining:
- Monospace (JetBrains Mono) + Serif (Playfair Display) typography
- High-contrast black-and-white palette with orange accents
- Geometric shadows and borders
- Smooth micro-interactions
- Clean, functional layouts

## 🚀 Features

- **Authentication**: JWT-based login/register system
- **Block-Based Editor**: Notion-style content blocks (Text, Heading, Bullet, To-Do)
- **Real-Time Editing**: Inline editing with keyboard shortcuts
- **Page Management**: Create, edit, and organize pages
- **Responsive Design**: Works seamlessly on desktop and mobile
- **State Management**: Zustand for efficient state handling
- **Type Safety**: Full TypeScript implementation
- **Animations**: Framer Motion for smooth transitions

## 📁 Project Structure

```
mynotes-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Block.tsx       # Individual block component
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── ProtectedRoute.tsx
│   ├── pages/              # Page-level components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── HomePage.tsx
│   │   └── EditorPage.tsx
│   ├── services/           # API service layer
│   │   ├── authService.ts
│   │   └── blockService.ts
│   ├── stores/             # Zustand state management
│   │   ├── authStore.ts
│   │   └── blockStore.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   └── apiClient.ts    # Axios configuration
│   ├── styles/             # Global styles
│   │   └── index.css
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🛠️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling

### State & Data
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Routing

### UI & Animation
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Backend API running on `http://localhost:8080`

### Steps

1. **Clone and navigate to the project**
```bash
cd mynotes-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗️ Architecture

### State Management Pattern

The app uses **Zustand** for state management with a clear separation of concerns:

**Auth Store** (`authStore.ts`)
- Manages authentication state
- Handles login/register/logout
- Stores JWT token in localStorage

**Block Store** (`blockStore.ts`)
- Manages blocks and pages
- Handles CRUD operations
- Syncs with backend API

### API Integration

All API calls go through a centralized Axios instance (`apiClient.ts`):
- Automatic JWT token injection
- Request/response interceptors
- Error handling
- Automatic redirect on 401

### Component Hierarchy

```
App
├── LoginPage
├── RegisterPage
└── HomePage
    ├── Sidebar
    │   └── Page list
    └── EditorPage
        └── Block[]
```

## 🎯 Key Features Implementation

### Block System
Each block is an independent component that can be:
- Edited inline
- Deleted
- Moved (drag-and-drop ready)
- Type-switched (Text, Heading, Bullet, To-Do)

### Authentication Flow
1. User enters credentials
2. Frontend sends request to `/api/auth/login` or `/api/auth/register`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token attached to all subsequent requests
6. ProtectedRoute guards authenticated pages

### Real-Time Editing
- Click to edit any block
- Press Enter to save and create new block
- Press Escape to cancel
- Auto-save on blur

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  'primary': '#FF6B35',    // Orange accent
  'dark': '#0A0A0A',       // Near black
  'light': '#F5F5F5',      // Off white
  'accent': '#FFD166',     // Yellow accent
}
```

### Changing Fonts

Edit `tailwind.config.js`:
```javascript
fontFamily: {
  'mono': ['JetBrains Mono', 'monospace'],
  'serif': ['Playfair Display', 'serif'],
  'sans': ['Inter', 'sans-serif'],
}
```

## 🔐 Security Notes

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- No sensitive data in frontend code
- API URL configurable via environment variables
- CORS must be configured on backend

## 🐛 Troubleshooting

### CORS Errors
Ensure your backend has CORS configured to allow `http://localhost:3000`

### API Connection Failed
1. Check backend is running on `http://localhost:8080`
2. Verify `VITE_API_URL` in `.env`
3. Check network tab in browser DevTools

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 API Endpoints Used

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Blocks
- `GET /api/blocks/getRoots` - Get root pages
- `GET /api/blocks/content/:pageId` - Get page content
- `GET /api/blocks/getBlockById/:id` - Get single block
- `POST /api/blocks/add-block` - Create block
- `PUT /api/blocks/updateBlock/:id` - Update block
- `DELETE /api/blocks/deleteBlock/:id` - Delete block
- `PATCH /api/blocks/moveBlock/:id` - Move block

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized static files.

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Deploy to Traditional Hosting
1. Build the project
2. Upload `dist/` contents to your web server
3. Configure server to serve `index.html` for all routes (SPA fallback)

## 📄 License

Private project - All rights reserved

## 🤝 Contributing

This is a personal project. For suggestions or bug reports, please contact the maintainer.

---

Built with ❤️ using React + TypeScript + Tailwind CSS
