import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Freq from '../assets/freq.svg'
import Cardinality from '../assets/cardinality.svg'
import Stats from '../assets/stats.svg'
import Types from '../assets/types.svg'
import Shape from '../assets/shape.svg'
import dummyData from '../assets/dummy.json'
import { ActivityIndicator, MD3DarkTheme, PaperProvider } from 'react-native-paper';

// Get screen dimensions for responsive card sizing
const { width } = Dimensions.get('window');
// Calculate card width to ensure two cards fit per row with spacing
const cardHorizontalMargin = 10;
const numColumns = 2;
const totalHorizontalMargin = cardHorizontalMargin * 2 * numColumns; // Total margin for 2 cards
const cardWidth = (width - totalHorizontalMargin - (2 * 20)) / numColumns; // Screen width - total margins - container padding
const cardHeight = cardWidth * 1.5; // Make it 50% taller than wider

export default function Analysis() {
  const [loading, setLoading] = useState(false);

  const showAlert = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);  // hide spinner

      Alert.alert(
        'Result',
        dummyData.summary,
        [{ text: 'OK', style: 'cancel' }],
        {
          cancelable: true,
          userInterfaceStyle: 'dark'
        }
      );
    }, 3000);
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <View style={styles.container}>
        {loading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}>
            <ActivityIndicator size="large" color="#1DCD9F" />
            <Text style={{ color: '#fff', marginTop: 10 }}>Generating summary...</Text>
          </View>
        )}


        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.gridContainer}>
            {/* Card 1: Summary Statistics */}
            <TouchableOpacity style={styles.card} onPress={showAlert}>
              <Stats width={120} height={120} style={styles.cardIcon} />
              <Text style={styles.cardText}>Summary Statistics</Text>
            </TouchableOpacity>

            {/* Card 2: Frequency */}
            <TouchableOpacity style={styles.card}>
              <Freq width={120} height={120} style={styles.cardIcon} />
              <Text style={styles.cardText}>Frequencies</Text>
            </TouchableOpacity>

            {/* Card 3: Infer Types */}
            <TouchableOpacity style={styles.card}>
              <Types width={120} height={120} style={styles.cardIcon} />
              <Text style={styles.cardText}>Infer Types</Text>
            </TouchableOpacity>

            {/* Card 4: Cardinality */}
            <TouchableOpacity style={styles.card}>
              <Cardinality width={120} height={120} style={styles.cardIcon} />
              <Text style={styles.cardText}>Check Cardinality</Text>
            </TouchableOpacity>

            {/* Card t5: Shape of Data 
          <TouchableOpacity style={styles.card}>
            <Shape width={120} height={120} style={styles.cardIcon}/>
            <Text style={styles.cardText}>Shape of Data</Text>
          </TouchableOpacity>*/}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Padding around the entire grid
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: cardWidth,
    height: cardHeight,
    backgroundColor: '#333333', // Charcoal black background
    borderRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10, // Vertical spacing between rows of cards
    marginHorizontal: cardHorizontalMargin, // Horizontal spacing between cards
    padding: 15,
    shadowColor: '#000', // Add subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  cardText: {
    color: '#b0b0b0',
    fontSize: 14,
    fontWeight: 'thin',
    margin: 10, // Space between icon and text
    textAlign: 'left',
  },
});
