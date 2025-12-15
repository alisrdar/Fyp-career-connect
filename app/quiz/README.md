# Quiz Module Documentation 🎮

## Overview
The Career Connect Quiz Module is a gamified, single-page application (SPA) that helps users discover their ideal career paths through an interactive AI-powered questionnaire.

## Architecture

### Design Pattern: Single Page Application (SPA)
The quiz uses a **view-based state machine** instead of traditional routing:
- ✅ **No route changes** during the quiz (prevents state loss)
- ✅ **Instant transitions** between views
- ✅ **Single source of truth** for state management

### Views
```
Welcome → Transition → Game ⟲ → Results
```

## File Structure

```
/app/quiz/
  ├── page.tsx                 # Main orchestrator (view switcher)
  └── types.ts                 # TypeScript type definitions

/components/quiz/
  ├── views/                   # Screen components
  │   ├── WelcomeView.tsx      # Landing screen
  │   ├── TransitionView.tsx   # Stage transition animations
  │   ├── GameView.tsx         # Main quiz gameplay
  │   └── ResultsView.tsx      # Final results display
  │
  ├── ui/                      # Reusable UI components
  │   ├── Mascot.tsx           # AI companion (DiceBear avatar)
  │   ├── ProgressBar.tsx      # Visual progress indicator
  │   ├── StreakCounter.tsx    # Streak display
  │   ├── XPFloater.tsx        # XP gain animations
  │   ├── OptionButton.tsx     # 3D-style answer buttons
  │   ├── QuestionCard.tsx     # Question template factory
  │   └── BadgePopup.tsx       # Achievement notifications
  │
  └── templates/               # Question type implementations
      ├── ScenarioMcq.tsx      # Multiple choice with scenario
      ├── LikertScale.tsx      # 5-point agreement scale
      ├── ImageChoice.tsx      # Visual selection
      ├── VisualSwipe.tsx      # Binary yes/no choice
      ├── BudgetSlider.tsx     # Range slider
      ├── SequenceOrder.tsx    # Drag-and-drop ordering
      └── PairMatch.tsx        # Match pairs

/hooks/
  └── useQuizGame.ts           # Core quiz logic and state
```

## Key Features

### 🎯 Gamification
- **XP System**: Earn points for each answer
- **Streak Tracking**: Bonus XP for consecutive questions
- **Badges**: Unlockable achievements ("On Fire!", "Unstoppable!")
- **Visual Feedback**: Animated mascot reactions

### 🧠 AI Integration
- Dynamic question selection via `/api/proxy/rag/next-question`
- Adaptive difficulty based on user responses
- Smart session completion detection

### 🎨 User Experience
- **Smooth Animations**: Powered by Framer Motion
- **Dark Mode Support**: Full theme compatibility
- **Mobile Responsive**: Touch-friendly interface
- **Progress Persistence**: Auto-saves to backend

### 📊 Question Types
1. **Scenario MCQ**: Story-based multiple choice
2. **Likert Scale**: 5-point emoji rating
3. **Image Choice**: Visual selection grid
4. **Visual Swipe**: Binary choice (yes/no)
5. **Budget Slider**: Percentage allocation
6. **Sequence Order**: Drag-and-drop ranking (DnD Kit)
7. **Pair Match**: Connection matching

## How It Works

### 1. Initialization
```tsx
const { startSession } = useQuizGame();
await startSession(); // Fetches first question
```

### 2. Game Loop
```
User selects answer → submitAnswer() → 
  ↓
Update XP/Streak → Save to backend → 
  ↓
Fetch next question → Render QuestionCard
```

### 3. Completion
- Triggered when:
  - Max questions reached (20-30 based on demographic)
  - Backend returns 204 (No Content)
- Generates career recommendations via `/api/proxy/recommend/results`

## State Management

### useQuizGame Hook
```typescript
{
  // Data
  question: Question | null,
  results: Recommendation[] | null,
  
  // Status
  loading: boolean,
  isFinished: boolean,
  
  // Progress
  progress: number,
  questionCount: number,
  maxQuestions: number,
  stage: Stage,
  
  // Gamification
  streak: number,
  xp: number,
  xpGained: number,
  badge: Badge | null,
  
  // Personality
  mascotState: MascotState,
  quip: string,
  
  // Actions
  startSession: () => Promise<void>,
  submitAnswer: (answerId: string) => Promise<void>
}
```

