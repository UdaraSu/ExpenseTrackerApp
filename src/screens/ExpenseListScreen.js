// 🧾 Modified ExpenseListScreen.js to support displaying receipt image

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

const ExpenseListScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [category, setCategory] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { colors } = useTheme();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [category, startDate, endDate, expenses]);

  const fetchExpenses = async () => {
    const stored = await AsyncStorage.getItem('expenses');
    const data = stored ? JSON.parse(stored) : [];
    setExpenses(data);
  };

  const applyFilters = () => {
    let data = [...expenses];

    if (category !== 'All') {
      data = data.filter((item) => item.category === category);
    }

    if (startDate) {
      data = data.filter((item) => new Date(item.date) >= startDate);
    }

    if (endDate) {
      data = data.filter((item) => new Date(item.date) <= endDate);
    }

    setFiltered(data);
  };

  const total = filtered.reduce((sum, item) => sum + item.amount, 0);

  const renderItem = ({ item }) => (
    <View style={[styles.item, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.details, { color: colors.text }]}>Rs. {item.amount.toFixed(2)} | {item.category}</Text>
      <Text style={[styles.date, { color: colors.text }]}>{new Date(item.date).toLocaleDateString()}</Text>
      {item.imageUri && (
        <Image
          source={{ uri: item.imageUri }}
          style={{ width: '100%', height: 180, borderRadius: 12, marginTop: 10 }}
          resizeMode="cover"
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.total, { color: colors.text }]}>Total: Rs. {total.toFixed(2)}</Text>

      <Text style={[styles.label, { color: colors.text }]}>Filter by Category</Text>
      <View style={[styles.pickerWrapper, { backgroundColor: colors.input, borderColor: colors.border }]}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={{ color: colors.text }}
          dropdownIconColor={colors.text}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Food" value="Food" />
          <Picker.Item label="Travel" value="Travel" />
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Filter by Date Range</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.input, borderColor: colors.border }]}
          onPress={() => setShowStartPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: colors.text }}>{startDate ? startDate.toDateString() : 'Start Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.input, borderColor: colors.border }]}
          onPress={() => setShowEndPicker(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: colors.text }}>{endDate ? endDate.toDateString() : 'End Date'}</Text>
        </TouchableOpacity>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selected) => {
            setShowStartPicker(false);
            if (selected) setStartDate(selected);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, selected) => {
            setShowEndPicker(false);
            if (selected) setEndDate(selected);
          }}
        />
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  total: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8 },
  pickerWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  dateButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  item: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  details: { fontSize: 15, fontStyle: 'italic' },
  date: { fontSize: 13, marginTop: 6 },
});

export default ExpenseListScreen;
