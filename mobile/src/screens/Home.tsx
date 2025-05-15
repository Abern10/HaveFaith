// src/screens/Home.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>HaveFaith</Text>
        <Text style={styles.subtitle}>Daily Bible Companion</Text>
      </View>
      
      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>Continue Reading</Text>
        <TouchableOpacity 
          style={styles.continueReadingCard}
          onPress={() => navigation.navigate('BibleReader' as never)}
        >
          <Text style={styles.bookTitle}>John</Text>
          <Text style={styles.chapterInfo}>Chapter 3</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.devotionalSection}>
        <Text style={styles.sectionTitle}>Daily Verse</Text>
        <View style={styles.verseCard}>
          <Text style={styles.verseText}>"For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."</Text>
          <Text style={styles.verseReference}>John 3:16</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#3a5a8c',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  quickAccessSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  continueReadingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chapterInfo: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  devotionalSection: {
    padding: 20,
  },
  verseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verseText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  verseReference: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
    marginTop: 10,
  },
});

export default HomeScreen;