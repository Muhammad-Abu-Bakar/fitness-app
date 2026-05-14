// === NEW === Day 8 — welcome screen for fitness-app
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const handleGetStarted = () => {
    // === NEW === will wire up navigation in later days
    console.log('Get Started tapped');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>FOR SKINNY GUYS WHO WANT TO GROW</Text>
        <Text style={styles.title}>Get Bigger.</Text>
        <Text style={styles.titleAccent}>Stay Consistent.</Text>
        <Text style={styles.subtitle}>
          Track calories, protein, and workouts built for hardgainers — not the average gym bro.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  content: {
    marginTop: 40,
  },
  eyebrow: {
    color: '#ffb800',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 60,
  },
  titleAccent: {
    color: '#ffb800',
    fontSize: 52,
    fontWeight: '800',
    lineHeight: 60,
    marginBottom: 24,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#ffb800',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: '700',
  },
});