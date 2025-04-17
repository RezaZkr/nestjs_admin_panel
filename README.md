# 🛡️ Admin Panel with Vue.js & NestJS

A full-featured admin panel built with **Vue.js** on the frontend and **NestJS** on the backend.  
Includes **authentication with JWT** and **authorization with Role-Based Access Control (RBAC)**.

---

## ✨ Features

- Authentication using JWT (access & refresh tokens)
- Role-Based Access Control (RBAC)
- Modular and scalable backend with NestJS
- Frontend built with Vue 3 & Composition API
- Beautiful, responsive UI with PrimeVue
- Route guards and UI-based permission control
- Secure token handling with HttpOnly cookies

---

## 🧰 Tech Stack

### Frontend

- [Vue.js 3](https://vuejs.org/)
- Vue Router
- Pinia (with persisted state)
- Axios (with interceptors)
- PrimeVue UI Kit
- Tailwind CSS

### Backend

- [NestJS](https://nestjs.com/)
- Nest.js jwt (JWT Strategy)
- Prisma ORM
- PostgreSQL
- Swagger (OpenAPI)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd panel
npm install

# Start backend (NestJS)
cd backend
npm run start:dev

# Start frontend (Vue.js)
cd panel
npm run dev

project-root/
├── backend/
│   └── src/
│       ├── auth/
│       ├── user/
│       ├── role/
│       └── ...
├── panel/
│   └── src/
│       ├── components/
│       ├── views/
│       ├── store/
│       └── router/
│       └── ...
└── README.md
