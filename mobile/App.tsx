import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LocalLink</Text>
      <Text>App is running!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAF8' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#264653', marginBottom: 10 },
});
