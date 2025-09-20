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
} from 'react-native';

const MAX_PLAYERS = 5;
const MAX_SCORE = 30;

export default function App() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [roundScores, setRoundScores] = useState({});
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [round, setRound] = useState(1);
  const [winner, setWinner] = useState(null);

  const addPlayer = () => {
    if (newPlayerName.trim() === '') {
      Alert.alert('Hold On!', 'Player name cannot be empty.');
      return;
    }
    if (players.length >= MAX_PLAYERS) {
      Alert.alert('Too many players!', `You can only have up to ${MAX_PLAYERS} players.`);
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
      Alert.alert('Not enough players', 'Please add at least 2 players to start.');
      return;
    }
    setIsGameStarted(true);
  };

  const handleScoreChange = (id, value) => {
    setRoundScores({
      ...roundScores,
      [id]: value,
    });
  };

  const endRound = () => {
    const updatedPlayers = players.map(player => {
      if (!player.isOut) {
        const scoreToAdd = parseInt(roundScores[player.id] || 0, 10);
        const newTotalScore = player.score + scoreToAdd;
        return {
          ...player,
          score: newTotalScore,
          isOut: newTotalScore > MAX_SCORE,
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);
    setRound(round + 1);
    setRoundScores({}); // Clear inputs for the next round

    const remainingPlayers = updatedPlayers.filter(p => !p.isOut);
    if (remainingPlayers.length <= 1) {
      setWinner(remainingPlayers[0] || { name: 'No Winner' });
    }
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

  // --- UI Components ---

  const renderPlayerSetup = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Player Setup 📝</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter player name"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
        />
        <TouchableOpacity style={styles.addButton} onPress={addPlayer}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.playerList}>
        {players.map((player) => (
          <View key={player.id} style={styles.playerItem}>
            <Text style={styles.playerName}>{player.name}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.startButton, players.length < 2 && styles.disabledButton]}
        onPress={startGame}
        disabled={players.length < 2}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGameScreen = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Round {round}</Text>
      <ScrollView style={styles.activePlayersList}>
        {activePlayers.map((player) => (
          <View key={player.id} style={styles.playerRow}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerEmoji}>🏃‍♂️</Text>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerScore}>Score: {player.score}</Text>
            </View>
            <TextInput
              style={styles.scoreInput}
              placeholder="0"
              keyboardType="numeric"
              value={roundScores[player.id]}
              onChangeText={(text) => handleScoreChange(player.id, text)}
            />
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.endRoundButton} onPress={endRound}>
        <Text style={styles.buttonText}>End Round {round}</Text>
      </TouchableOpacity>

      {losers.length > 0 && (
        <View style={styles.loserPanel}>
          <Text style={styles.panelTitle}>Losers ❌</Text>
          {losers.map((player) => (
            <Text key={player.id} style={styles.loserName}>{player.name} (Score: {player.score})</Text>
          ))}
        </View>
      )}
    </KeyboardAvoidingView>
  );

  const renderWinnerScreen = () => (
    <View style={styles.container}>
      <Text style={styles.winnerEmoji}>🎉</Text>
      <Text style={styles.winnerTitle}>Winner!</Text>
      <Text style={styles.winnerText}>{winner?.name}</Text>
      <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (winner) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderWinnerScreen()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isGameStarted ? renderGameScreen() : renderPlayerSetup()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  addButton: {
    backgroundColor: '#2ecc71',
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerList: {
    width: '100%',
    marginBottom: 20,
  },
  playerItem: {
    backgroundColor: '#e9e9e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  // Game Screen
  activePlayersList: {
    width: '100%',
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  playerScore: {
    marginLeft: 'auto',
    fontWeight: 'bold',
    color: '#555',
  },
  scoreInput: {
    width: 60,
    borderBottomWidth: 1,
    borderColor: '#3498db',
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10,
  },
  endRoundButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  // Loser Panel
  loserPanel: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 5,
  },
  loserName: {
    color: '#721c24',
    fontSize: 16,
  },
  // Winner Screen
  winnerEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  winnerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  winnerText: {
    fontSize: 24,
    marginTop: 10,
    fontWeight: '600',
    color: '#333',
  },
  restartButton: {
    backgroundColor: '#34495e',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 40,
  },
});