// src/navigation/types.ts
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
  BibleReader: { book?: string; chapter?: number; verse?: number };
  Search: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Bible: undefined;
  Profile: undefined;
};