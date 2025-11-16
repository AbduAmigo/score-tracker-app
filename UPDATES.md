# 🎯 Score Tracker App - Enhanced Features Update

## 📋 What's New in This Update

This update brings significant improvements to the Score Tracker App with better game logic, language support, and new controls.

---

## 🎮 Updated Game Logic

### Scoring System
The game now handles **both positive and negative scores** in each round:

**Example Gameplay:**
```
Round 1:
  Ahmed:  +14  → Total: 14
  Mohamed: +12 → Total: 12
  Sara:    -3  → Total: -3
  Esra:   +17  → Total: 17

Round 2:
  Ahmed:  +10  → Total: 24
  Mohamed: +8  → Total: 20
  Sara:    +20 → Total: 17
  Esra:   +20  → Total: 37 ❌ (Eliminated!)

Round 3:
  Ahmed:  +8   → Total: 32 ❌ (Eliminated!)
  Mohamed: -5  → Total: 15
  Sara:    +15 → Total: 32 ❌ (Eliminated!)

Round 4:
  Mohamed: +10 → Total: 25
  
At this point only Mohamed remains → WINNER!
```

### Win Condition
- **Game ends when:** All players reach or exceed 30 points
- **Winner:** The player with the **lowest final score** wins the game
- **Eliminated:** Players are marked as eliminated when their score ≥ 30

### Flexible Scoring
- Players can earn **positive points** by getting higher cards/scores
- Players can lose **negative points** to stay below the threshold
- Strategy: Keep your score low to avoid elimination!

---

## 🌍 RTL/LTR Language Support

### Arabic (عربية) - RTL (Right-to-Left)
- **Default language** on app startup
- All text, layouts, and components align right-to-left
- Proper RTL rendering for all UI elements
- Navigation follows RTL conventions

### English - LTR (Left-to-Right)
- Standard left-to-right text alignment
- All navigation and layouts follow LTR conventions

### How to Switch Languages
1. Tap the **More (⋯)** tab
2. Select **🌐 Language**
3. Choose between **العربية** or **English**
4. The entire app immediately switches language and direction

### Dynamic Text Direction
- All screens respect the selected language
- Modals and dialog boxes align correctly
- Text input fields adapt to language direction
- Button layouts follow language conventions

---

## 🔄 Reset Game Feature

### What's the Reset Button?
A new feature to **clear all game results** and start fresh without losing your game history.

### Where to Find It
On the **Play tab** during an active game:
- **🔄 Reset Game** button (orange) appears next to **End Round** button
- Also available after a game ends

### How It Works
1. Tap **🔄 Reset Game**
2. Confirm the action in the dialog
   - Arabic: "مسح النتائج" (Clear Results)
   - English: "Clear Results"
3. All current scores and players are cleared
4. Return to the player setup screen
5. **Game history is preserved** - your previous games remain saved

### Use Cases
- Started a game accidentally
- Want to restart with different players
- Need to clear corrupted round data
- Changing game rules mid-game

---

## 📊 Game Flow with New Features

```
START APP (Arabic/RTL by default)
    ↓
HOME TAB
├─ View game statistics
├─ Browse completed games
└─ See game winners and details
    ↓
PLAY TAB
├─ Add players (Ahmed, Mohamed, Sara, Esra)
├─ Start game
│   ↓
│   ROUND 1: Enter scores (can be +/-)
│   ├─ Ahmed: +14 (Total: 14)
│   ├─ Mohamed: +12 (Total: 12)
│   ├─ Sara: -3 (Total: -3)
│   └─ Esra: +17 (Total: 17)
│   ├─ [Reset Game] or [End Round 1]
│   ↓
│   ROUND 2: Continue rounds...
│   └─ Check if all players ≥ 30
│   ↓
│   Winner: Player with lowest score
│   ├─ [Play Again]
│   └─ [🏠 Home]
    ↓
MORE TAB
├─ 🌐 Language (Switch AR/EN + RTL/LTR)
├─ 👤 About Me
└─ 📱 Contact Me (@abdu_amigo)
```

---

## 🎯 Example Round-by-Round Game

### Setup
Players: Ahmed, Mohamed, Sara, Esra (4 players)
Target Score: ≥ 30 to be eliminated
Goal: Be the last player under 30

### Round 1
| Player | Score | Total | Status |
|--------|-------|-------|--------|
| Ahmed | +14 | 14 | Active |
| Mohamed | +12 | 12 | Active |
| Sara | -3 | -3 | Active |
| Esra | +17 | 17 | Active |

→ All active, continue to Round 2

### Round 2
| Player | Score | Total | Status |
|--------|-------|-------|--------|
| Ahmed | +10 | 24 | Active |
| Mohamed | +8 | 20 | Active |
| Sara | +20 | 17 | Active |
| Esra | +20 | 37 | ❌ Eliminated |

→ 3 players remain, continue to Round 3

