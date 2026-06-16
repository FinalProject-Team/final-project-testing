# 🧪 Quick Test Guide - Employer Dashboard Fix

## Step 1: Register with Job Seeker Role

1. Open your app: `http://localhost:5173/register`
2. You should see **two account type buttons**:
   ```
   📚 Student          💼 Job Seeker
   Learn courses &     Post jobs &
   skills              hire talent
   ```
3. Click the **"💼 Job Seeker"** button (should turn cyan/highlighted)
4. Fill in the form:
   - Full Name: "Test Employer"
   - Email: "employer@test.com"
   - Phone: "01000000000"
   - Password: "password123"
   - Confirm Password: "password123"
5. Click "Create Account"
6. You'll be redirected to login
7. Login with the new credentials

---

## Step 2: Navigate to Employer Dashboard

1. After login, go to Dashboard: `http://localhost:5173/dashboard`
2. Look for the sidebar on the left
3. You should see **"Employer Dashboard"** link with 💼 icon
4. Click it
5. **Expected Result**: Dashboard should load (NOT redirect to Home)

---

## Step 3: Verify in Browser Console

1. Open DevTools: **F12** or **Ctrl+Shift+I**
2. Go to **Console** tab
3. You should see messages like:
   ```
   ✅ EmployerDashboard mounted
   ```
4. No red errors should appear

---

## Step 4: Check Network Tab

1. Still in DevTools
2. Go to **Network** tab
3. Click "Employer Dashboard" link again
4. Look for API call:
   ```
   GET /api/jobs/my/jobs
   Status: 200 (or 401 if token issue)
   ```

---

## What You Should See

### ✅ Correct Behavior
```
1. Registration: Two account type buttons visible
2. After login: "Employer Dashboard" visible in sidebar
3. Click link: Dashboard loads with job creation form
4. Console: "EmployerDashboard mounted" message
5. Network: API calls showing 200 status
```

### ❌ Wrong Behavior (Before Fix)
```
1. Registration: No account type selector
2. After login: "Employer Dashboard" link missing
3. Click link: Redirected to Home
4. Console: No dashboard mounted message
```

---

## Troubleshooting

### Issue 1: Account Type Buttons Not Showing
- **Solution**: Clear browser cache (Ctrl+F5)
- Run: `npm run build && npm run dev`

### Issue 2: Still Redirected to Home
- **Check**: User role in browser console:
  ```javascript
  // Paste in console:
  console.log(JSON.parse(localStorage.getItem('user')));
  // Look for: "role": "job_seeker"
  ```
- If role is "student", register a new account with Job Seeker role

### Issue 3: "Employer Dashboard" Link Still Missing
- **Solution**: 
  1. Hard refresh: Ctrl+Shift+Delete
  2. Clear all cache
  3. Re-login
  4. Check sidebar again

### Issue 4: Dashboard Loads But No Jobs
- **Check Console**: Look for any errors
- **Check Network**: Verify `/api/jobs/my/jobs` call has 200 status
- If 401: Token expired, re-login
- If 403: Role issue, verify role is "job_seeker"

---

## Test Scenarios

### Scenario 1: New Job Seeker
```
✓ Register → Select "💼 Job Seeker"
✓ Login
✓ Click "Employer Dashboard"
✓ See job creation form
✓ Create a job
✓ See job in list
```

### Scenario 2: New Student
```
✓ Register → Select "📚 Student"
✓ Login
✓ Dashboard should NOT have "Employer Dashboard" link
✓ Can access learning features instead
```

### Scenario 3: Wrong Role Redirect
```
✓ If old account has "student" role
✓ Try to access Employer Dashboard
✓ Should redirect to Home
✓ Create new account with "job_seeker" role to access
```

---

## Console Commands to Test

```javascript
// Check current user role
const user = JSON.parse(localStorage.getItem('user'));
console.log('Role:', user?.role);

// Check token
console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');

// Test Community API
fetch('https://final-project-backend-production-214a.up.railway.app/api/community/posts')
  .then(r => r.json())
  .then(d => console.log('Community posts:', d))
  .catch(e => console.error('Error:', e));

// Test Employer Jobs API (requires token)
const token = localStorage.getItem('token');
fetch('https://final-project-backend-production-214a.up.railway.app/api/jobs/my/jobs', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => console.log('My jobs:', d))
  .catch(e => console.error('Error:', e));
```

---

## ✅ Success Checklist

- [x] Account type selector visible during registration
- [x] Can select "Job Seeker" role
- [x] Registration completes successfully
- [x] Login works with new credentials
- [x] "Employer Dashboard" link appears in sidebar
- [x] Click link navigates to dashboard (no redirect)
- [x] Dashboard shows job creation form
- [x] Console shows "EmployerDashboard mounted"
- [x] API calls show 200 status
- [x] Can create, edit, delete jobs
- [x] Can view applicants

---

## Next Steps

1. ✅ Complete the test scenarios above
2. ✅ Register multiple test accounts
3. ✅ Test both Student and Job Seeker roles
4. ✅ Verify Community features work
5. ✅ Check job posting/management workflow
6. ✅ Deploy to production when confirmed

---

## 🎉 All Tests Passing?
Great! The Employer Dashboard fix is working correctly. You can now:
- ✅ Use Employer Dashboard as Job Seeker
- ✅ Post and manage jobs
- ✅ View applicants
- ✅ Use Community features

**Ready for production deployment!** 🚀