## Backend API Endpoints

### POST `/api/proxy/rag/next-question`
**Request:**
```json
{ "user_id": "..." }
```
**Response:**
```json
{
  "id": "q123",
  "type": "scenario_mcq",
  "text": "You're leading a team project...",
  "scenario": "Your team is behind schedule...",
  "options": [
    { "id": "a", "text": "Redistribute tasks" },
    { "id": "b", "text": "Request deadline extension" }
  ]
}
```

### POST `/api/proxy/user/save-response`
**Request:**
```json
{
  "user_id": "...",
  "question_id": "q123",
  "response_id": "a"
}
```

### POST `/api/proxy/recommend/results`
**Request:**
```json
{
  "user_id": "...",
  "personality": {}
}
```
**Response:**
```json
{
  "recommendations": [
    { "id": "1", "title": "Software Engineer", "description": "..." }
  ]
}
```

## Customization Guide

### Add a New Question Type

1. **Create Template Component**
```tsx
// components/quiz/templates/MyNewType.tsx
import { Question } from '@/app/quiz/types';

export default function MyNewType({ question, onAnswer }) {
  return (
    <div>
      {/* Your UI */}
      <button onClick={() => onAnswer('answer_id')}>Submit</button>
    </div>
  );
}
```

2. **Update Types**
```typescript
// app/quiz/types.ts
export type QuestionType = 
  | 'my_new_type'
  | ...existing types;
```

3. **Register in Factory**
```tsx
// components/quiz/ui/QuestionCard.tsx
case 'my_new_type':
  return <MyNewType question={question} onAnswer={onAnswer} />;
```

### Modify Gamification

**XP Calculation** (hooks/useQuizGame.ts):
```typescript
let earnedXp = 10; // Base XP
if (!isSurvey) {
  earnedXp += (newStreak * 2); // Streak bonus
}
```

**Badge Triggers**:
```typescript
if (currentStreak === 10) {
  setBadge({ name: "Legendary!", icon: "👑" });
}
```

## Testing Checklist

### Pre-Launch Tests
- [ ] Can start a new session
- [ ] All 7 question types render correctly
- [ ] XP increases after each answer
- [ ] Streak counter updates
- [ ] Progress bar advances
- [ ] Mascot changes expressions
- [ ] Stage transitions appear (at ~33%, ~66%)
- [ ] Badge popup shows on milestone
- [ ] Quiz completes at max questions
- [ ] Results view displays correctly
- [ ] Mobile view is responsive

### Cross-Browser Tests
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (iOS)

## Performance Tips

1. **Lazy Loading**: Question templates are only imported when needed (code splitting)
2. **Optimistic UI**: XP/Streak updates before backend confirmation
3. **Debounced Animations**: Badge timeouts prevent spam
4. **Memoization**: Consider `React.memo()` for heavy components

## Troubleshooting

### Issue: "Question not loading"
- Check backend is running on `process.env.AI_ENGINE_URL`
- Verify `/api/proxy/[...path]/route.js` is working
- Check browser console for CORS errors

### Issue: "Mascot not showing"
- Ensure `@dicebear/core` and `@dicebear/collection` are installed
- Check network tab for SVG generation errors

### Issue: "Drag-and-drop not working"
- Verify `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` are installed
- Test on desktop (mobile touch may need `PointerSensor`)

## Environment Variables

```env
AI_ENGINE_URL=http://localhost:8000  # Python backend endpoint
```

## Dependencies

### Required Packages
```json
{
  "dependencies": {
    "@dicebear/core": "^9.2.4",
    "@dicebear/collection": "^9.2.4",
    "framer-motion": "^11.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x",
    "axios": "^1.9.0"
  }
}
```

### Installation
```bash
npm install framer-motion @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Future Enhancements

### Phase 2 Ideas
- [ ] Voice narration for questions
- [ ] Accessibility improvements (ARIA labels)
- [ ] Analytics tracking (time per question)
- [ ] Power-ups/bonus rounds
- [ ] Leaderboards
- [ ] Share results on social media
- [ ] Multi-language support
- [ ] Question bookmarking

## Credits

**Design Pattern**: SPA View-Switcher Architecture  
**Mascot**: DiceBear Avataaars Collection  
**Animations**: Framer Motion  
**Drag & Drop**: DnD Kit  

---

**Built with ❤️ for Career Connect**
