# SuperView - AI-Powered Mock Interview Platform

An AI-powered mock interview platform that helps candidates practice and improve their interview skills with real-time feedback.

## Features

- **AI-Powered Interviews**: Dynamic interview questions generated based on your resume and job description
- **Adaptive Difficulty**: Questions adjust difficulty based on your performance
- **Real-time Scoring**: Instant feedback on your answers with detailed breakdown
- **Resume Analysis**: Analyzes your resume to personalize interview questions
- **Job Description Matching**: Aligns questions with the target job requirements
- **Detailed Analytics**: Performance metrics and improvement suggestions

## Tech Stack

### Frontend
- React 18 with Vite
- Axios for API calls
- Modern CSS with custom styling

### Backend
- Node.js with Express
- Anthropic/Gemini AI Integration
- RESTful API architecture

## Project Structure

```
SuperView/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Common/      # Shared components
│   │   │   ├── Input/       # Input stage components
│   │   │   ├── Interview/   # Interview interface
│   │   │   └── Results/     # Results display
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application
│   └── vite.config.js       # Vite configuration
│
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.js        # Express server
│   └── .env                 # Environment variables
│
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MongoDB (optional, for session persistence)
- API Key for AI service (Anthropic or Google Gemini)

### Installation

1. **Clone the repository**
   ```bash
   cd SuperView
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. **Backend Configuration**

   Edit `backend/.env` and configure the following:

   ```env
   # Server Settings
   NODE_ENV=development
   PORT=5000

   # AI API Key (Choose one)
   # Option 1: Google Gemini
   GEMINI_API_KEY=your-gemini-api-key
   
   # Option 2: Anthropic Claude (requires credits)
   ANTHROPIC_API_KEY=your-anthropic-api-key

   # CORS Settings
   CORS_ORIGIN=http://localhost:3000

   # Interview Settings
   MAX_QUESTIONS=8
   QUESTION_TIME_LIMIT=60
   MIN_PERFORMANCE_THRESHOLD=30
   EARLY_TERMINATION_AFTER=3
   ```

2. **Get an API Key**

   - **Google Gemini**: https://aistudio.google.com/app/apikey
   - **Anthropic Claude**: https://console.anthropic.com/

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   Backend runs at: http://localhost:5000

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs at: http://localhost:3000 (or 3001)

3. **Open your browser**
   Navigate to http://localhost:3000 and start practicing!

## API Endpoints

### Interview Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/start` | Start a new interview session |
| POST | `/api/interview/submit` | Submit an answer and get feedback |

### Results Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/results/:sessionId` | Get interview results |

## Troubleshooting

### CORS Errors

If you see CORS errors like:
```
Access to XMLHttpRequest from origin 'http://localhost:3001' blocked by CORS policy
```

**Solution:**
- Update `CORS_ORIGIN` in `backend/.env` to match your frontend URL
- Or set multiple origins: `http://localhost:3000,http://localhost:3001`

### API Key Errors

If you see:
```
API Key not found. Please pass a valid API key.
```

**Solutions:**
1. Verify your API key is correct in `backend/.env`
2. Check the API key has sufficient credits/quota
3. Ensure the backend server was restarted after changing `.env`

### AI Service Unavailable (503)

If you see:
```
AI Service temporarily unavailable
```

**Solutions:**
1. Check your API key has available credits
2. Verify internet connectivity
3. Try a different AI provider (switch from Claude to Gemini or vice versa)

### Frontend Not Loading

If the frontend shows connection errors:

1. Ensure backend is running on port 5000
2. Check `REACT_APP_API_BASE_URL` in frontend `.env`
3. Restart both frontend and backend servers

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Environment mode | `development` |
| `PORT` | No | Backend server port | `5000` |
| `GEMINI_API_KEY` | Yes* | Google Gemini API key | - |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic Claude API key | - |
| `CORS_ORIGIN` | No | Allowed CORS origin | `http://localhost:3000` |
| `MAX_QUESTIONS` | No | Max questions per interview | `8` |
| `QUESTION_TIME_LIMIT` | No | Time limit per question (seconds) | `60` |
| `MIN_PERFORMANCE_THRESHOLD` | No | Min score for continuation | `30` |
| `EARLY_TERMINATION_AFTER` | No | Questions before early termination | `3` |

*At least one AI API key is required

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
