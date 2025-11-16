# 🎯 Score Tracker App - Feature Guide

## Overview
The Score Tracker App has been enhanced with a professional tab-based navigation system featuring three main sections: Home, Play, and More.

---

## 🏠 HOME TAB

### Game Statistics Card
- Displays total number of games played
- Shows a 🎮 icon for visual appeal
- Centered card layout with shadow effects

### Game History Section
Shows all completed games with detailed information:
- **Winner**: Name of the player who won
- **Round**: The final round number when the game ended
- **Players**: Total number of players in that game
- **Date**: When the game was played

Each game entry is displayed in a card with:
- Left border accent (blue)
- Clean typography
- Touch-friendly sizing

### Empty State
When no games have been played yet, displays a "No Data" message

---

## 🎮 PLAY TAB

### Step 1: Player Setup
**Setup Header**
- Title: "Start Play" (or translated equivalent)
- Subtitle: "Add More Players"

**Add Players Section**
- Input field to enter player names
- Green "+" button to add players
- Clear feedback on player additions

**Player List**
- Shows all added players in a numbered list
- Clean card-style display
- Players numbered from 1 onwards

**Start Game Button**
- Enabled only when 2+ players are added
- Disabled state when less than 2 players
- Large, easy-to-tap button

### Step 2: Game Play (Active Round)
**Round Header**
- Displays current round number
- Clean, centered layout

**Active Players List**
- Shows all players who haven't been eliminated
- Displays player number, name, and current score
- Input field for each player to enter their round score
- Numeric keyboard for easy score entry

**Score Input**
- Accepts numeric values
- Large, easy-to-read input fields
- Shows player's cumulative score

**Eliminated Players Panel**
- Shows players who have been eliminated (score > 30)
- Lists their final scores
- Visible only when there are eliminated players
- Red/warning color scheme

**End Round Button**
- Progresses to the next round
- Updates all player scores
- Eliminates players with score > 30
- Checks for winner condition

### Step 3: Winner Screen
**Winner Announcement**
- Displays 🎉 emoji
- Shows "Winner!" text
- Displays winning player's name
- Shows final round number

**Play Again Button**
- Restarts the game completely
- Clears all scores and players
- Returns to player setup

---

## ⋯ MORE TAB (Settings & Info)

### Language Selection 🌐
**Features:**
- Modal dialog with language options
- Arabic (العربية) - Default
- English - Alternative
- Easy toggle between languages
- All app text updates immediately

**Language Support:**
All elements translate including:
- Tab labels
- Button text
- Menu items
- Dialog titles
- Game terminology
- Instructions

### About Me 👤
**Content:**
- Professional developer bio
- Information about specialization
- Developer credentials
- Touch-friendly modal display

### Contact Me 📱
**Information:**
- Social media handle: @abdu_amigo
- Contact icon
- Easy-to-read format
- Professional layout

---

## 🎨 UI/UX Features

### Design Elements
- **Color Scheme**:
  - Primary: Blue (#3498db) for main actions
  - Success: Green (#2ecc71) for add/positive actions
  - Danger: Red (#e74c3c) for end round
  - Warning: Light red (#f8d7da) for eliminated players
  - Neutral: Grays for secondary content

- **Typography**:
  - Bold titles for clear hierarchy
  - Regular weight for content
  - Consistent sizing throughout

- **Spacing & Layout**:
  - Generous padding for touch targets
  - Clear separation between sections
  - Scrollable content areas
  - Bottom tab navigation always visible

### Animations & Feedback
- Modal animations (fade in/out)
- Touch feedback on buttons
- Smooth transitions between states
- Clear visual states (active, disabled, etc.)

---

## 🌍 Multilingual Support

### Default Language: Arabic (العربية)
The app starts in Arabic with all UI elements translated:
- Tab names
- Button labels
- Section headings
- Menu items
- Help text
- Validation messages

### Alternative Language: English
Switch anytime from the More > Language menu

### Supported Translations
- Game terminology (Round, Winner, Loser, Score)
- UI labels (Home, Play, More, Language, About Me, Contact Me)
- Messages and instructions
- Game history labels

---

## 📊 Game Flow

```
Start App (Arabic)
    ↓
HOME TAB - View Statistics
    ↓
PLAY TAB - Add Players
    ↓
PLAY TAB - Enter Round Scores
    ↓
Check for Winner?
    ├─ NO → Next Round
    └─ YES → Winner Screen
    ↓
Play Again → Back to Add Players
    OR
HOME TAB → View Updated History
    OR
MORE TAB → Change Settings
```

---

## 🔢 Scoring Rules

- **Round Score Entry**: Players enter their score for the current round
- **Cumulative Scoring**: Scores add up across rounds
- **Elimination Threshold**: Player eliminated if total score > 30
- **Win Condition**: Last remaining player wins
- **History**: Game results saved with winner, round count, and date

---

## 🎯 Tips for Users

1. **Setup**: Add at least 2 players before starting
2. **Round Entry**: Enter scores for all active players
3. **Elimination**: Players with score > 30 move to the loser panel
4. **Winner**: When only 1 player remains, they're declared the winner
5. **History**: View past games from the Home tab
6. **Language**: Change language anytime from More > Language

---

## 🚀 Keyboard Behavior

- **Player Input**: Standard keyboard for text entry
- **Score Input**: Numeric keyboard for easier number entry
- **Keyboard Avoidance**: Content adjusts when keyboard appears
- **Safe Area**: All content respects safe area on notched devices

---

## 📱 Responsive Design

The app is optimized for:
- Various phone sizes
- Tablet displays
- Different screen orientations
- Notched and non-notched devices
- Both iOS and Android platforms

---

For more information, see [README.md](./README.md)