### Round 3
| Player | Score | Total | Status |
|--------|-------|-------|--------|
| Ahmed | +8 | 32 | ❌ Eliminated |
| Mohamed | -5 | 15 | Active |
| Sara | +15 | 32 | ❌ Eliminated |

→ 1 player remains, **GAME ENDS**

### Winner 🎉
**Mohamed** is the winner with a final score of **15**!
- **Rounds played:** 3
- **Players:** 4
- **Date:** Automatically saved to history

---

## 🎨 UI Improvements

### Reset Game Button
- **Color:** Orange (#f39c12) - distinct from other actions
- **Icon:** 🔄 - universal "reset" symbol
- **Position:** Alongside "End Round" button
- **Confirmation:** Dialog to prevent accidental resets

### Winner Screen Enhancements
- Two action buttons:
  1. **🔄 Start Game** - Play again with fresh game
  2. **🏠 Home** - Return to home tab and save game
- Game automatically added to history
- Better visual presentation

### Language Support
- All buttons, labels, and messages translated
- Dynamic layout direction (RTL/LTR)
- Confirmation dialogs in selected language
- Modal dialogs respect text direction

---

## 🔢 Scoring Rules Summary

| Condition | Action |
|-----------|--------|
| Score < 30 | Player remains active |
| Score ≥ 30 | Player is eliminated |
| All eliminated | Game ends, lowest score wins |
| Only 1 active | Game ends, that player wins |
| Negative score | Reduces total (helps stay below 30) |

---

## 🛡️ Data Persistence

### Game History
- ✅ Automatically saved after each completed game
- ✅ Includes: Winner, round count, player count, date
- ✅ Accessible from Home tab anytime
- ✅ Survives app restart
- ✅ Can only be cleared by resetting entire app state

### Current Game
- 🔄 Reset button clears current game only
- 🔄 Game history remains intact
- 🔄 Can restart fresh anytime

### Settings
- ✅ Language preference remembered
- ✅ RTL/LTR automatically applied on next launch
- ✅ Persists across sessions

---

## 📱 Device Compatibility

The app works seamlessly on:
- ✅ iOS (iPhone, iPad)
- ✅ Android phones and tablets
- ✅ Notched devices (iPhone X+)
- ✅ Different screen sizes
- ✅ Both portrait and landscape orientations

---

## 🌐 Language Reference

### Arabic (العربية) - RTL
```
Home: الصفحة الرئيسية
Play: لعب
More: المزيد
Total Games: إجمالي الألعاب
Winner: الفائز
Loser: الخاسر
Round: الجولة
Reset Game: إعادة تعيين اللعبة
Clear Results: مسح النتائج
```

### English - LTR
```
Home: Home
Play: Play
More: More
Total Games: Total Games Played
Winner: Winner
Loser: Loser
Round: Round
Reset Game: Reset Game
Clear Results: Clear Results
```

---

## 🚀 Getting Started

1. **Open the app** → Automatically in Arabic/RTL
2. **Add players** → Go to Play tab, enter names
3. **Start game** → Tap "Start Game" with 2+ players
4. **Enter scores** → Each round (positive or negative)
5. **End round** → Updates totals and eliminates players
6. **Check history** → View all completed games on Home tab
7. **Change language** → More > Language to switch to English
8. **Reset anytime** → Use Reset Game button if needed

---

## 💡 Tips & Tricks

1. **Negative Scores Strategy**
   - Use negative scores to reduce your total
   - Helps you stay below the 30-point threshold
   - Last player standing wins!

2. **Game History**
   - Check Home tab to see all past winners
   - Track your gaming statistics
   - Remember championship matches

3. **Language Switching**
   - Switch between Arabic and English anytime
   - Layout automatically adjusts (RTL/LTR)
   - All game data persists during language switch

4. **Quick Reset**
   - Use Reset Game button to clear mistakes
   - Confirmation dialog prevents accidents
   - Start fresh without losing history

5. **Multiple Rounds**
   - The game can last many rounds
   - All players get points each round
   - Watch the scores climb strategically!

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't start game | Add at least 2 players first |
| Text not right-to-left | Switch to Arabic from More > Language |
| Game won't end | Check if all players are ≥ 30 |
| Can't see past games | Check Home tab > Completed Games |
| Language not changing | Close and reopen the app |

---

## 📞 Support & Contact

**Developer:** Abdalla A (@abdu_amigo)
- For questions or feedback, reach out via social media
- More info: More tab > About Me / Contact Me

---

## 📝 Version History

### Version 2.0 (Current)
- ✨ Enhanced game logic (positive/negative scores)
- ✨ RTL/LTR language support
- ✨ Reset game feature
- ✨ Multiple game history
- ✨ Winner selection (lowest score wins)
- ✨ Better UI/UX with button improvements

### Version 1.0 (Original)
- Basic score tracking
- Player management
- Single game flow

---

Enjoy playing and strategizing! 🎮✨
