import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AddExpenseScreen from './src/screens/AddExpenseScreen';
import ExpenseListScreen from './src/screens/ExpenseListScreen';
import ChartScreen from './src/screens/ChartScreen';
import HomeScreen from './src/screens/HomeScreen';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

const ScreenSwitcher = () => {
  const [screen, setScreen] = useState('home');
  const { toggleTheme, dark, colors } = useTheme();

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen navigation={{ navigate: setScreen }} />;
      case 'add':
        return <AddExpenseScreen />;
      case 'list':
        return <ExpenseListScreen />;
      case 'chart':
        return <ChartScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background, marginTop: 40 }]}>
      {screen !== 'home' && (
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreen('home')}
          >
            <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
          </TouchableOpacity>

          {/* Tabs */}
          {['add', 'list', 'chart'].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tabButton,
                {
                  backgroundColor: screen === item ? colors.primary : colors.input,
                  borderColor: screen === item ? colors.primary : 'transparent',
                },
              ]}
              onPress={() => setScreen(item)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  { color: screen === item ? '#1569BD' : colors.text },
                ]}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.primary }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={styles.themeButtonText}>
              {dark ? '☀️ Light' : '🌙 Dark'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {renderScreen()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
  },
  backIcon: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 2,
  },
  tabButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  themeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  themeButtonText: {
    color: '#1569BD',
    fontWeight: '700',
    fontSize: 16,
  },
});

const App = () => (
  <ThemeProvider>
    <ScreenSwitcher />
  </ThemeProvider>
);

export default App;
