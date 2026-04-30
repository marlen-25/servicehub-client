# ServiceHub - Vite + React + Supabase

## Project Structure

```
servicehub-client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── App.jsx        # Main app with routing
│   ├── App.css        # Global styles
│   ├── supabase.js    # Supabase client config
│   └── main.jsx       # Entry point
├── supabase-setup.sql # Database schema
├── .env.example       # Environment variables template
└── package.json
```

## Setup Instructions

### 1. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase-setup.sql`
3. Get your project URL and anon key from Settings > API

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run

```bash
cd servicehub-client
npm install
npm run dev
```

## Features

- **User Authentication**: Sign up as customer or provider
- **Browse Services**: Filter by category (Restaurants, Houseworkers, Laundry, Car Wash)
- **Book Services**: Select date/time and confirm booking
- **Provider Dashboard**: Manage services and view bookings
- **My Bookings**: View and cancel your bookings

## Tech Stack

- Frontend: Vite + React + JavaScript + CSS
- Backend: Supabase (Auth + Database)
- UI: Bootstrap 5 + Font Awesome