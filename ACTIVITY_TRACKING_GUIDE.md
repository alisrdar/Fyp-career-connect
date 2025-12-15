# Activity Tracking System

## Overview
The dashboard now includes a **real-time activity tracking system** that logs and displays user actions across the app.

## What Changed

### 1. **Activity Logger Helper** (`helpers/activityLogger.js`)
A centralized system for tracking user activities with the following functions:

- `logActivity(userId, activityType)` - Log a new activity
- `getRecentActivities(userId, limit)` - Retrieve recent activities
- `clearActivities(userId)` - Clear user's activity history

### 2. **Activity Types**
Pre-defined activity types with consistent styling:
- `QUIZ_STARTED` - User begins career quiz
- `QUIZ_COMPLETED` - User completes career quiz
- `SURVEY_STARTED` - User begins personality survey
- `SURVEY_COMPLETED` - User completes personality survey
- `PROFILE_UPDATED` - User updates their profile
- `RESOURCES_VISITED` - User visits resources page
- `ACHIEVEMENT_UNLOCKED` - User unlocks an achievement
- `LOGIN` - User logs into the app

### 3. **Dashboard Updates** (`components/dashboad/PlayerHQ.jsx`)
- Replaced mock activity data with real localStorage-based tracking
- Activities display with timestamps ("2m ago", "3h ago", "1d ago")
- Shows last 5 activities with proper icons and colors
- Empty state: "No recent activity yet. Start exploring!"

### 4. **Resources Card**
- Updated from generic "Interview Tips" to "Career Resources"
- Subtitle: "Articles, Videos & More"
- Larger icon (16x16) with gradient background
- Matches the gamified theme

### 5. **Activity Tracking Integration**
Activities are now logged in these pages:

#### Quiz Page (`app/quiz/page.tsx`)
- ✅ Logs when quiz is started (first time only)
- ✅ Logs when quiz is completed

#### Survey Page (`app/survey/page.jsx`)
- ✅ Logs when survey is started (first answer)
- ✅ Logs when survey is completed

#### Resources Page (`app/resources/page.js`)
- ✅ Logs when resources page is visited

## How to Use

### Adding New Activity Types
1. Add to `ActivityTypes` in `helpers/activityLogger.js`:
```javascript
export const ActivityTypes = {
  YOUR_ACTIVITY: { action: 'Display Text', icon: 'IconName', color: 'colorName' },
  // ...existing types
};
```

### Logging an Activity
```javascript
import { logActivity, ActivityTypes } from '@/helpers/activityLogger';
import { useAuth } from '@/context/AuthContext';

const { user } = useAuth();

// Log activity
if (user) {
  logActivity(user._id, ActivityTypes.QUIZ_STARTED);
}
```

### Available Icons
- `CheckCircle` - Completion actions
- `User` - Profile/login actions
- `PlayCircle` - Start actions
- `FileText` - Survey/form actions
- `BookOpen` - Resource actions
- `Trophy` - Achievement actions

### Available Colors
- `green` - Success/completion
- `blue` - Profile/account
- `purple` - Quiz/game actions
- `orange` - Survey/forms
- `cyan` - Resources/learning
- `yellow` - Achievements/rewards

## Storage
- Activities stored in localStorage as `userActivities`
- Maximum 50 activities stored per user
- Persists across sessions
- Cleared when user logs out (manual clear)

## Future Enhancements
Consider adding:
- Activity filtering by type
- Activity search
- Export activity history
- Activity analytics/insights
- Achievements based on activity patterns
- Activity notifications

## Testing
To test the system:
1. Visit `/dashboard` - see empty state
2. Start quiz - see "Started Career Quiz" activity
3. Complete quiz - see "Completed Career Quiz" activity
4. Take survey - see survey activities
5. Visit resources - see "Explored Resources" activity
6. All timestamps update in real-time

---
*Last updated: Activity tracking system implementation*
