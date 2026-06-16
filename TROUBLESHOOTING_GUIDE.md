# Employer Dashboard & Community API - Troubleshooting Guide

## 🎯 Issue: Employer Dashboard not opening when clicking sidebar link

### ✅ Verification Checklist

#### 1. Route Configuration ✓
**File**: [src/App.jsx](src/App.jsx#L236-L239)
```jsx
{ path: "employer", element: (
  <ProtectedRoute allowedRoles={["job_seeker"]}>
    <EmployerDashboard />
  </ProtectedRoute>
)}
```
- ✓ Route path: `employer` (becomes `/dashboard/employer`)
- ✓ Protected by ProtectedRoute
- ✓ Role restricted to: `job_seeker`

#### 2. Sidebar Navigation ✓
**File**: [src/components/layout/Sidebar/Sidebar.jsx](src/components/layout/Sidebar/Sidebar.jsx#L32)
```jsx
{ to: '/dashboard/employer', icon: <FaBriefcase size={16} />, label: 'Employer Dashboard' }
```
- ✓ Link path: `/dashboard/employer`
- ✓ Visible to job_seeker role
- ✓ Uses React Router NavLink

#### 3. Component Import ✓
**File**: [src/App.jsx](src/App.jsx#L66)
```jsx
import EmployerDashboard from "./pages/Dashboard/EmployerDashboard";
```
- ✓ File exists: `src/pages/Dashboard/EmployerDashboard.jsx`
- ✓ Default export present
- ✓ Import path correct

#### 4. EmployerDashboard Component ✓
**File**: [src/pages/Dashboard/EmployerDashboard.jsx](src/pages/Dashboard/EmployerDashboard.jsx)
- ✓ Component exported as default
- ✓ useEffect calls `fetchMyJobs()` on mount
- ✓ Console log added: `console.log('EmployerDashboard mounted');`
- ✓ State management: jobs, selectedJob, form data
- ✓ Renders proper JSX structure

---

## 🔧 How to Debug

### Step 1: Check Browser Console
1. Open DevTools: `F12`
2. Go to **Console** tab
3. Click "Employer Dashboard" in sidebar
4. Look for message: `EmployerDashboard mounted`
5. Check for any red errors

### Step 2: Check Network Tab
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Click "Employer Dashboard"
4. Look for API calls:
   - Request: `GET /api/jobs/my/jobs`
   - Status should be `200` (success) or `401` (auth required)

### Step 3: Verify Token
```javascript
// In browser console:
console.log(localStorage.getItem('token'));
```
- Should show a long JWT token
- If empty/null → User not authenticated

### Step 4: Test URL Directly
1. Type in address bar: `http://localhost:5173/dashboard/employer`
2. Should navigate and show Employer Dashboard
3. If 403 error → Role mismatch
4. If blank page → Component render issue

---

## 🚨 Common Issues & Solutions

### Issue 1: "Cannot read properties of undefined (reading 'jobs')"
**Cause**: API returned undefined or malformed data
**Solution**:
```javascript
// In EmployerDashboard.jsx fetchMyJobs():
const normalizedJobs = Array.isArray(response) ? response : response?.data || [];
setJobs(normalizedJobs);
```

### Issue 2: "401 Unauthorized" when fetching jobs
**Cause**: Token missing or expired
**Solution**:
1. Login again to refresh token
2. Check `localStorage.getItem('token')`
3. Verify token includes "Bearer" in Authorization header

### Issue 3: "403 Forbidden" when fetching jobs
**Cause**: User role not `job_seeker`
**Solution**:
1. Check user role: `localStorage.getItem('user')` → look for `role` field
2. Ensure user has `role: "job_seeker"`
3. Register/login with job_seeker role

### Issue 4: Page shows but no jobs appear
**Cause**: Empty job list or API returning wrong format
**Solution**:
1. Check Network tab for API response
2. Verify API returns array format
3. Check console for error messages
4. Inspect `response.data` structure

### Issue 5: Sidebar link doesn't highlight
**Cause**: NavLink activeClass not matching route
**Solution**:
1. Verify current route: `http://localhost:5173/dashboard/employer`
2. Verify sidebar link path: `/dashboard/employer` (should match)
3. Check NavLink isActive condition

---

## 📝 Testing Checklist

- [ ] User logged in with `job_seeker` role
- [ ] Token present in localStorage
- [ ] Network requests showing 200 status
- [ ] Browser console has no red errors
- [ ] Component renders and shows either:
  - Loading state
  - Jobs list
  - "No jobs yet" message
  - Create job form

---

## 🔗 Related API Endpoints

All these endpoints are implemented in [src/services/api/api.js](src/services/api/api.js):

| Function | Endpoint | Method | Role |
|----------|----------|--------|------|
| `apiGetMyJobs()` | `/api/jobs/my/jobs` | GET | job_seeker |
| `apiCreateJob()` | `/api/jobs` | POST | job_seeker |
| `apiUpdateJob()` | `/api/jobs/{id}` | PUT | job_seeker |
| `apiDeleteJob()` | `/api/jobs/{id}` | DELETE | job_seeker |
| `apiGetJobApplicants()` | `/api/jobs/{id}/applicants` | GET | job_seeker |
| `apiUpdateApplicationStatus()` | `/api/jobs/applications/{id}/status` | PATCH | job_seeker |

---

## ✨ Community Feature - API Integration

### What's New
All Community posts now load from real API instead of mock data.

**Files Updated**:
- [src/services/api/api.js](src/services/api/api.js) - 11 new API functions
- [src/context/PostsContext.jsx](src/context/PostsContext.jsx) - Connected to API

### How It Works
1. **On component mount**: `apiGetAllPosts()` fetches data
2. **On like/save/comment**: Real API calls are made
3. **Error handling**: Falls back to mock data if API fails
4. **Loading states**: Shows skeleton while fetching

### Test Community Feature
1. Go to Community page
2. Check console for API calls
3. Verify posts load from backend
4. Try liking/saving/commenting
5. Check Network tab for requests

---

## 📞 Quick Links

- **Employer Dashboard**: [src/pages/Dashboard/EmployerDashboard.jsx](src/pages/Dashboard/EmployerDashboard.jsx)
- **Community Posts**: [src/context/PostsContext.jsx](src/context/PostsContext.jsx)
- **API Layer**: [src/services/api/api.js](src/services/api/api.js)
- **Routes**: [src/App.jsx](src/App.jsx)
- **Sidebar Navigation**: [src/components/layout/Sidebar/Sidebar.jsx](src/components/layout/Sidebar/Sidebar.jsx)

---

## 🎓 Learning Resources

- [React Router v7 Docs](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [JWT Authentication](https://jwt.io)
- [Bearer Token Format](https://datatracker.ietf.org/doc/html/rfc6750)
