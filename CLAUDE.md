# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React + TypeScript + Vite)
```bash
cd frontend
npm install
npm run dev      # Start development server on http://localhost:5173
npm run build    # Build for production (runs tsc -b && vite build)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend (Fastify + TypeScript)
```bash
cd backend
npm install
npm run dev      # Start development server with auto-restart
npm run build    # Compile TypeScript to JavaScript
npm run start    # Start production server
npm run test     # Run Jest tests
npm run lint     # Run ESLint
npm run lint:fix # Run ESLint with auto-fix
```

### Environment Setup
- Copy `backend/env.example` to `backend/.env` and configure API keys
- Frontend runs on port 5173, backend on port 3001
- CORS is configured to allow frontend-backend communication

## Architecture

### Frontend Structure
- **Layout**: Single-page app with header, main nav, side nav, and content area
- **Navigation**: Top nav for main sections (Portfolio, Trading, Stocks, DeFi, Banking, Backend Services)
- **Sub-navigation**: Left sidebar for contextual subpages within each section
- **Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS, React Router
- **Styling**: All-black/deep space theme with orange (#ff9100) accents

### Backend Structure
- **Framework**: Fastify with TypeScript
- **API Structure**: RESTful endpoints under `/api/` prefix
- **Routes**: Modular route handlers in `src/routes/` (stocks, defi, portfolio)
- **Services**: External API integrations in `src/services/`
- **Configuration**: Environment-based config with Zod validation
- **Error Handling**: Centralized error responses with proper HTTP status codes

### Key Files
- `frontend/src/App.tsx` - Main layout and navigation logic
- `backend/src/index.ts` - Server setup and route registration
- `backend/src/config/env.ts` - Environment configuration with validation
- `backend/src/routes/` - API route handlers
- `backend/src/services/externalApis.ts` - Third-party API integrations

### Development Workflow
1. Both frontend and backend have separate package.json files
2. Run both servers concurrently for full-stack development
3. Backend serves API endpoints, frontend consumes them
4. Use TypeScript strict mode throughout the project
5. ESLint configured for both frontend and backend

### Testing
- Backend uses Jest for testing
- Frontend has ESLint configured for React hooks and refresh
- Run `npm run test` in backend directory for backend tests
- Run `npm run lint` in respective directories for linting

### External API Integration
The backend is configured to integrate with:
- Alpha Vantage (stock data)
- Yahoo Finance (financial data)
- CoinGecko (cryptocurrency data)

API keys should be configured in the backend `.env` file.