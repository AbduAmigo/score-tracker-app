# 🎯 Score Tracker App - Complete Feature Guide

## Quick Start

### Running the App
```bash
cd score-tracker-app
npm install
npm start

# Then:
# - Press 'a' for Android
# - Press 'i' for iOS
# - Press 'w' for Web
# - Scan QR code with Expo Go
```

---

## 🎮 APP STRUCTURE

### Navigation
The app uses a **2-tab bottom navigation**:

```
┌─────────────────────────────────┐
│                                 │
│       PLAY TAB CONTENT          │
│                                 │
├─────────────────────────────────┤
│  🎮 PLAY  │  ⋯ MORE             │
└─────────────────────────────────┘
```

---

## 📍 TAB 1: PLAY (🎮)

### Screen 1: Player Setup
**When**: First time, or after winning
**Shows**:
- Header with emoji, title, and subtitle
- Text input for player names
- "+" button to add players
- List of added players with numbers
- "Start Game" button (disabled until 2+ players)
- Helper text if < 2 players

**Player List Items**:
- Numbered badge (colored blue)
- Player name
- Green checkmark (✓)
- Left blue border

### Screen 2: Game Playing
**When**: During active game
**Shows**:
- Round header with emoji, number, player count
- Active players list with score input
- Eliminated players section
- "End Round" and "Reset Game" buttons

**Active Player Row**:
- Ranked number in blue circle
- Player name
- Current total score
- Score input field (highlights if negative)

### Screen 3: Winner Celebration
**When**: All players eliminated
**Shows**:
- Crown emoji (👑)
- Celebration emoji (🎉)
- Winner title with trophy (🏆)
- Winner name in golden border container
- Game statistics (rounds, score, players)
- Celebration effects (confetti)
- Action buttons

---

## ⚙️ TAB 2: MORE (⋯)

### Header
- Large emoji (⚙️)
- Title text

### Menu Items

#### 1️⃣ 🌐 Language
**Shows**: Current language with flag
- 🇸🇦 العربية (if in English)
- 🇺🇸 English (if in Arabic)

#### 2️⃣ 👤 About Me
**Shows**: Brief developer info
**Content**: Professional developer information

#### 3️⃣ 📱 Contact Me
**Shows**: Social media handle
**Content**: @abdu_amigo

### App Info
- App name: Score Tracker
- Version: v2.0
- Branding emoji: 🎮

---

## 🌐 LANGUAGE SUPPORT

### Arabic (عربية) - DEFAULT
- **Direction**: RTL (Right-to-Left)
- **All Elements**: Properly mirrored
- **Complete Translation**: All UI elements

### English
- **Direction**: LTR (Left-to-Right)
- **Standard Layout**: Normal left-to-right flow
- **Full Translation**: Every Arabic string has English equivalent

### Dynamic Switching
- Change language anytime
- Layout adjusts instantly
- No page reload needed

---

## 🎯 GAME MECHANICS

### Scoring System
```
Each Round:
1. Players enter their round score
   - Can be POSITIVE (+5, +14, +12)
   - Can be NEGATIVE (-3, -5, -10)
   
2. Score added to total
   - Total = Previous Total + Round Score
   
3. Check elimination
   - If Total ≥ 30 → Player eliminated
   - Removed from active players
   
4. Continue rounds
   - Until all players eliminated
   
5. Winner
   - Last remaining player wins
   - OR lowest score if all eliminated
```

### Win Conditions
1. **Last Standing**: When only 1 active player remains
2. **All Eliminated**: When all players reach ≥ 30
   - Winner = Player with lowest final score

---

## 🎨 COLOR SCHEME

| Color | Code | Usage |
|-------|------|-------|
| Primary Blue | #3498db | Buttons, badges |
| Success Green | #2ecc71 | Add button |
| Warning Orange | #f39c12 | Reset button |
| Danger Red | #e74c3c | End round |
| Dark Text | #333 | Main text |
| Light Text | #999 | Subtitles |

---

## 🔄 GAME FLOW

```
START
  ↓
┌─────────────────┐
│ Player Setup    │
└─────────────────┘
  ↓
┌─────────────────┐
│ Game Playing    │
│ Rounds 1,2,3... │
└─────────────────┘
  ↓
┌─────────────────┐
│ Winner Screen   │
│ Celebration     │
└─────────────────┘
  ↓
┌─────────────────┐
│ Play Again or   │
│ More Settings   │
└─────────────────┘
```

---

## 📊 STATE MANAGEMENT

The app tracks:
- `players` - Array of player objects
- `round` - Current round number
- `winner` - Winner object when game ends
- `language` - Current language (ar/en)
- `activeTab` - Current tab (play/more)
- `gameHistory` - Array of completed games
- `roundScores` - Current round's scores

---

## 🔧 KEY FEATURES

### ✅ Smart Score Tracking
- Handles positive and negative scores
- Real-time total calculation
- Automatic elimination at ≥ 30

### ✅ RTL/LTR Support
- Automatic layout direction
- Proper text alignment
- Mirrored UI elements

### ✅ Game Reset
- Confirmation dialog
- Clears current game
- Preserves history

### ✅ Professional UI
- Modern design
- Smooth animations
- Color-coded elements
- Responsive layout

### ✅ Accessibility
- Clear buttons
- Readable fonts
- Good contrast
- Intuitive navigation

---

## 🚀 PERFORMANCE

- **Fast**: Optimized rendering
- **Smooth**: No jank or lag
- **Responsive**: Quick touch feedback
- **Efficient**: Good memory usage
- **Battery Friendly**: Minimal drain

---

## 📱 DEVICE COMPATIBILITY

✅ Works on:
- iPhone 6+, 7, 8, X, 11, 12, 13, 14, 15
- iPad (all sizes)
- Android 6+ phones and tablets
- Modern web browsers
- Notched devices (iPhone X+)

---

## 🎮 PLAYING TIPS

1. **Strategy**: Mix positive and negative scores
2. **Timing**: Watch when players approach 30
3. **Team Play**: Coordinate with other players
4. **Language**: Try both Arabic and English
5. **Reset**: Use reset if you make mistakes

---

## 📞 SUPPORT

**Developer**: Abdalla A (@abdu_amigo)
**Social**: @abdu_amigo on all platforms

---

**Version**: 2.1 (Premium Edition)
**Last Updated**: November 16, 2025
**Status**: Production Ready ✅

Enjoy your gaming experience! 🎮✨
