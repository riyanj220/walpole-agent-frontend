# Walpole Tutor - Frontend

> **The interactive user interface for Walpole Tutor.**
>
> A modern, responsive web application built with **React** and **Vite** that serves as the student-facing portal for the AI study companion. It features a real-time chat interface, LaTeX math rendering, and seamless authentication via Supabase.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## ✨ Features

* **⚡ Blazing Fast:** Powered by Vite for instant server start and hot module replacement (HMR).
* **💬 Chat Interface:** Real-time streaming responses with typing animations and auto-scrolling.
* **🧮 Math Rendering:** Full LaTeX support for rendering complex statistical formulas using `KaTeX`.
* **🔐 Authentication:** Secure Google login integration via Supabase.
* **📱 Responsive:** Mobile-first design using Tailwind CSS.
* **🧠 Context Aware:** Manages chat history and session state for continuous learning flows.

---

## 🛠 Tech Stack

* **Core:** `React`, `Vite`
* **Styling:** `Tailwind CSS`, `Lucide React` (Icons)
* **State Management:** `React Context API` (Auth)
* **Data Fetching:** `Axios`
* **Markdown/Math:** `react-markdown`, `remark-math`, `rehype-katex`

---

##  Getting Started

Follow these steps to set up the frontend on your local machine.

### 1. Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* `npm` or `yarn`

### 2. Clone the Repository

```bash
git clone [https://github.com/riyanj220/walpole-agent-frontend.git](https://github.com/riyanj220/walpole-agent-frontend.git)
cd walpole-agent-frontend
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Environment Configuration
Create a .env file in the root directory. You will need to configure your backend API connection and Supabase credentials.

``` .env

# API Connection (Point to your Django Backend)
VITE_API_BASE_URL=http://localhost:8000

# Supabase Configuration
VITE_SUPABASE_URL=[https://your-project-ref.supabase.co](https://your-project-ref.supabase.co)
VITE_SUPABASE_ANON_KEY=your-anon-key-here...
[!NOTE] For production, change VITE_API_BASE_URL to your live domain (e.g., https://api.walpoletutor.me).
```

🏃‍♂️ Running Locally
Start the development server with Hot Module Replacement.

```bash
npm run dev
Open your browser and navigate to http://localhost:5173.
```

📦 Building for Production
To create an optimized production build:

```bash

npm run build
```

This will generate a dist folder containing the compiled assets, ready to be deployed to Vercel, Netlify, or DigitalOcean App Platform.

To preview the production build locally:

``` bash

npm run preview
```

📂 Project Structure

src/
- ├── api/             # Axios client & Supabase setup
- ├── components/      # Reusable UI components (ChatInput, Sidebar, Modal)
- ├── context/         # Global state (AuthContext)
- ├── pages/           # Main application views (Home, Auth)
- ├── App.jsx          # Main Router setup
- └── main.jsx         # Entry point
