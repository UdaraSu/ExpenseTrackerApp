// 🏠 Beautiful Landing HomeScreen.js for Expense Tracker

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../assets/dashboard.png')} // Add a nice PNG/SVG image in assets
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={[styles.title, { color: colors.text }]}>Welcome to ExpenseMate</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Track, manage and visualize your daily spending</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#3b82f6' }]}
        onPress={() => navigation.navigate('add')}
      >
        <Text style={styles.buttonText}>➕ Add New Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#10b981' }]}
        onPress={() => navigation.navigate('list')}
      >
        <Text style={styles.buttonText}>📋 View All Expenses</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#f59e0b' }]}
        onPress={() => navigation.navigate('chart')}
      >
        <Text style={styles.buttonText}>📊 View Charts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 400,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
