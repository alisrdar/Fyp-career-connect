# Admin Module & Quiz Session Management - Quick Start Guide

## ✅ All Tasks Completed

### Task 1: Quiz Session Management ✓
**Question:** When user clicks retake quiz, should the previous quiz session be replaced or deleted?
**Answer:** YES - Previous session is marked as "abandoned" and a new session is created.

**How it works:**
1. User clicks "Retake Quiz" button on results page
2. System calls `DELETE /api/quiz/session` → marks current session as "abandoned"
3. LocalStorage is cleared
4. All quiz state is reset
5. When user restarts, a new session is created in `quiz_sessions` collection

**Database Schema:**
```javascript
quiz_sessions: {
  userId: ObjectId,
  status: "in_progress" | "completed" | "abandoned",
  questionCount: Number,
  xp: Number,
  streak: Number,
  // ... progress tracking
}
```

---

### Task 2: Admin Module ✓

## Database Models Created

### 1. QuizQuestion Model
**Location:** `models/QuizQuestion.js`
**Collection:** `quiz_questions`

```javascript
{
  text: String,                    // Question text
  type: String,                     // scenario_mcq, image_choice, etc.
  category: String,                 // aptitude, personality, career_interest
  difficulty: Number,               // 0.1 - 1.0
  demographic: String,              // middle_school, high_school, adult, all
  skillVector: Map<String, Number>, // { "logic": 0.8, "math": 0.6 }
  options: [{                       // For MCQ types
    id: String,
    text: String,
    correct: Boolean
  }],
  interaction_config: Mixed,        // For complex types (sequence, pairs, etc.)
  createdBy: ObjectId,              // Admin who created it
  isActive: Boolean,
  usageCount: Number,
  avgCorrectRate: Number
}
```

### 2. QuizSession Model
**Location:** `models/QuizSession.js`
**Collection:** `quiz_sessions`

```javascript
{
  userId: ObjectId,
  demographic: String,
  status: String,                   // in_progress, completed, abandoned
  currentStageId: Number,
  completedStages: [Number],
  questionCount: Number,
  streak: Number,
  xp: Number,
  startedAt: Date,
  completedAt: Date
}
```

---

## API Routes Created

### Admin User Management
- `GET    /api/admin/users`           - List all users (paginated)
- `POST   /api/admin/users`           - Create new user
- `GET    /api/admin/users/[id]`      - Get single user
- `PUT    /api/admin/users/[id]`      - Update user
- `DELETE /api/admin/users/[id]`      - Delete user

### Admin Question Management
- `GET    /api/admin/questions`       - List all questions (with filters)
- `POST   /api/admin/questions`       - Upload new question
- `GET    /api/admin/questions/[id]`  - Get single question
- `PUT    /api/admin/questions/[id]`  - Update question
- `DELETE /api/admin/questions/[id]`  - Delete question

### Admin Analytics
- `GET    /api/admin/analytics`       - Platform analytics dashboard

### Quiz Session Management
- `GET    /api/quiz/session`          - Get active session
- `POST   /api/quiz/session`          - Create/update session
- `DELETE /api/quiz/session`          - Abandon session (for retake)
- `POST   /api/quiz/complete`         - Mark quiz as completed

---

## Admin Dashboard Pages

### 1. Main Dashboard
**URL:** `/admin`
**Features:**
- 📊 Overview statistics (users, sessions, questions)
- 📈 Completion rate tracking
- 📋 Recent quiz sessions table
- 🎯 User demographic distribution
- 📚 Questions by category breakdown

### 2. User Management
**URL:** `/admin/users`
**Features:**
- ➕ Create new users
- ✏️ Edit existing users
- 🗑️ Delete users
- 🔍 Search by name/email
- 📄 Pagination
- 👑 Assign admin roles
- ✅ Verification status

### 3. Question Bank
**URL:** `/admin/questions`
**Features:**
- ➕ Upload new questions
- ✏️ Edit questions
- 🗑️ Delete questions
- 🎚️ Set difficulty levels
- 🎯 Target demographics
- ✅ Activate/deactivate questions
- 📊 View question statistics

**Supported Question Types:**
1. Scenario MCQ
2. Image Choice
3. Sequence Order
4. Pair Match
5. Budget Slider
6. Likert Scale (1-5)
7. Visual Swipe

---

## How to Access Admin Panel

### Step 1: Make Your Account Admin

