// App.tsx
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/index';
import { useAppStore } from './src/store';
import { getCurrentUser } from './src/services/authService';
import { getUserBibleData } from './src/services/userDataService';
import { colors } from './src/utils/theme';

export default function App() {
  const { setAuthenticated, setUserData } = useAppStore();
  
  // Check authentication state on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        
        if (user) {
          // User is authenticated
          setAuthenticated(true, user.id);
          
          // Load user's Bible data
          const userData = await getUserBibleData(user.id);
          if (userData) {
            setUserData(userData);
          }
        } else {
          // User is not authenticated
          setAuthenticated(false, null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthenticated(false, null);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navBar} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}