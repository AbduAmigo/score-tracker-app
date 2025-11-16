- Author: Abdalla A (@abdu_amigo)
- Full stack developer / Software Engineer
- LinkedIn: https://linkedin.com/in/abduamigo

# 🎯 Score Tracker App - Premium Edition

A modern, feature-rich mobile app built with **React Native** and **Expo** for tracking game scores. The app features an elegant UI, multi-language support (Arabic/English), RTL/LTR layout support, and intelligent game logic with real-time score tracking.

## ✨ Key Features

### 🎮 **Play Tab - Game Management**
- **Player Setup**: Add up to 5 players with smooth input experience
- **Real-Time Score Tracking**: Enter positive or negative scores each round
- **Smart Elimination**: Players eliminated when score ≥ 30
- **Round Management**: View active players and eliminated players
- **Winner Announcement**: Automatic winner selection (last standing player)
- **Reset Option**: Clear game and start fresh anytime
- **Enhanced Game Screen**: Professional UI with round counter and player rankings

### ⚙️ **More Tab - Settings & Info**
- **🌐 Language Support**
  - Arabic (عربية) - RTL Layout - Default
  - English - LTR Layout
  - Instant language switching with full UI adaptation

- **👤 About Developer**
  - Professional developer information
  - Specialization details

- **📱 Contact Information**
  - Social media: @abdu_amigo
  - Easy access to developer

### 🌍 **RTL/LTR Support**
- **Arabic (عربية)**: Full RTL (Right-to-Left) support
  - Default app language
  - Proper text direction for all components
  - RTL-optimized layouts and navigation
  
- **English**: Full LTR (Left-to-Right) support
  - All UI elements properly aligned
  - Standard left-to-right navigation

- **Dynamic Direction**: Layout automatically adapts when language changes

### 🎨 **Premium UI/UX**
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Works perfectly on all screen sizes and devices
- **Visual Feedback**: Color-coded scores, badges, and status indicators
- **Smooth Transitions**: Professional animations and transitions
- **Accessible**: High contrast, readable fonts, intuitive navigation

### 🏆 **Winner Screen**
- **Celebration Effects**: Emojis and visual effects (👑, 🎉, ✨, 🎊)
- **Game Statistics**: Final score, rounds played, player count
- **Professional Display**: Winner's name highlighted in special container
- **Action Buttons**: Quick options to play again or access more settings

### 📊 **Game Statistics**
- **Game History**: Track all completed games
- **Winner Records**: See who won previous matches
- **Game Date**: Timestamp for each completed game
- **Player Count**: Remember team sizes

## 🎯 Game Rules

| Condition | Action |
|-----------|--------|
| Score < 30 | Player remains active |
| Score ≥ 30 | Player is eliminated |
| Positive Score | Increases total (risk of elimination) |
| Negative Score | Decreases total (strategic move) |
| Last Player Standing | Winner! |

### Example Game Flow
```
Ahmed: +14 (Total: 14) ✓ Active
Mohamed: +12 (Total: 12) ✓ Active
Sara: -3 (Total: -3) ✓ Active
Esra: +17 (Total: 17) ✓ Active
        ↓ End Round
Esra: +20 (Total: 37) ❌ Eliminated
        ↓ Continues...
Mohamed: Wins with score 15 🏆
```

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app (Android) or Camera app (iOS)

### Installation & Setup

```bash
# Clone repository
git clone <repository-url>
cd score-tracker-app

# Install dependencies
npm install

# Start development server
npm start

# Run on:
# - Android: Press 'a'
# - iOS: Press 'i'
# - Web: Press 'w'
# - Expo Go: Scan QR code
```

## 📱 Supported Platforms

- ✅ iOS (iPhone, iPad)
- ✅ Android (phones, tablets)
- ✅ Web (browsers)
- ✅ All screen sizes
- ✅ RTL/LTR languages

## 🛠️ Technology Stack

- **React Native 0.81.4**: Cross-platform mobile framework
- **Expo ~54.0.9**: Development platform
- **React 19.1.0**: UI library
- **JavaScript/JSX**: Programming language
- **Platform APIs**: Native device features

