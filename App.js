import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';   // << NEW

const MAX_PLAYERS = 5;
const MAX_SCORE = 30;

// Translations
const translations = {
  ar: {
    startAppTitle: 'تتبع النقاط',
    startAppSubtitle: 'ابدأ لعبتك بطريقة سهلة وجميلة',
    startButton: 'ابدأ',
    home: 'الصفحة الرئيسية',
    play: 'لعب',
    more: 'المزيد',
    totalGames: 'إجمالي الألعاب',
    playerName: 'اسم اللاعب',
    status: 'الحالة',
    winner: 'الفائز',
    loser: 'الخاسر',
    round: 'الجولة',
    startPlay: 'ابدأ اللعبة',
    enterName: 'أدخل اسم اللاعب',
    addMore: 'إضافة',
    addMorePlayers: 'إضافة المزيد من اللاعبين',
    startGame: 'بدء اللعبة',
    endRound: 'إنهاء الجولة',
    score: 'النقاط',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    aboutMe: 'عني',
    contact: 'تواصل معي',
    aboutContent: 'مرحبا! أنا مطور تطبيقات متخصص في تطوير واجهات مستخدم جميلة.',
    socialMedia: '@abdu_amigo',
    gamesPlayed: 'الألعاب المنتهية',
    noData: 'لا توجد بيانات',
    resetGame: 'إعادة تعيين اللعبة',
    resetConfirmTitle: 'مسح النتائج',
    resetConfirmMessage: 'هل أنت متأكد من إعادة الضبط بالكامل؟',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    active: 'نشط',
    close: 'إغلاق',
  },
  en: {
    startAppTitle: 'Score Tracker',
    startAppSubtitle: 'Start your game smoothly & beautifully',
    startButton: 'Start',
    home: 'Home',
    play: 'Play',
    more: 'More',
    totalGames: 'Total Games Played',
    playerName: 'Player Name',
    status: 'Status',
    winner: 'Winner',
    loser: 'Loser',
    round: 'Round',
    startPlay: 'Start Game',
    enterName: 'Enter Player Name',
    addMore: 'Add More',
    addMorePlayers: 'Add More Players',
    startGame: 'Start Game',
    endRound: 'End Round',
    score: 'Score',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    aboutMe: 'About Me',
    contact: 'Contact Me',
    aboutContent: 'Hello! I build modern and beautiful mobile applications.',
    socialMedia: '@abdu_amigo',
    gamesPlayed: 'Completed Games',
    noData: 'No Data',
    resetGame: 'Reset Game',
    resetConfirmTitle: 'Clear Results',
    resetConfirmMessage: 'Are you sure you want to reset the game?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    active: 'Active',
    close: 'Close',
  },
};

