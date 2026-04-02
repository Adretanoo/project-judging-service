# Project Judging Service - Frontend Client

This is the production-ready React client for the Automated Project Judging Service backend.

## Tech Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router DOM (v6)
- **Styling:** Tailwind CSS + PostCSS
- **API Client:** Axios
- **Icons:** Inline SVGs

## Features & Architecture

It is structured as a modern Single Page Application (SPA), following a clean SaaS dashboard layout:
- **`src/api/`**: Centralised API interface mapping correctly to the backend endpoints (`/api/projects`, `/api/scores`, etc).
- **`src/components/`**: Reusable generic UI elements (Buttons, Modal dialogs, Form Inputs, styled Tables, Notifications).
- **`src/hooks/`**: Custom hooks (e.g., `useNotification` for toast messages).
- **`src/layout/`**: Global shell wrapping all routes (Sidebar navigation + Topbar with dynamic title).
- **`src/pages/`**: The core views.
    - Dashboard: At-a-glance system metrics and a leaderboard podium preview.
    - Projects/Judges/Criteria: Data tables with add/create modals. Project Detail shows individual scores.
    - Submit Score: Full form enforcing business rules (judges, max scores based on exact criteria constraints).
    - Leaderboard: Ranked calculation display with progress bars.

## Development Setup

1. **Ensure the backend is running**  
   The backend must be running on `http://localhost:3000` because the Vite dev server maps `/api` proxy requests there to bypass CORS.

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   The application will run on `http://localhost:5173`.