**Option A: Via MongoDB Compass/Atlas**
```javascript
// Find your user and update
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

**Option B: Via MongoDB Shell**
```bash
mongosh "mongodb+srv://Ali:dbUser4561@sardarcluster.heu2hii.mongodb.net/careerconnect"
```
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

**Option C: Directly in Code (Temporary)**
```javascript
// In models/User.js, temporarily set default
isAdmin: {
  type: Boolean,
  default: true  // REMOVE THIS AFTER CREATING ADMIN!
}
```

### Step 2: Navigate to Admin Panel
- Main Dashboard: `http://localhost:3000/admin`
- User Management: `http://localhost:3000/admin/users`
- Question Bank: `http://localhost:3000/admin/questions`

---

## Analytics Dashboard Metrics

### User Metrics
- Total Users
- Verified Users  
- Admin Users
- Users by Demographic (Middle School, High School, Adult)
- Recent Signups

### Quiz Session Metrics
- Total Sessions
- Completed Sessions
- In-Progress Sessions
- Abandoned Sessions
- Completion Rate %
- Average XP
- Average Streak
- Max XP Earned
- Max Streak Achieved

### Question Bank Metrics
- Total Questions
- Active Questions
- Questions by Category (Aptitude, Personality, Career Interest)
- Questions by Type
- Question Usage Statistics

### Skill Analytics
- Top 10 Skills by Average Score
- Skill Distribution Across Users

---

## Security Features

✅ **Admin-only Routes** - All `/api/admin/*` routes check `user.isAdmin`
✅ **JWT Authentication** - Uses existing token validation
✅ **Self-deletion Prevention** - Admins cannot delete themselves
✅ **Password Hashing** - bcrypt for new user creation
✅ **Protected Pages** - Admin pages redirect non-admins to dashboard

---

## Testing the Admin Module

### 1. Create Admin User
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

### 2. Test User Management
1. Navigate to `/admin/users`
2. Click "Add User"
3. Fill form and create
4. Test edit/delete functions

### 3. Test Question Upload
1. Navigate to `/admin/questions`
2. Click "Add Question"
3. Fill in:
   - Question text
   - Select type (e.g., "Scenario MCQ")
   - Choose category (Aptitude/Personality/Career Interest)
   - Set difficulty (0.1 - 1.0)
   - Add options (for MCQ types)
   - Mark correct answer
4. Save and verify in database

### 4. Test Analytics
1. Navigate to `/admin`
2. Verify all stats load
3. Check charts display correctly
4. View recent activity

---

## Database Collections Summary

After implementation, you now have:

1. **users** - User accounts (existing, now with `isAdmin` field)
2. **useraiprofiles** - AI aptitude scores (existing)
3. **quiz_sessions** - 🆕 Quiz attempt tracking
4. **quiz_questions** - 🆕 Admin-uploaded questions

---

## Next Steps

1. ✅ Set one user as admin in MongoDB
2. ✅ Login and navigate to `/admin`
3. ✅ Upload test questions
4. ✅ Monitor quiz sessions
5. ✅ Analyze user trends

---

## Integration with Existing System

### Quiz Flow (Updated)
1. User starts quiz → Creates `quiz_session` document
2. User answers questions → Updates `session.questionCount`, `session.xp`
3. User completes quiz → Sets `session.status = 'completed'`
4. User clicks retake → Marks old session as `'abandoned'`, creates new one

### Admin-Created Questions
- Stored in `quiz_questions` collection
- Can be integrated with AI engine to supplement dynamic questions
- Admins control difficulty, demographic targeting, skill mapping

---

## Troubleshooting

**Admin panel shows "Access Denied"**
→ Check if `user.isAdmin === true` in database

**Cannot see any users/questions**
→ Check MongoDB connection and collections exist

**Delete button doesn't work**
→ Check console for errors, verify admin permissions

**Analytics not loading**
→ Check `/api/admin/analytics` endpoint in Network tab

---

## Files Created/Modified

### New Models
- `models/QuizSession.js`
- `models/QuizQuestion.js`

### New API Routes
- `app/api/admin/users/route.js`
- `app/api/admin/users/[id]/route.js`
- `app/api/admin/questions/route.js`
- `app/api/admin/questions/[id]/route.js`
- `app/api/admin/analytics/route.js`
- `app/api/quiz/session/route.js`
- `app/api/quiz/complete/route.js`

### New Pages
- `app/admin/page.js` - Main dashboard
- `app/admin/users/page.js` - User management
- `app/admin/questions/page.js` - Question bank

### Modified Files
- `hooks/useQuizGame.ts` - Added DB session tracking
- `components/quiz/views/ResultsView.tsx` - Added retake modal
- `components/quiz/views/StagesView.tsx` - Renamed stages
- `components/dashboad/PlayerHQ.jsx` - Show completion status
- `components/quiz/views/GameView.tsx` - Fixed question counter

---

🎉 **All Tasks Complete - Admin Module Ready for Use!**