export default function App() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [roundScores, setRoundScores] = useState({});
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [welcomeDone, setWelcomeDone] = useState(false);   // << NEW welcome screen
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState(null);
  const [activeTab, setActiveTab] = useState('play');
  const [language, setLanguage] = useState('ar');
  const [gameHistory, setGameHistory] = useState([]);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const t = translations[language];

  const renderWelcomeScreen = () => (
    <LinearGradient
      colors={['#0F2027', '#2C5364']}
      style={styles.welcomeContainer}
    >
      <Text style={styles.welcomeEmoji}>🎮</Text>

      <Text style={styles.welcomeTitle}>{t.startAppTitle}</Text>
      <Text style={styles.welcomeSubtitle}>{t.startAppSubtitle}</Text>

      <TouchableOpacity
        style={styles.welcomeButton}
        onPress={() => setWelcomeDone(true)}
      >
        <Text style={styles.welcomeButtonText}>{t.startButton}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const addPlayer = () => {
    if (newPlayerName.trim() === '') {
      Alert.alert('تحذير', 'اسم اللاعب لا يمكن أن يكون فارغاً.');
      return;
    }
    if (players.length >= MAX_PLAYERS) {
      Alert.alert('عدد كبير جداً من اللاعبين', `يمكنك فقط إضافة حتى ${MAX_PLAYERS} لاعبين.`);
      return;
    }
    setPlayers([...players, {
      id: Date.now(),
      name: newPlayerName,
      score: 0,
      isOut: false,
    }]);
    setNewPlayerName('');
  };

  const startGame = () => {
    if (players.length < 2) {
      Alert.alert('عدد لاعبين قليل', 'الرجاء إضافة لاعبين على الأقل 2.');
      return;
    }
    setActiveTab('play');
    setIsGameStarted(true);
  };

  const handleScoreChange = (id, value) => {
    setRoundScores({
      ...roundScores,
      [id]: value,
    });
  };

  const endRound = () => {
    // Update all player scores with round scores (can be positive or negative)
    const updatedPlayers = players.map(player => {
      const scoreInput = roundScores[player.id] || '0';
      const scoreToAdd = parseInt(scoreInput, 10);
      const newTotalScore = player.score + scoreToAdd;
      
      return {
        ...player,
        score: newTotalScore,
        isOut: newTotalScore >= MAX_SCORE, // >= instead of > to match the 30 threshold exactly
      };
    });

    const activePlayers = updatedPlayers.filter(p => !p.isOut);

    // Check if only 1 player remains (all others eliminated) - show winner immediately
    if (activePlayers.length === 1) {
      // Last player standing is the winner!
      const winner = activePlayers[0];
      setPlayers(updatedPlayers);
      setWinner(winner);
      
      // Save game to history
      const gameResult = {
        id: Date.now(),
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
        winner: winner.name,
        round: round,
        players: players.length,
      };
      setGameHistory([...gameHistory, gameResult]);
    } else if (activePlayers.length === 0) {
      // All players are eliminated - find the one with the lowest final score as winner
      const winner = updatedPlayers.reduce((prev, current) => 
        prev.score < current.score ? prev : current
      );
      setPlayers(updatedPlayers);
      setWinner(winner);
      
      // Save game to history
      const gameResult = {
        id: Date.now(),
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US'),
        winner: winner.name,
        round: round,
        players: players.length,
      };
      setGameHistory([...gameHistory, gameResult]);
    } else {
      // Game continues to next round
      setPlayers(updatedPlayers);
      setRound(round + 1);
      setRoundScores({});
    }
  };

  const resetGame = () => {
    Alert.alert(
      t.resetConfirmTitle,
      t.resetConfirmMessage,
      [
        {
          text: t.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t.confirm,
          onPress: () => {
            setPlayers([]);
            setNewPlayerName('');
            setRoundScores({});
            setIsGameStarted(false);
            setRound(1);
            setWinner(null);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const restartGame = () => {
    setPlayers([]);
    setNewPlayerName('');
    setRoundScores({});
    setIsGameStarted(false);
    setRound(1);
    setWinner(null);
  };

  const activePlayers = players.filter(p => !p.isOut);
  const losers = players.filter(p => p.isOut);

  // --- Home Tab ---
  const renderHomeTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.statCard}>
        <Text style={styles.statIcon}>🎮</Text>
        <Text style={styles.statLabel}>{t.totalGames}</Text>
        <Text style={styles.statNumber}>{gameHistory.length}</Text>
      </View>

      <Text style={styles.sectionTitle}>{t.gamesPlayed}</Text>
      {gameHistory.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>{t.noData}</Text>
        </View>
      ) : (
        <FlatList
          scrollEnabled={false}
          data={gameHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.gameHistoryItem}>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>{t.winner}:</Text>
                <Text style={styles.historyValue}>{item.winner}</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>{t.round}:</Text>
                <Text style={styles.historyValue}>{item.round}</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyLabel}>📅</Text>
                <Text style={styles.historyValue}>{item.date}</Text>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );

  // --- Play Tab ---
  const renderPlayTab = () => {
    if (isGameStarted) {
      return renderGameScreen();
    }

    if (winner) {
      return renderWinnerScreen();
    }

    return renderPlayerSetup();
  };

  const renderPlayerSetup = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.tabContent}
    >
      <ScrollView contentContainerStyle={styles.setupContainer}>
        {/* Header Section */}
        <View style={styles.playHeaderSection}>
          <Text style={styles.playHeaderEmoji}>🎮</Text>
          <Text style={styles.playHeaderTitle}>{t.startPlay}</Text>
          <Text style={styles.playHeaderSubtitle}>{t.addMorePlayers}</Text>
        </View>

        {/* Player Input Section */}
        <View style={styles.inputSectionContainer}>
          <Text style={styles.sectionLabel}>{t.playerName}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={t.enterName}
              placeholderTextColor="#bbb"
              value={newPlayerName}
              onChangeText={setNewPlayerName}
            />
            <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Players List Section */}
        <View style={styles.playersListSectionContainer}>
          <Text style={styles.sectionLabel}>
            👥 {players.length}/{MAX_PLAYERS} {t.playerName}
          </Text>
          
          {players.length === 0 ? (
            <View style={styles.emptyPlayersContainer}>
              <Text style={styles.emptyPlayersText}>🤔</Text>
              <Text style={styles.emptyPlayersMessage}>
                {language === 'ar' ? 'ابدأ بإضافة اللاعبين' : 'Start adding players'}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.playerList} scrollEnabled={players.length > 4}>
              {players.map((player, index) => (
                <View key={player.id} style={styles.playerItem}>
                  <View style={styles.playerItemBadge}>
                    <Text style={styles.playerItemNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.playerItemName}>{player.name}</Text>
                  <Text style={styles.playerItemIcon}>✓</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startGameButton, players.length < 2 && styles.disabledButton]}
          onPress={startGame}
          disabled={players.length < 2}
        >
          <Text style={styles.buttonText}>
            {players.length < 2 ? '⚠️' : '▶️'} {t.startGame}
          </Text>
        </TouchableOpacity>

        {/* Helper Text */}
        {players.length < 2 && (
          <Text style={styles.helperText}>
            {language === 'ar' ? 'أضف 2 لاعب على الأقل' : 'Add at least 2 players'}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderGameScreen = () => (
    <KeyboardAvoidingView
      style={styles.tabContent}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        {/* Round Header */}
        <View style={styles.roundHeader}>
          <Text style={styles.roundEmoji}>🎯</Text>
          <Text style={styles.roundTitle}>{t.round} {round}</Text>
          <Text style={styles.roundSubtitle}>
            {activePlayers.length} {language === 'ar' ? 'لاعبين نشطين' : 'active players'}
          </Text>
        </View>

        {/* Active Players Section */}
        <View style={styles.gameContentSection}>
          <Text style={styles.sectionLabel}>🏃 {t.active}</Text>
          <View style={styles.activePlayersList}>
            {activePlayers.map((player, index) => (
              <View key={player.id} style={styles.playerRow}>
                <View style={styles.playerInfo}>
                  <View style={styles.playerRankBadge}>
                    <Text style={styles.playerRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.playerDetails}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerCurrentScore}>
                      {t.score}: {player.score}
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={[
                    styles.scoreInput,
                    { borderColor: parseInt(roundScores[player.id] || 0) < 0 ? '#e74c3c' : '#3da49d' }
                  ]}
                  placeholder="0"
                  placeholderTextColor="#ccc"
                  keyboardType="numeric"
                  value={roundScores[player.id]}
                  onChangeText={(text) => handleScoreChange(player.id, text)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Eliminated Players Section */}
        {losers.length > 0 && (
          <View style={styles.gameContentSection}>
            <Text style={styles.sectionLabel}>❌ {t.loser} ({losers.length})</Text>
            <View style={styles.loserPanel}>
              {losers.map((player) => (
                <View key={player.id} style={styles.loserItem}>
                  <Text style={styles.loserName}>{player.name}</Text>
                  <Text style={styles.loserScore}>{player.score}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.gameButtonsContainer}>
          <TouchableOpacity style={styles.endRoundButton} onPress={endRound}>
            <Text style={styles.buttonText}>✓ {t.endRound}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetGameButton} onPress={resetGame}>
            <Text style={styles.buttonText}>🔄 {t.resetGame}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderWinnerScreen = () => (
    <View style={styles.tabContent}>
      <ScrollView contentContainerStyle={styles.winnerScrollContent}>
        <View style={styles.winnerContainer}>
          {/* Crown and Celebration */}
          <Text style={styles.crownEmoji}>👑</Text>
          <Text style={styles.winnerEmoji}>🎉</Text>
          
          {/* Winner Title */}
          <Text style={styles.winnerTitle}>{t.winner}! 🏆</Text>
          
          {/* Winner Name with special styling */}
          <View style={styles.winnerNameContainer}>
            <Text style={styles.winnerName}>{winner?.name}</Text>
          </View>

          {/* Game Stats */}
          <View style={styles.gameStatsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t.round}</Text>
              <Text style={styles.statValue}>{round}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t.score}</Text>
              <Text style={styles.statValue}>{winner?.score}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>👥</Text>
              <Text style={styles.statValue}>{players.length}</Text>
            </View>
          </View>

          {/* Celebration Effects */}
          <View style={styles.celebrationContainer}>
            <Text style={styles.confetti}>✨ ✨ ✨</Text>
            <Text style={styles.confetti}>🎊 🎊 🎊</Text>
            <Text style={styles.confetti}>✨ ✨ ✨</Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.winnerButtonsContainer}>
            <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
              <Text style={styles.buttonText}>🔄 {t.startGame}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backMoreButton} onPress={() => {
              setActiveTab('more');
              resetGame();
            }}>
              <Text style={styles.buttonText}>⋯ {t.more}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  // --- More Tab ---
  const renderMoreTab = () => (
    <ScrollView style={styles.tabContent} contentContainerStyle={styles.moreTabContainer}>
      {/* Header */}
      <View style={styles.moreHeaderSection}>
        <Text style={styles.moreHeaderEmoji}>⚙️</Text>
        <Text style={styles.moreHeaderTitle}>{t.more}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.moreMenuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowLanguageModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>🌐</Text>
            <View>
              <Text style={styles.menuText}>{t.language}</Text>
              <Text style={styles.menuSubtext}>
                {language === 'ar' ? '🇸🇦 العربية' : '🇺🇸 English'}
              </Text>
            </View>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowAboutModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>👤</Text>
            <View>
              <Text style={styles.menuText}>{t.aboutMe}</Text>
              <Text style={styles.menuSubtext}>
                {language === 'ar' ? 'عن المطور' : 'About Developer'}
              </Text>
            </View>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setShowContactModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuIcon}>📱</Text>
            <View>
              <Text style={styles.menuText}>{t.contact}</Text>
              <Text style={styles.menuSubtext}>@abdu_amigo</Text>
            </View>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.appInfoSection}>
        <Text style={styles.appInfoEmoji}>🎮</Text>
        <Text style={styles.appInfoTitle}>Score Tracker</Text>
        <Text style={styles.appInfoVersion}>v2.0</Text>
      </View>
    </ScrollView>
  );

  // --- Modals ---
  const renderLanguageModal = () => (
    <Modal visible={showLanguageModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { direction: language === 'ar' ? 'rtl' : 'ltr' }]}>
          <Text style={styles.modalTitle}>{t.language}</Text>
          
          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              setLanguage('ar');
              setShowLanguageModal(false);
            }}
          >
            <Text style={styles.languageText}>🇸🇦 {t.arabic}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.languageOption}
            onPress={() => {
              setLanguage('en');
              setShowLanguageModal(false);
            }}
          >
            <Text style={styles.languageText}>🇺🇸 {t.english}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.closeButtonText}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderAboutModal = () => (
    <Modal visible={showAboutModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { direction: language === 'ar' ? 'rtl' : 'ltr' }]}>
          <Text style={styles.modalTitle}>{t.aboutMe}</Text>
          <Text style={styles.aboutText}>{t.aboutContent}</Text>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAboutModal(false)}
          >
            <Text style={styles.closeButtonText}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderContactModal = () => (
    <Modal visible={showContactModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { direction: language === 'ar' ? 'rtl' : 'ltr' }]}>
          <Text style={styles.modalTitle}>{t.contact}</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>{t.socialMedia}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowContactModal(false)}
          >
            <Text style={styles.closeButtonText}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  
  
  return (
    <SafeAreaView style={[styles.safeArea, { direction: language === 'ar' ? 'rtl' : 'ltr' }]}>
      <View style={styles.tabsContainer}>
        {/* Tabs Content */}
        {activeTab === 'play' && renderPlayTab()}
        {activeTab === 'more' && renderMoreTab()}

        {/* Language Modal */}
        {renderLanguageModal()}

        {/* About Modal */}
        {renderAboutModal()}

        {/* Contact Modal */}
        {renderContactModal()}
      </View>

      {/* Tab Navigation - Only Play and More */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'play' && styles.activeTabButton]}
          onPress={() => setActiveTab('play')}
        >
          <Text style={styles.tabIcon}>🎮</Text>
          <Text style={[styles.tabLabel, activeTab === 'play' && styles.activeTabLabel]}>
            {t.play}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'more' && styles.activeTabButton]}
          onPress={() => setActiveTab('more')}
        >
          <Text style={styles.tabIcon}>⋯</Text>
          <Text style={[styles.tabLabel, activeTab === 'more' && styles.activeTabLabel]}>
            {t.more}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fffe',
  },
  tabsContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  
  // Home Tab
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#3da49d',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  gameHistoryItem: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3da49d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  historyLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  historyValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
  },

  // Play Tab
  setupContainer: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  playHeaderSection: {
    alignItems: 'center',
    marginBottom: 35,
    paddingTop: 10,
  },
  playHeaderEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  playHeaderTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  playHeaderSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  playHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  playTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  playSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  inputSectionContainer: {
    marginBottom: 25,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#ffbf38',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffbf38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playersListSectionContainer: {
    marginBottom: 30,
  },
  emptyPlayersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyPlayersText: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyPlayersMessage: {
    fontSize: 14,
    color: '#999',
  },
  playerList: {
    marginBottom: 20,
  },
  playerItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3da49d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  playerItemBadge: {
    backgroundColor: '#3da49d',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  playerItemNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  playerItemIcon: {
    fontSize: 16,
    color: '#ffbf38',
    fontWeight: 'bold',
  },
  playerNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 15,
    minWidth: 30,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  startGameButton: {
    backgroundColor: '#3da49d',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#3da49d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    opacity: 0.7,
  },
  helperText: {
    textAlign: 'center',
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '500',
  },

  // Game Screen
  roundHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#3da49d',
  },
  roundEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  roundTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  roundSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  gameContentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
  },
  activePlayersList: {
    marginTop: 10,
  },
  playerRankBadge: {
    backgroundColor: '#3da49d',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playerRankText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3da49d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerDetails: {
    marginLeft: 5,
  },
  playerCurrentScore: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  scoreInput: {
    width: 70,
    borderWidth: 2,
    borderColor: '#3da49d',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  startGameButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },

  // Game Screen
  roundHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  roundTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  activePlayersList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerDetails: {
    marginLeft: 12,
  },
  playerScore: {
    fontSize: 13,
    color: '#999',
    marginTop: 3,
  },
  scoreInput: {
    width: 70,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: '#f9f9f9',
  },
  endRoundButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  resetGameButton: {
    backgroundColor: '#ffbf38',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#ffbf38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  gameButtonsContainer: {
    flexDirection: 'column',
    gap: 10,
  },

  // Loser Panel
  loserPanel: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#721c24',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 12,
  },
  loserItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loserName: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  loserScore: {
    color: '#666',
    fontSize: 14,
  },

  // Winner Screen
  winnerScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  winnerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  crownEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  winnerEmoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  winnerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffbf38',
    marginBottom: 20,
  },
  winnerNameContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 3,
    borderColor: '#ffbf38',
    width: '100%',
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  gameStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3da49d',
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  confetti: {
    fontSize: 28,
    marginVertical: 5,
    letterSpacing: 8,
  },
  winnerButtonsContainer: {
    flexDirection: 'column',
    gap: 15,
    width: '100%',
  },
  playAgainButton: {
    backgroundColor: '#3da49d',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#3da49d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backMoreButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // More Tab
  moreTabContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  moreHeaderSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  moreHeaderEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  moreHeaderTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  moreMenuContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3da49d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  menuSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  menuArrow: {
    fontSize: 24,
    color: '#3da49d',
    fontWeight: 'bold',
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appInfoEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  appInfoVersion: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },

  // Tab Navigation
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3da49d',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#3da49d',
    fontWeight: '600',
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  aboutText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#3da49d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});