// src/screens/Bible.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { colors, fontSizes } from '../utils/theme';
import { getBooks } from '../services/bibleApi';
import { BibleBook } from '../types/bible';

const BibleScreen = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBooks();
  }, []);
  
  const openChapterModal = (book: BibleBook) => {
    setSelectedBook(book);
    setModalVisible(true);
  };
  
  const closeChapterModal = () => {
    setModalVisible(false);
  };
  
  const navigateToChapter = (chapter: number) => {
    if (selectedBook) {
      navigation.navigate('BibleReader', {
        book: selectedBook.id,
        chapter,
      });
      setModalVisible(false);
    }
  };
  
  const renderBook = ({ item }: { item: BibleBook }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => openChapterModal(item)}
    >
      <Text style={styles.bookName}>{item.name}</Text>
      <View style={styles.chapterInfo}>
        <Text style={styles.chapterCount}>{item.chapters}</Text>
        <View style={styles.plusButton}>
          <Ionicons name="add" size={24} color={colors.primaryText} />
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Generate an array of chapter numbers
  const renderChapters = () => {
    if (!selectedBook) return null;
    
    const chapters = [];
    for (let i = 1; i <= selectedBook.chapters; i++) {
      chapters.push(
        <TouchableOpacity 
          key={i} 
          style={styles.chapterButton}
          onPress={() => navigateToChapter(i)}
        >
          <Text style={styles.chapterButtonText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    
    return chapters;
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading Bible data...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={50} color={colors.error} />
        <Text style={styles.errorText}>Error loading Bible data</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeChapterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedBook?.name}</Text>
              <TouchableOpacity onPress={closeChapterModal} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.primaryText} />
              </TouchableOpacity>
            </View>
            
            <ScrollView contentContainerStyle={styles.chaptersGrid}>
              {renderChapters()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.primaryText,
    marginTop: 16,
    fontSize: fontSizes.medium,
  },
  errorText: {
    color: colors.error,
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorSubtext: {
    color: colors.secondaryText,
    fontSize: fontSizes.small,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  list: {
    paddingVertical: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#333333',
    marginHorizontal: 16,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  bookName: {
    color: colors.primaryText,
    fontSize: fontSizes.large,
    fontWeight: '500',
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chapterCount: {
    color: colors.secondaryText,
    fontSize: fontSizes.medium,
    marginRight: 16,
  },
  plusButton: {
    backgroundColor: '#444',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  modalTitle: {
    color: colors.primaryText,
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chaptersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: 20,
  },
  chapterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  chapterButtonText: {
    color: colors.primaryText,
    fontSize: fontSizes.medium,
    fontWeight: '500',
  }
});

export default BibleScreen;