// src/screens/BibleReader.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes } from '../utils/theme';
import { getChapter } from '../services/bibleApi';

type BibleReaderRouteProp = RouteProp<RootStackParamList, 'BibleReader'>;

const BibleReaderScreen = () => {
  const route = useRoute<BibleReaderRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get params or use defaults
  const { book = '', chapter = NaN } = route.params || {};

  const [chapterData, setChapterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [bookName, setBookName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle scroll event
  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollProgress = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    setScrollProgress(Math.max(0, Math.min(1, scrollProgress)));
  };

  // Memoize the fetch function to avoid recreating it on each render
  const fetchChapter = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getChapter(book, chapter);
      setChapterData(data);

      // Format the book name (uncomment and fix this)
      setBookName(book.includes('GEN') ? 'Genesis' : book);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [book, chapter]);

  // Only run the fetch when component mounts or book/chapter changes
  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  // Navigate to previous chapter
  const goToPreviousChapter = () => {
    if (chapter > 1) {
      navigation.navigate('BibleReader', { book, chapter: chapter - 1 });
    }
  };

  // Navigate to next chapter
  const goToNextChapter = () => {
    navigation.navigate('BibleReader', { book, chapter: chapter + 1 });
  };

  // Toggle audio playback
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // TODO: 
    // Audio playback logic would go here
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading {bookName || book} {chapter}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Ionicons name="alert-circle-outline" size={50} color={colors.error} />
        <Text style={styles.errorText}>Error loading content</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.bookInfoContainer}>
          <Text style={styles.bookTitle}>{bookName || book} Chapter {chapter}</Text>
        </View>

        <View style={styles.audioControls}>
          <TouchableOpacity style={styles.audioButton}>
            <Ionicons name="play-back" size={20} color={colors.primaryText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.audioButton} onPress={togglePlayback}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color={colors.primaryText}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.audioButton}>
            <Ionicons name="play-forward" size={20} color={colors.primaryText} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${scrollProgress * 100}%` }]} />
      </View>


      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {chapterData?.verses?.map((verseItem: any) => (
          <View key={verseItem.number} style={styles.verseContainer}>
            <Text style={styles.verseNumber}>{verseItem.number}</Text>
            <Text style={styles.verseText}>{verseItem.text}</Text>
          </View>
        ))}

        {(!chapterData?.verses || chapterData.verses.length === 0) && (
          <Text style={styles.noContentText}>No verses found for this chapter.</Text>
        )}
      </ScrollView>

      <View style={styles.navigationBar}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={goToPreviousChapter}
          disabled={chapter <= 1}
        >
          <View style={styles.circleButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.primaryText}
            />
          </View>
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={28} color={colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToNextChapter}>
          <Text style={styles.navButtonText}>Next</Text>
          <View style={styles.circleButton}>
            <Ionicons name="chevron-forward" size={24} color={colors.primaryText} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: fontSizes.medium,
    color: colors.primaryText,
  },
  errorText: {
    marginTop: 10,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors.error,
  },
  errorMessage: {
    marginTop: 5,
    fontSize: fontSizes.small,
    color: colors.secondaryText,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  bookInfoContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  chapterTitle: {
    fontSize: fontSizes.medium,
    color: colors.secondaryText,
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: '#333333',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  verseNumber: {
    fontWeight: 'bold',
    color: colors.accent,
    width: 30,
    marginRight: 5,
    fontSize: fontSizes.medium,
  },
  verseText: {
    flex: 1,
    lineHeight: 28,
    color: colors.primaryText,
    fontSize: fontSizes.medium,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: colors.surface,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: fontSizes.medium,
    color: colors.accent,
    marginHorizontal: 8,
  },
  bookmarkButton: {
    padding: 10,
  },
  noContentText: {
    color: colors.secondaryText,
    textAlign: 'center',
    padding: 20,
    fontSize: fontSizes.medium,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default BibleReaderScreen;