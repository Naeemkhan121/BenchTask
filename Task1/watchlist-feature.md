


# Prompt Strategy Document — Watchlist Feature (AI-First Approach)

##  Feature: Watchlist (OTT App)

A logged-in user can:
- Add/remove titles to their Watchlist  
- View all saved items on a Watchlist screen  
- See Watchlist state on content cards  

---

## 1.  Feature Decomposition (6 Tasks)

The tasks follow a **data → logic → UI → integration → reliability** sequence.

### 1. Watchlist Data Model & Mock Layer
- Define Watchlist item type
- Create mock data + helper methods (`add/remove/check`)
- No UI involved

### 2. Watchlist State Management Hook
- Create `useWatchlist` hook
- Manage add/remove/check logic
- Expose API for UI consumption

### 3. Watchlist Toggle Logic (Content Card Integration)
- Add watchlist icon state to existing `ContentCard`
- Integrate `useWatchlist`
- Handle toggle interaction

### 4. Watchlist Screen UI
- Create `WatchlistScreen`
- Display saved items using `FlatList`
- Use existing `ContentCard`

### 5. Navigation Integration
- Add Watchlist screen to navigation stack
- Add entry point (tab/header button)

### 6. Persistence & Edge Handling
- Persist watchlist (AsyncStorage or API placeholder)
- Handle loading/empty/error states

---

## 2.  Two Full CDIR Prompts

###  Prompt 1 — Watchlist Hook

#### C — Context  
In our React Native TypeScript project:
- Hooks are in `src/hooks/`
- API/state logic is encapsulated in hooks
- No global state library (use local hook state)
- Strict TypeScript (no `any`)

#### D — Decompose
- Define types
- Create state
- Add helper functions
- Export reusable hook

#### I — Instruction

Create a `useWatchlist` hook in `src/hooks/useWatchlist.ts`.

Requirements:
- Define a `WatchlistItem` type with `id`, `title`, `thumbnail`
- Maintain state using `useState`
- Expose:
  - `watchlist` (array)
  - `addToWatchlist(item)`
  - `removeFromWatchlist(id)`
  - `isInWatchlist(id)`
- Prevent duplicate entries
- No external libraries
- Add basic error handling (safe guards, no crashes)

Use mock initial data (2–3 items)

#### R — Review Focus
- Type safety
- Duplicate prevention logic
- Clean API design

---

### Prompt 2 — Watchlist Screen

#### C — Context  
- Screens live in `src/screens/`
- UI pattern reference: `src/screens/HomeScreen.tsx`
- Components: `ContentCard` already exists
- Data comes from `useWatchlist`

#### D — Decompose
- Create screen layout
- Fetch data from hook
- Render list
- Handle empty state

#### I — Instruction

Create `WatchlistScreen.tsx` in `src/screens/`.

Requirements:
- Use `FlatList` to render watchlist items
- Use existing `ContentCard` (`src/components/ContentCard.tsx`)
- Fetch data using `useWatchlist`
- Show empty state text: "Your Watchlist is empty"
- Add basic loading-safe handling (no crashes if undefined)
- Follow layout structure from `HomeScreen`
- No new libraries

Ensure proper keyExtractor and performance-safe rendering

#### R — Review Focus
- Correct hook usage
- UI consistency with existing screens
- Proper empty state handling

---

## 3. Plan Mode Outline (Most Complex Task: Content Card Integration)

### Expected Agent Plan

#### Clarifying Questions
- Does `ContentCard` already support action icons?
- Should Watchlist state persist immediately or later?
- Is global state required or hook-based sufficient?

#### Files to Reference
- `src/components/ContentCard.tsx`
- `src/hooks/useWatchlist.ts`
- `src/screens/HomeScreen.tsx`

#### Plan Steps
1. Analyze `ContentCard` structure
2. Add Watchlist icon UI
3. Integrate `useWatchlist`
4. Add toggle handler
5. Update UI based on state (`isInWatchlist`)
6. Ensure no prop breaking changes
7. Validate reusability across screens

---

## 4.  .cursor/rules Additions

### Rule 1 — No Direct State Mutation
**Rule:** Always use hook methods for Watchlist updates  
**Reason:** Prevent inconsistent state handling across components  

---

### Rule 2 — Reuse Existing Components
**Rule:** Must use `ContentCard` for all content display  
**Reason:** Maintain UI consistency and avoid duplication  

---

### Rule 3 — No New Libraries Without Approval
**Rule:** Do not install packages for state or storage  
**Reason:** Keep architecture controlled and predictable  

---

## 5.  AI Failure Anticipation

### Failure 1 — Duplicate Watchlist Entries
**Issue:** AI may forget to prevent duplicates  

**Detection:** Add same item twice during testing  

**Fix Prompt:**
Update `useWatchlist` to ensure duplicate items cannot be added. Use ID-based checks before insertion.

---

### Failure 2 — Incorrect Hook Usage in UI
**Issue:** Hook used inside loops or conditions  

**Detection:** React warnings / broken rendering  

**Fix Prompt:**
Refactor `WatchlistScreen` to ensure `useWatchlist` is called only at top-level of the component and follows React hook rules.

---

## 6.  One Key Learning

The biggest shift is **“fix inputs, not outputs.”**  

Earlier, I would manually fix small UI or logic issues. Now I understand that repeated AI mistakes indicate **poor prompts or missing rules**, not bad output.

Improving prompts and rules creates a **scalable development system**, not just a one-time fix.

---

##  Evaluation Alignment

| Dimension | How This Document Meets It |
|----------|--------------------------|
| Decomposition quality | Logical sequence, small tasks, real build order |
| Prompt specificity | Clear file paths, constraints, reuse patterns |
| Failure awareness | Realistic issues + prompt-based recovery |
| Clarity of thinking | Structured planning + AI-first mindset |

