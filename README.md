# ElectionHub - A Full-Stack E-commerce Application

This project was created by **Solomon**.

## Overview

ElectionHub is a modern e-commerce platform built with a React frontend and a Node.js/Express backend. It features a product catalog, theme switching, and a clean, responsive user interface styled with Tailwind CSS and DaisyUI.

## Features

- View a list of products from the database.
- Dynamic theme switching (Dark and Forest modes).
- Responsive design for both desktop and mobile.
- Secure backend with rate limiting and content security policies.

## Tech Stack

**Frontend:**

- React
- Vite
- Tailwind CSS & DaisyUI
- Zustand (for state management)
- Axios

**Backend:**

- Node.js
- Express
- PostgreSQL
- Helmet (for security headers)
- Arcjet (for rate limiting)

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- A running PostgreSQL database instance

### 1. Backend Setup

```bash
# 1. Navigate to the root directory and install backend dependencies
npm install

# 2. Create a .env file from the example and add your database credentials
cp .env.example .env

# 3. Seed the database with sample products
node backend/seeds/product.js
```

### 2. Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install frontend dependencies
npm install
```

### 3. Running the Application

You will need two separate terminals to run both the backend and frontend servers.

**Terminal 1: Start the Backend Server (from the root directory)**

```bash
npm start
```

The backend server will start on `http://localhost:5001`.

**Terminal 2: Start the Frontend Dev Server (from the `frontend` directory)**

```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).
