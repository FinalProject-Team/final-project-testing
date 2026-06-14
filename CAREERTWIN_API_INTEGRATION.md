# Career Twin API Integration Summary

## Overview
Career Twin is fully integrated with the backend API through a centralized service layer using the unified API configuration.

## Architecture

### 1. **Centralized API Config** (`src/config/apiConfig.js`)
- Single source of truth for all API base URLs
- Handles both standard tokens and Supabase auth tokens
- Supports environment variable override via `VITE_API_BASE_URL`

### 2. **Career Twin Service** (`src/services/careerTwin/careerTwinService.js`)
- **New service layer** that wraps all Career Twin API calls
- Uses centralized `API_BASE_URL` and `getAuthHeaders()` from apiConfig
- Provides the following methods:

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `getStudentProfile()` | `/api/auth/me` | Fetch current user profile |
| `getStudentProgress()` | `/api/progress/my-progress` | Fetch enrollment and course progress |
| `getStudentStats()` | `/api/progress/dashboard-stats` | Fetch dashboard statistics |
| `getStudentRoadmap()` | `/api/roadmap` | Fetch learning roadmap |
| `getCourseLessons(courseId)` | `/api/lessons/course/{courseId}` | Fetch lessons for skill extraction |
| `getStudentEngagement()` | `/api/progress/progress-dashboard` | Fetch XP and learning metrics |
| `getStudentRanking()` | `/api/ranking/me` | Fetch student's leaderboard rank |
| `getCompleteStudentData()` | Multiple endpoints | Aggregate all data with error handling |

### 3. **Career Twin Hook** (`src/hooks/useCareerTwin.js`)
**Updated to use the new service layer:**
```javascript
import { 
  getStudentProfile, 
  getStudentProgress, 
  getStudentStats, 
  getStudentRoadmap 
} from '../services/careerTwin/careerTwinService';
```

- Fetches student data from backend API
- Runs AI analysis on the data
- Supports fallback to rule-based predictions
- Returns: `{ loading, error, profile, prediction, source, reload }`

### 4. **Career Twin AI** (`src/services/careerTwin/careerTwinAI.js`)
- Uses external AI services (Gemini, OpenRouter) for analysis
- **Note:** These are third-party APIs, not the backend
- Priority: Gemini → OpenRouter → Rule-based fallback

### 5. **Career Component** (`src/components/layout/Career Twin/Career.jsx`)
- Uses `useCareerTwin()` hook
- Displays predictions, job recommendations, salary insights
- Integrates with full student data from API

## Data Flow

```
Career.jsx Component
    ↓
useCareerTwin() Hook
    ↓
careerTwinService.js (NEW)
    ↓
API Endpoints (Backend)
    ├── /api/auth/me
    ├── /api/progress/my-progress
    ├── /api/progress/dashboard-stats
    ├── /api/roadmap
    ├── /api/lessons/course/{courseId}
    ├── /api/progress/progress-dashboard
    └── /api/ranking/me
    ↓
careerTwinAI.js (Process data)
    ↓
Gemini / OpenRouter (AI Analysis)
    ↓
Display Results
```

## Configuration

### Environment Variables Required
```env
# Backend API
VITE_API_BASE_URL=https://final-project-backend-production-214a.up.railway.app

# AI Services (at least one required for Career Twin)
VITE_GEMINI_API_KEY=your_gemini_key        # Recommended
VITE_OPENROUTER_KEY=your_openrouter_key    # Fallback

# Supabase (for authentication)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## API Authentication

All Career Twin API calls use Bearer token authentication:
- Automatically injected via `getAuthHeaders()` in careerTwinService.js
- Supports both:
  - Standard token (from `localStorage.token`)
  - Supabase auth token (from `localStorage['sb-*-auth-token']`)

## Error Handling

- All API calls wrapped in try-catch
- `Promise.allSettled()` ensures one failed endpoint doesn't break entire analysis
- Detailed error messages logged to console
- Graceful fallback to rule-based predictions

## Testing Career Twin Integration

```javascript
// In any React component
import { useCareerTwin } from '../hooks/useCareerTwin';

function TestCareerTwin() {
  const { loading, error, profile, prediction, source } = useCareerTwin();
  
  if (loading) return <div>Analyzing your career path...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Track: {profile?.track}</p>
      <p>Progress: {profile?.progressPct}%</p>
      <p>Predicted Jobs: {prediction?.jobs?.length}</p>
      <p>Data Source: {source}</p>
    </div>
  );
}
```

## Migration Notes

### What Changed
1. **New Service Layer**: `careerTwinService.js` provides dedicated API methods
2. **Hook Updated**: `useCareerTwin` now imports from careerTwinService instead of api.js
3. **Centralized Config**: All API calls use unified `API_BASE_URL` and auth handling

### Backward Compatibility
- Old imports from `api.js` still work (functions re-exported)
- Components using useCareerTwin require no changes
- Service layer can be extended for future backend endpoints

### Performance Improvements
- `getCompleteStudentData()` uses `Promise.allSettled()` for parallel requests
- Non-blocking error handling (one failure doesn't block others)
- Automatic token refresh through centralized auth system

## Future Enhancements

1. **Career Twin Backend Endpoint** (if planned)
   - Could create `/api/career-twin/analysis` endpoint
   - Backend would handle AI analysis instead of client-side

2. **Career Twin History**
   - Store predictions in database
   - Track progress toward recommended paths

3. **Real-time Notifications**
   - Alert when predicted jobs match user's skills
   - Push notifications for new opportunities

4. **Customization**
   - User preferences for career path
   - Industry filters
   - Salary expectations

---

**Last Updated**: 2026-06-13
**Status**: ✅ Fully connected to backend API