## 📋 Navigation

The app features a simple **2-tab navigation**:

| Tab | Icon | Features |
|-----|------|----------|
| **Play** | 🎮 | Game setup, playing, and winner display |
| **More** | ⋯ | Language, about, contact settings |

## 🌐 Language Support

### Arabic (العربية)
- **Default Language**
- **Text Direction**: Right-to-Left (RTL)
- **Coverage**: All UI elements, buttons, labels, and messages

### English
- **Alternative Language**
- **Text Direction**: Left-to-Right (LTR)
- **Full Translation**: Complete app interface

### Switch Languages
1. Tap **More (⋯)** tab
2. Select **🌐 Language**
3. Choose **العربية** or **English**
4. UI instantly updates

## 🎮 How to Play

1. **Open App** → Defaults to Play tab
2. **Add Players** → Enter names (2-5 players)
3. **Start Game** → Tap "Start Game" button
4. **Enter Scores** → Each player's round score (+ or -)
5. **End Round** → Updates totals and eliminates players
6. **Celebrate Winner** → Last standing player wins!
7. **Play Again** → Start fresh or change players

## 💡 Scoring Tips

- **Positive Scores**: Safe for early rounds, risky near 30
- **Negative Scores**: Strategic play to stay below 30
- **Mixed Strategy**: Combine positive and negative scores
- **Team Play**: Coordinate with other players strategically

## 🎨 UI Components

### Buttons
- **Start Game**: Blue, gradient shadow
- **End Round**: Red, action button
- **Reset Game**: Orange, safety option
- **Play Again**: Dark blue, primary action
- **More Menu**: Red, secondary action

### Visual Indicators
- **Player Numbers**: Colored badges (1, 2, 3...)
- **Score Input**: Blue border, highlighted for input
- **Eliminated Players**: Gray background with red text
- **Winner**: Gold border, special container
- **Language**: Flag emoji indicators

## 📞 Contact & Support

**Developer:** Abdalla A
- **Username:** @abdu_amigo
- **Social Media:** Available in app (More > Contact Me)
- **LinkedIn:** https://linkedin.com/in/abduamigo

## 🔄 Version History

### v2.0 (Current - Premium)
- ✨ Enhanced game logic (positive/negative scores)
- ✨ RTL/LTR support for Arabic and English
- ✨ Reset game feature with confirmation
- ✨ Removed Home tab, focused 2-tab navigation
- ✨ Premium winner screen with celebrations
- ✨ Better UI/UX across all screens
- ✨ Game statistics tracking
- ✨ Professional menu system
- ✨ Improved button styles with shadows
- ✨ Better player management interface

### v1.0 (Original)
- Basic score tracking
- Simple player management
- Single game flow

## 📝 Tips for Best Experience

1. **Language**: Switch to Arabic for right-to-left experience
2. **Team Size**: 3-4 players recommended for optimal gameplay
3. **Scoring**: Mix positive and negative for strategy
4. **Reset**: Use reset button if you make mistakes
5. **History**: Check previous wins from More menu

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't start game | Add at least 2 players |
| Text direction wrong | Switch language and back |
| Game won't end | Check if all players ≥ 30 |
| Can't see buttons | Scroll down if needed |
| App crashes | Reinstall via `npm install` |

## 📄 License

0BSD (Public Domain)

## 🎯 Future Roadmap

- [ ] Persistent storage for game history
- [ ] Leaderboard system
- [ ] Multiplayer online mode
- [ ] Custom game rules
- [ ] Sound effects and celebrations
- [ ] Dark mode theme
- [ ] Player statistics
- [ ] Export/share game results

---

**Enjoy tracking scores with your friends!** 🎮✨

Made with ❤️ by Abdalla A (@abdu_amigo)

The entire app is contained within a single file, `App.js`, to maintain simplicity and ease of use.

  * `App.js`: Contains all the application's code, including state management, game logic, and UI components.

## 📄 License

This project is open-source and available under the MIT License.