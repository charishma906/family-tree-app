# 🌳 FamilyRoots – Full-Stack Family Tree Application

A complete family tree application with React frontend, Node.js/Express backend, MongoDB database, and localStorage fallback.

---

## 📁 Project Structure

```
family-tree-app/
├── backend/                  # Node.js + Express API
│   ├── models/               # Mongoose models
│   ├── routes/               # API route handlers
│   ├── middleware/           # Auth, error handling
│   ├── server.js             # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page views
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Helpers & API client
│   │   └── styles/           # Global CSS
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Copy and edit the backend `.env` file:

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
```

### 3. Start Development

```bash
# Terminal 1 — Start backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Start frontend (port 3000)
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trees` | Get all family trees |
| POST | `/api/trees` | Create a new tree |
| GET | `/api/trees/:id` | Get a single tree |
| PUT | `/api/trees/:id` | Update a tree |
| DELETE | `/api/trees/:id` | Delete a tree |
| GET | `/api/members?treeId=` | Get members of a tree |
| POST | `/api/members` | Add a member |
| PUT | `/api/members/:id` | Update a member |
| DELETE | `/api/members/:id` | Delete a member |
| GET | `/api/relationships?treeId=` | Get relationships |
| POST | `/api/relationships` | Add a relationship |
| DELETE | `/api/relationships/:id` | Delete a relationship |
| GET | `/api/events?treeId=` | Get upcoming events |

---

## 💾 Storage Strategy

- **With backend running**: All data saved to MongoDB via REST API
- **Without backend / offline**: Automatic localStorage fallback
- Data syncs when connection is restored

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS Modules |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Storage fallback | localStorage |
| HTTP client | Axios |
| Dev tools | Nodemon, ESLint |

---

## 📦 Sample Data

Sample data is seeded automatically on first run. To reset:

```bash
cd backend
npm run seed
```
