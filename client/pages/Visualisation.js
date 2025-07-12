import { View, Text, StyleSheet } from 'react-native';

export default function Visualisation() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📊 Data Visualisation Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#1DCD9F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
