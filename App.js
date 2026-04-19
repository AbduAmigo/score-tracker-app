import React, { useState, useRef } from 'react';
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
  Linking,
  Dimensions,
} from 'react-native';

const MAX_PLAYERS = 10;
const MAX_SCORE = 31;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Translations ────────────────────────────────────────────────────────────
const T = {
  ar: {
    appName: 'تتبع النقاط',
    subtitle: 'ابدأ لعبتك بطريقة سهلة وجميلة',
    start: 'ابدأ',
    play: 'لعب',
    rounds: 'الجولات',
    more: 'المزيد',
    setupTitle: 'إعداد اللاعبين',
    addPlayersHint: 'ابدأ بإضافة اللاعبين',
    playerName: 'اسم اللاعب',
    enterName: 'أدخل اسم اللاعب',
    startGame: 'ابدأ اللعبة',
    roundN: 'الجولة',
    score: 'النقاط',
    total: 'المجموع',
    tapToScore: 'اضغط على اللاعب لإدخال نقاطه',
    enterScore: 'أدخل نقاط هذه الجولة',
    quickAdd: 'إضافة سريعة',
    confirm: 'تأكيد',
    cancel: 'إلغاء',
    endRound: 'إنهاء الجولة',
    resetGame: 'إعادة تعيين',
    winner: 'الفائز',
    active: 'نشط',
    out: 'خارج',
    noRounds: 'لا توجد جولات بعد',
    startFirst: 'ابدأ لعبة أولاً لتظهر الجولات هنا',
    playAgain: 'لعبة جديدة',
    gameN: 'لعبة',
    language: 'اللغة',
    aboutMe: 'عني',
    contact: 'تواصل معي',
    close: 'إغلاق',
    aboutContent:
      'أنا عبد الله أحمد، مطور تطبيقات ومواقع سوداني، بخبرة تمتد لتسع (9) سنوات في بناء وتطوير الحلول التقنية الذكية المعتمدة على الذكاء الاصطناعي (AI).',
    minPlayers: 'أضف لاعبَين على الأقل للبدء',
    maxScoreLabel: 'حد الإقصاء: 31 نقطة',
    status: 'الحالة',
    resetConfirmTitle: 'مسح اللعبة',
    resetConfirmMessage: 'هل أنت متأكد من إعادة الضبط بالكامل؟',
    rules:
      'هدف اللعبة: التخلص من جميع الأوراق بإنزالها على الطاولة في مجموعات.\n• النزول الأول يحتاج 51 نقطة أو أكثر.\n• أوراق A, K, Q, J = 10 نقاط.\n• الأوراق 2–10 بقيمتها الرقمية.\n• يمكن أن تكون النقاط سالبة (عند إضافة أوراق لمجموعات الآخرين).',
    activePlayersCount: 'لاعبون نشطون',
    english: 'English',
    arabic: 'العربية',
  },
  en: {
    appName: 'Score Tracker',
    subtitle: 'Start your game smoothly & beautifully',
    start: 'Start',
    play: 'Play',
    rounds: 'Rounds',
    more: 'More',
    setupTitle: 'Player Setup',
    addPlayersHint: 'Start adding players below',
    playerName: 'Player Name',
    enterName: 'Enter player name',
    startGame: 'Start Game',
    roundN: 'Round',
    score: 'Score',
    total: 'Total',
    tapToScore: 'Tap a player to enter their score',
    enterScore: 'Enter score for this round',
    quickAdd: 'Quick Add',
    confirm: 'Confirm',
    cancel: 'Cancel',
    endRound: 'End Round',
    resetGame: 'Reset Game',
    winner: 'Winner',
    active: 'Active',
    out: 'Out',
    noRounds: 'No rounds yet',
    startFirst: 'Start a game first to see rounds here',
    playAgain: 'New Game',
    gameN: 'Game',
    language: 'Language',
    aboutMe: 'About Me',
    contact: 'Contact Me',
    close: 'Close',
    aboutContent:
      'I am Abdullah Ahmed, a Sudanese web and application developer with nine years of comprehensive experience. I specialize in building intelligent solutions powered by AI and Machine Learning.',
    minPlayers: 'Add at least 2 players to begin',
    maxScoreLabel: 'Elimination threshold: 31 pts',
    status: 'Status',
    resetConfirmTitle: 'Reset Game',
    resetConfirmMessage: 'Are you sure you want to reset everything?',
    rules:
      'Goal: get rid of all your cards by placing them in sets on the table.\n• First play needs 51+ points.\n• A, K, Q, J = 10 points each.\n• Cards 2–10 = face value.\n• Scores can be negative (adding to others\' sets).',
    activePlayersCount: 'active players',
    english: 'English',
    arabic: 'العربية',
  },
};

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  teal: '#1D9E75',
  tealLight: '#E1F5EE',
  tealDark: '#0F6E56',
  amber: '#BA7517',
  amberLight: '#FAEEDA',
  red: '#E24B4A',
  redLight: '#FCEBEB',
  blue: '#378ADD',
  bg: '#F4FBF9',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#777',
  border: '#E0E0E0',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeId() {
  return Date.now() + Math.random();
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLangState] = useState('ar');
  const t = T[lang];

  // Screens: welcome | setup | game | winner
  const [phase, setPhase] = useState('welcome');
  const [activeTab, setActiveTab] = useState('play');

  // Players
  const [players, setPlayers] = useState([]);
  const [newName, setNewName] = useState('');
  const nameInputRef = useRef(null);

  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [roundScores, setRoundScores] = useState({}); // {id: number}
  const [currentSession, setCurrentSession] = useState(null);
  const [allSessions, setAllSessions] = useState([]);

  // Score modal
  const [scoreModal, setScoreModal] = useState(null); // {playerId}
  const [modalInput, setModalInput] = useState('');

  // Other modals
  const [langModal, setLangModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);

  const isRTL = lang === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  // ── Player setup ────────────────────────────────────────────────────────────
  const addPlayer = () => {
    const name = newName.trim();
    if (!name) return;
    if (players.length >= MAX_PLAYERS) {
      Alert.alert('', `Max ${MAX_PLAYERS} players`);
      return;
    }
    setPlayers(prev => [...prev, { id: makeId(), name, score: 0, isOut: false }]);
    setNewName('');
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  const removePlayer = id => setPlayers(prev => prev.filter(p => p.id !== id));

  // ── Game flow ────────────────────────────────────────────────────────────────
  const startGame = () => {
    if (players.length < 2) return;
    const freshPlayers = players.map(p => ({ ...p, score: 0, isOut: false }));
    setPlayers(freshPlayers);
    setCurrentRound(1);
    setRoundScores({});
    setCurrentSession({
      players: JSON.parse(JSON.stringify(freshPlayers)),
      rounds: [],
      winner: null,
    });
    setPhase('game');
    setActiveTab('play');
  };

  const openScoreModal = playerId => {
    const existing = roundScores[playerId];
    setModalInput(existing !== undefined ? String(existing) : '');
    setScoreModal({ playerId });
  };

  const quickScore = delta => {
    setModalInput(prev => {
      const cur = parseInt(prev, 10) || 0;
      return String(cur + delta);
    });
  };

  const confirmScore = () => {
    if (!scoreModal) return;
    const val = parseInt(modalInput, 10);
    setRoundScores(prev => ({ ...prev, [scoreModal.playerId]: isNaN(val) ? 0 : val }));
    setScoreModal(null);
  };

  const endRound = () => {
  const roundRecord = { roundNum: currentRound, scores: {}, totals: {} };

  let eliminatedThisRound = [];

  const updated = players.map(p => {
    if (p.isOut) {
      roundRecord.scores[p.id] = 0;
      roundRecord.totals[p.id] = p.score;
      return p;
    }

    const add = roundScores[p.id] !== undefined ? parseInt(roundScores[p.id], 10) : 0;
    const newScore = p.score + (isNaN(add) ? 0 : add);

    roundRecord.scores[p.id] = isNaN(add) ? 0 : add;
    roundRecord.totals[p.id] = newScore;

    const isOutNow = newScore >= MAX_SCORE;

    if (isOutNow && !p.isOut) {
      eliminatedThisRound.push(p);
    }

    return { ...p, score: newScore, isOut: isOutNow };
  });

  const newSession = {
    ...currentSession,
    rounds: [...(currentSession?.rounds || []), roundRecord],
  };

  const stillActive = updated.filter(p => !p.isOut);

  // 🔥 NEW LOGIC: Only end when all but one are eliminated
  if (stillActive.length === 1) {
    const winner = stillActive[0];

    const finalSession = { ...newSession, winner };
    setAllSessions(prev => [...prev, JSON.parse(JSON.stringify(finalSession))]);
    setCurrentSession(finalSession);
    setPlayers(updated);
    setPhase('winner');
    return;
  }

  // Continue game normally
  setCurrentSession(newSession);
  setPlayers(updated);
  setCurrentRound(r => r + 1);
  setRoundScores({});
};


  const confirmReset = () => {
    Alert.alert(t.resetConfirmTitle, t.resetConfirmMessage, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.confirm,
        style: 'destructive',
        onPress: () => {
          setPlayers([]);
          setNewName('');
          setRoundScores({});
          setCurrentRound(1);
          setCurrentSession(null);
          setPhase('setup');
        },
      },
    ]);
  };

  const startNewGame = () => {
    setPlayers([]);
    setNewName('');
    setRoundScores({});
    setCurrentRound(1);
    setCurrentSession(null);
    setPhase('setup');
    setActiveTab('play');
  };

  // ── Derived ──────────────────────────────────────────────────────────────────
  const activePlayers = players.filter(p => !p.isOut);
  const outPlayers = players.filter(p => p.isOut);
  const winner = currentSession?.winner;

  // ── Rounds data (combine completed sessions + current session if has rounds) ─
  const roundsSessions = [
    ...allSessions,
    ...(currentSession && currentSession.rounds.length > 0 && phase !== 'winner'
      ? [currentSession]
      : []),
  ];

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER SCREENS
  // ════════════════════════════════════════════════════════════════════════════

  const renderWelcome = () => (
    <View style={[styles.welcome, { backgroundColor: '#0F2027' }]}>
      <Text style={styles.welcomeEmoji}>🎮</Text>
      <Text style={styles.welcomeTitle}>{t.appName}</Text>
      <Text style={styles.welcomeSubtitle}>{t.subtitle}</Text>
      <TouchableOpacity style={styles.btnPrimary} onPress={() => setPhase('setup')}>
        <Text style={styles.btnPrimaryText}>▶  {t.start}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSetup = () => (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.setupContent}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.setupHeader}>
          <Text style={styles.setupTitle}>🎮 {t.setupTitle}</Text>
          <Text style={styles.setupSub}>{t.maxScoreLabel}</Text>
        </View>

        {/* Rules box */}
        <View style={styles.rulesBox}>
          <Text style={[styles.rulesText, isRTL && { textAlign: 'right' }]}>{t.rules}</Text>
        </View>

        {/* Input row */}
        <Text style={[styles.sectionLabel, isRTL && { textAlign: 'right' }]}>
          {t.playerName}  ({players.length}/{MAX_PLAYERS})
        </Text>
        <View style={[styles.inputRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <TextInput
            ref={nameInputRef}
            style={[styles.nameInput, isRTL && { textAlign: 'right' }]}
            placeholder={t.enterName}
            placeholderTextColor={C.textMuted}
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={addPlayer}
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addPlayer}>
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Player list */}
        {players.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>🤔  {t.addPlayersHint}</Text>
          </View>
        ) : (
          players.map((p, i) => (
            <View
              key={p.id}
              style={[styles.playerChip, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.playerChipNum}>
                <Text style={styles.playerChipNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.playerChipName, isRTL && { textAlign: 'right' }]}>
                {p.name}
              </Text>
              <TouchableOpacity onPress={() => removePlayer(p.id)}>
                <Text style={styles.playerChipDel}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Start button */}
        <TouchableOpacity
          style={[styles.btnPrimary, players.length < 2 && styles.btnDisabled, { marginTop: 24 }]}
          onPress={startGame}
          disabled={players.length < 2}>
          <Text style={styles.btnPrimaryText}>▶  {t.startGame}</Text>
        </TouchableOpacity>
        {players.length < 2 && (
          <Text style={styles.helperText}>{t.minPlayers}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  const renderGame = () => (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      {/* Round header */}
      <View style={styles.roundHeader}>
        <Text style={styles.roundHeaderTitle}>🎯  {t.roundN} {currentRound}</Text>
        <Text style={styles.roundHeaderSub}>
          {activePlayers.length} {t.activePlayersCount}
        </Text>
      </View>

      <View style={styles.gameBody}>
        <Text style={[styles.tapHint, isRTL && { textAlign: 'right' }]}>
          👆  {t.tapToScore}
        </Text>

        {/* Active players */}
        {activePlayers.map((p, i) => {
          const rs = roundScores[p.id];
          const hasScore = rs !== undefined;
          const scoreVal = hasScore ? parseInt(rs, 10) : null;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.playerGameRow, isRTL && { flexDirection: 'row-reverse' }]}
              activeOpacity={0.7}
              onPress={() => openScoreModal(p.id)}>
              <View style={styles.playerGameRank}>
                <Text style={styles.playerGameRankText}>{i + 1}</Text>
              </View>
              <View style={[styles.playerGameInfo, isRTL && { alignItems: 'flex-end' }]}>
                <Text style={styles.playerGameName}>{p.name}</Text>
                <Text style={styles.playerGameTotal}>
                  {t.total}: {p.score}
                </Text>
              </View>
              <Text
                style={[
                  styles.playerGameScore,
                  scoreVal !== null && scoreVal < 0 && { color: C.teal },
                  scoreVal !== null && scoreVal > 0 && { color: C.red },
                ]}>
                {hasScore
                  ? scoreVal > 0
                    ? `+${scoreVal}`
                    : String(scoreVal)
                  : '—'}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Eliminated */}
        {outPlayers.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={[styles.sectionLabel, isRTL && { textAlign: 'right' }]}>
              ❌  {t.out}
            </Text>
            {outPlayers.map(p => (
              <View
                key={p.id}
                style={[styles.playerGameRow, styles.playerGameRowOut, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.playerGameRank, { backgroundColor: '#ccc' }]}>
                  <Text style={styles.playerGameRankText}>✕</Text>
                </View>
                <View style={[styles.playerGameInfo, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.playerGameName, { color: C.textMuted }]}>
                    {p.name}
                  </Text>
                  <Text style={styles.playerGameTotal}>{t.total}: {p.score}</Text>
                </View>
                <Text style={[styles.playerGameScore, { color: C.red }]}>{p.score}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity style={[styles.btnPrimary, { marginTop: 24 }]} onPress={endRound}>
          <Text style={styles.btnPrimaryText}>✓  {t.endRound}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAmber, { marginTop: 10 }]}
          onPress={confirmReset}>
          <Text style={styles.btnPrimaryText}>🔄  {t.resetGame}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderWinner = () => (
    <ScrollView style={styles.screen} contentContainerStyle={styles.winnerContent}>
      <Text style={styles.winnerCrown}>👑</Text>
      <Text style={styles.winnerLabel}>{t.winner}!</Text>
      <View style={styles.winnerNameBox}>
        <Text style={styles.winnerName}>{winner?.name}</Text>
      </View>
      <View style={styles.winnerStats}>
        <View style={styles.winnerStat}>
          <Text style={styles.winnerStatVal}>{currentSession?.rounds?.length ?? 0}</Text>
          <Text style={styles.winnerStatLbl}>{t.roundN}s</Text>
        </View>
        <View style={styles.winnerStat}>
          <Text style={styles.winnerStatVal}>{winner?.score}</Text>
          <Text style={styles.winnerStatLbl}>{t.score}</Text>
        </View>
        <View style={styles.winnerStat}>
          <Text style={styles.winnerStatVal}>{players.length}</Text>
          <Text style={styles.winnerStatLbl}>👥</Text>
        </View>
      </View>
      <Text style={styles.confetti}>✨ 🎉 ✨</Text>
      <Text style={styles.confetti}>🎊 🏆 🎊</Text>
      <TouchableOpacity style={[styles.btnPrimary, { marginTop: 28, width: '100%' }]} onPress={startNewGame}>
        <Text style={styles.btnPrimaryText}>🔄  {t.playAgain}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btnOutline, { marginTop: 10, width: '100%' }]}
        onPress={() => setActiveTab('rounds')}>
        <Text style={styles.btnOutlineText}>📋  {t.rounds}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // ── Rounds Tab ──────────────────────────────────────────────────────────────
  const renderRoundsTab = () => {
    if (roundsSessions.length === 0 && !(currentSession?.rounds?.length)) {
      return (
        <View style={styles.noDataBox}>
          <Text style={styles.noDataEmoji}>📋</Text>
          <Text style={styles.noDataTitle}>{t.noRounds}</Text>
          <Text style={styles.noDataSub}>{t.startFirst}</Text>
        </View>
      );
    }

    const sessions = roundsSessions.length > 0 ? roundsSessions : [];

    return (
      <ScrollView style={styles.screen} horizontal={false}>
        {sessions.map((sess, si) => {
          if (!sess.rounds.length) return null;
          return (
            <View key={si} style={styles.sessionBlock}>
              <Text style={[styles.sessionTitle, isRTL && { textAlign: 'right' }]}>
                🎮 {t.gameN} {si + 1}
                {sess.winner ? `  ·  👑 ${sess.winner.name}` : ''}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View>
                  {/* Header row */}
                  <View style={[styles.tableRow, styles.tableHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Text style={[styles.thName]}>{t.playerName}</Text>
                    {sess.rounds.map(r => (
                      <Text key={r.roundNum} style={styles.thRound}>
                        {t.roundN} {r.roundNum}
                      </Text>
                    ))}
                    <Text style={styles.thTotal}>{t.total}</Text>
                    <Text style={styles.thStatus}>{t.status}</Text>
                  </View>

                  {/* Player rows */}
                  {sess.players.map(p => {
                    const lastRound = sess.rounds[sess.rounds.length - 1];
                    const finalTotal = lastRound?.totals[p.id] ?? 0;
                    const isWinner = sess.winner?.id === p.id;
                    const isOut = finalTotal >= MAX_SCORE && !isWinner;

                    return (
                      <View
                        key={p.id}
                        style={[
                          styles.tableRow,
                          isWinner && styles.tableRowWinner,
                          isOut && styles.tableRowOut,
                          isRTL && { flexDirection: 'row-reverse' },
                        ]}>
                        <Text
                          style={[
                            styles.tdName,
                            isWinner && { color: C.amber },
                            isOut && { color: C.red },
                          ]}
                          numberOfLines={1}>
                          {p.name}
                        </Text>
                        {sess.rounds.map(r => {
                          const s = r.scores[p.id] !== undefined ? r.scores[p.id] : 0;
                          return (
                            <Text
                              key={r.roundNum}
                              style={[
                                styles.tdRound,
                                s < 0 && { color: C.teal },
                                s > 0 && { color: C.red },
                              ]}>
                              {s > 0 ? `+${s}` : String(s)}
                            </Text>
                          );
                        })}
                        <Text
                          style={[
                            styles.tdTotal,
                            isWinner && { color: C.amber },
                            isOut && { color: C.red },
                          ]}>
                          {finalTotal}
                        </Text>
                        <Text style={styles.tdStatus}>
                          {isWinner ? '👑' : isOut ? '❌' : '✅'}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  // ── More Tab ────────────────────────────────────────────────────────────────
  const renderMoreTab = () => (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.moreHeader}>
        <Text style={styles.moreHeaderEmoji}>⚙️</Text>
        <Text style={styles.moreHeaderTitle}>{t.more}</Text>
      </View>

      {[
        {
          icon: '🌐',
          title: t.language,
          sub: lang === 'ar' ? '🇸🇦 العربية' : '🇺🇸 English',
          onPress: () => setLangModal(true),
        },
        {
          icon: '👤',
          title: t.aboutMe,
          sub: lang === 'ar' ? 'عن المطور' : 'About Developer',
          onPress: () => setAboutModal(true),
        },
        {
          icon: '📱',
          title: t.contact,
          sub: '@abdu_amigo',
          onPress: () => setContactModal(true),
        },
      ].map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
          activeOpacity={0.7}
          onPress={item.onPress}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <View style={styles.menuInfo}>
            <Text style={[styles.menuTitle, isRTL && { textAlign: 'right' }]}>{item.title}</Text>
            <Text style={[styles.menuSub, isRTL && { textAlign: 'right' }]}>{item.sub}</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.appInfoBox}>
        <Text style={{ fontSize: 36 }}>🎮</Text>
        <Text style={styles.appInfoTitle}>Score Tracker</Text>
        <Text style={styles.appInfoVersion}>v2.0</Text>
      </View>
    </ScrollView>
  );

  // ── Score Modal (bottom sheet) ───────────────────────────────────────────────
  const renderScoreModal = () => {
    const player = players.find(p => p.id === scoreModal?.playerId);
    if (!player) return null;
    return (
      <Modal
        visible={!!scoreModal}
        transparent
        animationType="slide"
        onRequestClose={() => setScoreModal(null)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setScoreModal(null)}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.bottomSheet}
            onPress={e => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, isRTL && { textAlign: 'right' }]}>
              {player.name}
            </Text>
            <Text style={[styles.sheetSub, isRTL && { textAlign: 'right' }]}>
              {t.enterScore}  ({t.total}: {player.score})
            </Text>

            {/* Big number input — no inline in list so no blink */}
            <TextInput
              style={styles.bigScoreInput}
              keyboardType="numeric"
              value={modalInput}
              onChangeText={setModalInput}
              placeholder="0"
              placeholderTextColor={C.textMuted}
              autoFocus
              selectTextOnFocus
            />

            {/* Quick buttons */}
            <Text style={[styles.sectionLabel, { marginBottom: 6 }, isRTL && { textAlign: 'right' }]}>
              {t.quickAdd}
            </Text>
            <View style={styles.quickRow}>
              {[1, 2, 3, 5, 7, 10].map(v => (
                <TouchableOpacity
                  key={v}
                  style={styles.quickBtnPos}
                  onPress={() => quickScore(v)}>
                  <Text style={styles.quickBtnPosText}>+{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.quickRow}>
              {[-1, -2, -3, -5, -10].map(v => (
                <TouchableOpacity
                  key={v}
                  style={styles.quickBtnNeg}
                  onPress={() => quickScore(v)}>
                  <Text style={styles.quickBtnNegText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <View style={[styles.sheetActions, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setScoreModal(null)}>
                <Text style={styles.btnCancelText}>{t.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={confirmScore}>
                <Text style={styles.btnPrimaryText}>{t.confirm}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  // ── Language Modal ───────────────────────────────────────────────────────────
  const renderLangModal = () => (
    <Modal visible={langModal} transparent animationType="fade" onRequestClose={() => setLangModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangModal(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.centeredModal} onPress={e => e.stopPropagation()}>
          <Text style={styles.centeredModalTitle}>{t.language}</Text>
          {[
            { code: 'ar', flag: '🇸🇦', label: 'العربية' },
            { code: 'en', flag: '🇺🇸', label: 'English' },
          ].map(opt => (
            <TouchableOpacity
              key={opt.code}
              style={[styles.langOption, lang === opt.code && styles.langOptionActive]}
              onPress={() => { setLangState(opt.code); setLangModal(false); }}>
              <Text style={styles.langOptionText}>{opt.flag}  {opt.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btnPrimary, { marginTop: 8 }]} onPress={() => setLangModal(false)}>
            <Text style={styles.btnPrimaryText}>{t.close}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // ── About Modal ──────────────────────────────────────────────────────────────
  const renderAboutModal = () => (
    <Modal visible={aboutModal} transparent animationType="fade" onRequestClose={() => setAboutModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAboutModal(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.centeredModal} onPress={e => e.stopPropagation()}>
          <Text style={styles.centeredModalTitle}>{t.aboutMe}</Text>
          <Text style={[styles.aboutText, isRTL && { textAlign: 'right' }]}>{t.aboutContent}</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setAboutModal(false)}>
            <Text style={styles.btnPrimaryText}>{t.close}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // ── Contact Modal ────────────────────────────────────────────────────────────
  const contactLinks = [
    { icon: '𝕏', label: 'X / Twitter', url: 'https://x.com/abdu_amigo' },
    { icon: 'ⓕ', label: 'Facebook', url: 'https://facebook.com/abduamigo90' },
    { icon: '[in]', label: 'LinkedIn', url: 'https://linkedin.com/in/abduamigo' },
    { icon: '🔗', label: 'GitHub', url: 'https://github.com/abduAmigo' },
    { icon: '🌐', label: 'asserai.com', url: 'https://asserai.com' },
    { icon: '✉️', label: 'me@asserai.com', url: 'mailto:me@asserai.com' },
  ];

  const renderContactModal = () => (
    <Modal visible={contactModal} transparent animationType="fade" onRequestClose={() => setContactModal(false)}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setContactModal(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.centeredModal} onPress={e => e.stopPropagation()}>
          <Text style={styles.centeredModalTitle}>{t.contact}</Text>
          {contactLinks.map(l => (
            <TouchableOpacity
              key={l.label}
              style={[styles.contactRow, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() =>
                Linking.canOpenURL(l.url).then(ok => {
                  if (ok) Linking.openURL(l.url);
                })
              }>
              <Text style={styles.contactIcon}>{l.icon}</Text>
              <Text style={styles.contactLabel}>{l.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btnPrimary, { marginTop: 12 }]} onPress={() => setContactModal(false)}>
            <Text style={styles.btnPrimaryText}>{t.close}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // ROOT RENDER
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === 'welcome') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2027' }]}>
        {renderWelcome()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'play' && phase === 'setup' && renderSetup()}
        {activeTab === 'play' && phase === 'game' && renderGame()}
        {activeTab === 'play' && phase === 'winner' && renderWinner()}
        {activeTab === 'rounds' && renderRoundsTab()}
        {activeTab === 'more' && renderMoreTab()}
      </View>

      {/* Tab bar */}
      <View style={[styles.tabBar, isRTL && { flexDirection: 'row-reverse' }]}>
        {[
          { id: 'play', icon: '🎮', label: t.play },
          { id: 'rounds', icon: '📋', label: t.rounds },
          { id: 'more', icon: '⋯', label: t.more },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabBtn, activeTab === tab.id && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modals */}
      {renderScoreModal()}
      {renderLangModal()}
      {renderAboutModal()}
      {renderContactModal()}
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },
  screen: {
    flex: 1,
  },

  // ── Welcome ──────────────────────────────────────────────────────────────────
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  welcomeEmoji: { fontSize: 56, marginBottom: 16 },
  welcomeTitle: { fontSize: 28, fontWeight: '600', color: '#fff', marginBottom: 8 },
  welcomeSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 40, textAlign: 'center' },

  // ── Buttons ──────────────────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: C.teal,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  btnDisabled: { backgroundColor: '#ccc' },
  btnAmber: {
    backgroundColor: C.amber,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  btnOutline: {
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: C.teal,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  btnOutlineText: { color: C.teal, fontSize: 16, fontWeight: '600' },
  btnCancel: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  btnCancelText: { color: C.textMuted, fontSize: 15, fontWeight: '500' },

  // ── Setup ─────────────────────────────────────────────────────────────────────
  setupContent: { padding: 20, paddingBottom: 60 },
  setupHeader: { alignItems: 'center', marginBottom: 20 },
  setupTitle: { fontSize: 22, fontWeight: '600', color: C.text },
  setupSub: { fontSize: 13, color: C.textMuted, marginTop: 4 },
  rulesBox: {
    backgroundColor: C.tealLight,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  rulesText: { fontSize: 13, color: C.tealDark, lineHeight: 20 },
  sectionLabel: { fontSize: 12, fontWeight: '600', color: C.textMuted, marginBottom: 8, letterSpacing: 0.4 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  nameInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: C.text,
    backgroundColor: C.white,
  },
  addBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 24, fontWeight: '600', lineHeight: 28 },
  emptyBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: C.border,
    borderRadius: 10,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: { color: C.textMuted, fontSize: 14 },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.tealLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  playerChipNum: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerChipNumText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  playerChipName: { flex: 1, fontSize: 15, fontWeight: '500', color: C.tealDark },
  playerChipDel: { color: C.red, fontSize: 22, paddingHorizontal: 4 },
  helperText: { color: C.red, fontSize: 12, textAlign: 'center', marginTop: 8 },

  // ── Game ──────────────────────────────────────────────────────────────────────
  roundHeader: {
    backgroundColor: C.teal,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundHeaderTitle: { fontSize: 18, fontWeight: '600', color: '#fff' },
  roundHeaderSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  gameBody: { padding: 16 },
  tapHint: { fontSize: 12, color: C.textMuted, marginBottom: 12 },
  playerGameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 13,
    marginBottom: 8,
  },
  playerGameRowOut: { opacity: 0.5, backgroundColor: '#f5f5f5' },
  playerGameRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerGameRankText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  playerGameInfo: { flex: 1 },
  playerGameName: { fontSize: 15, fontWeight: '500', color: C.text },
  playerGameTotal: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  playerGameScore: { fontSize: 20, fontWeight: '500', color: C.textMuted, minWidth: 44, textAlign: 'right' },

  // ── Winner ────────────────────────────────────────────────────────────────────
  winnerContent: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
  },
  winnerCrown: { fontSize: 60, marginBottom: 4 },
  winnerLabel: { fontSize: 18, color: C.textMuted, marginBottom: 8 },
  winnerNameBox: {
    borderWidth: 2,
    borderColor: C.amber,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  winnerName: { fontSize: 28, fontWeight: '600', color: C.text },
  winnerStats: { flexDirection: 'row', gap: 12, marginBottom: 24, width: '100%' },
  winnerStat: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: C.border,
  },
  winnerStatVal: { fontSize: 22, fontWeight: '600', color: C.teal },
  winnerStatLbl: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  confetti: { fontSize: 26, letterSpacing: 8, marginVertical: 4 },

  // ── Rounds Tab ────────────────────────────────────────────────────────────────
  noDataBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  noDataEmoji: { fontSize: 48, marginBottom: 16 },
  noDataTitle: { fontSize: 16, fontWeight: '500', color: C.text, marginBottom: 8 },
  noDataSub: { fontSize: 13, color: C.textMuted, textAlign: 'center' },
  sessionBlock: {
    margin: 14,
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    overflow: 'hidden',
  },
  sessionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textMuted,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: C.border },
  tableHeaderRow: { backgroundColor: '#f5f5f5' },
  tableRowWinner: { backgroundColor: C.amberLight },
  tableRowOut: { backgroundColor: C.redLight },
  thName: { width: 100, padding: 9, fontSize: 12, fontWeight: '600', color: C.textMuted },
  thRound: { width: 64, padding: 9, fontSize: 12, fontWeight: '600', color: C.textMuted, textAlign: 'center' },
  thTotal: { width: 60, padding: 9, fontSize: 12, fontWeight: '600', color: C.textMuted, textAlign: 'center' },
  thStatus: { width: 42, padding: 9, fontSize: 12, fontWeight: '600', color: C.textMuted, textAlign: 'center' },
  tdName: { width: 100, padding: 10, fontSize: 14, fontWeight: '500', color: C.text },
  tdRound: { width: 64, padding: 10, fontSize: 14, color: C.text, textAlign: 'center' },
  tdTotal: { width: 60, padding: 10, fontSize: 14, fontWeight: '600', color: C.text, textAlign: 'center' },
  tdStatus: { width: 42, padding: 10, fontSize: 14, textAlign: 'center' },

  // ── More Tab ──────────────────────────────────────────────────────────────────
  moreHeader: { alignItems: 'center', paddingVertical: 28 },
  moreHeaderEmoji: { fontSize: 42 },
  moreHeaderTitle: { fontSize: 20, fontWeight: '600', color: C.text, marginTop: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.white,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: C.border,
    padding: 14,
  },
  menuIcon: { fontSize: 24, marginRight: 14 },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: '500', color: C.text },
  menuSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  menuArrow: { fontSize: 22, color: C.textMuted },
  appInfoBox: { alignItems: 'center', paddingVertical: 28 },
  appInfoTitle: { fontSize: 18, fontWeight: '600', color: C.text, marginTop: 8 },
  appInfoVersion: { fontSize: 12, color: C.textMuted, marginTop: 4 },

  // ── Score Modal (bottom sheet) ────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '600', color: C.text, marginBottom: 4 },
  sheetSub: { fontSize: 13, color: C.textMuted, marginBottom: 16 },
  bigScoreInput: {
    borderWidth: 2,
    borderColor: C.teal,
    borderRadius: 10,
    padding: 14,
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    color: C.text,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  quickBtnPos: {
    backgroundColor: C.tealLight,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  quickBtnPosText: { color: C.tealDark, fontSize: 13, fontWeight: '600' },
  quickBtnNeg: {
    backgroundColor: '#FCEBEB',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  quickBtnNegText: { color: C.red, fontSize: 13, fontWeight: '600' },
  sheetActions: { flexDirection: 'row', gap: 10, marginTop: 16 },

  // ── Centered Modals ───────────────────────────────────────────────────────────
  centeredModal: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignSelf: 'center',
    // Override overlay to center
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  centeredModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: C.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  langOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  langOptionActive: {
    backgroundColor: C.tealLight,
    borderWidth: 1.5,
    borderColor: C.teal,
  },
  langOptionText: { fontSize: 15, fontWeight: '500', color: C.text },
  aboutText: { fontSize: 14, color: C.textMuted, lineHeight: 22, marginBottom: 16 },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    gap: 12,
  },
  contactIcon: { fontSize: 20 },
  contactLabel: { fontSize: 14, color: C.blue },

  // ── Tab Bar ───────────────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.white,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingBottom: Platform.OS === 'ios' ? 16 : 6,
    paddingTop: 6,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabBtnActive: {
    borderTopWidth: 2,
    borderTopColor: C.teal,
  },
  tabIcon: { fontSize: 22, marginBottom: 2 },
  tabLabel: { fontSize: 11, color: C.textMuted },
  tabLabelActive: { color: C.teal, fontWeight: '600' },
});