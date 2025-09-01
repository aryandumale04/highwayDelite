# Full Stack Node.js App

A simple full-stack application for creating and managing notes.  
Built with **React (Vite + TypeScript)** on the frontend and **Node.js + Express + MongoDB** on the backend.

---

## Features
- User authentication (Email OTP or Google Sign-In)
- Secure JWT-based session management
- Create and delete notes
- Error handling for invalid inputs and API failures
- Responsive UI built with Tailwind CSS

---

## Tech Stack
*Frontend:* React, Vite, Tailwind CSS, Axios, React Router  
*Backend:* Node.js, Express.js, Mongoose, JSON Web Token (JWT), dotenv, cors  
*DB:* MongoDB (Atlas or local)  
*Deployment:* Frontend (Vercel/Netlify), Backend (Render/Heroku)

---

## Prerequisites
- Node.js (LTS recommended) and npm  
- A MongoDB connection string (Atlas or local)  

---

## Project Structure

/project-root
   ├── backend/              # Node.js + Express API
   │   ├── models/
   │   ├── routes/
   │   ├── middleware/
   │   ├── utils/
   │   └── server.js
   ├── frontend/             # React + Vite + Tailwind
   │   ├── src/
   │   ├── public/
   │   └── vite.config.ts/js
   └── README.md


---

## Quick Start (Local)

Clone the :
bash
git clone https://github.com/aryandumale04/highwayDelite.git



### Backend Setup
Move into backend and install dependencies:
bash
cd backend
npm install


Create a .env file in *backend/* with:
env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
JWT_EXPIRE=<token_time>
GOOGLE_CLIENT_ID = <your_client_id>


Run the backend:
bash
node server.ts

> The API will start at http://localhost:5000

### Frontend Setup
Open a new terminal at project root, then:
bash
cd note-app
npm install

Create *frontend/.env*:
env
VITE_GOOGLE_CLIENT_ID=<your_client_id>



Start the frontend dev server:
bash
npm run dev

> Vite runs by default at http://localhost:5173

---

## Build Instructions (Production)

These are the *exact steps* to build the project for production.

### Backend (Node.js)
Install production dependencies (omit dev):
bash
cd backend
npm ci --omit=dev || npm install --production

> The backend is a Node service and does not require a compile step. Deploy this folder to your server/host with the .env set.

### Frontend (React + Vite)
Build static assets:
bash
cd note-app
npm run build

> The production-ready files are generated in note-app/dist/.  
> Serve dist/ with any static host (Vercel/Netlify/Nginx).

---

## Common Scripts

*Backend (package.json)*
- npm start – start the API (typically node server.ts)  
- npm run dev – start with hot-reload (if using nodemon)

*Frontend (package.json)*
- npm run dev – start Vite dev server  
- npm run build – production build  
- npm run preview – preview the production build locally

---

## Environment Variables Summary

*backend/.env*

PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
JWT_EXPIRE=<token_time>
GOOGLE_CLIENT_ID = <your_client_id>


*frontend/.env *

VITE_GOOGLE_CLIENT_ID=<your_client_id>


---

## Deployment Notes
- *Backend:* Deploy /backend to Render/Heroku/AWS/etc. Make sure to set the environment variables there.  
- *Frontend:* Deploy /frontend to Vercel/Netlify. Set VITE_GOOGLE_CLIENT_ID to your deployed backend URL.

---
