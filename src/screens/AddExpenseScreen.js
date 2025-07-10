import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AddExpenseScreen = () => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const { colors } = useTheme();

  const saveExpense = async () => {
    if (!title || !amount || isNaN(amount)) {
      Alert.alert('Validation Error', 'Please enter valid title and numeric amount.');
      return;
    }

    const expense = {
      id: Date.now().toString(),
      title,
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
      imageUri,
    };

    try {
      // AsyncStorage
      const stored = await AsyncStorage.getItem('expenses');
      const expenses = stored ? JSON.parse(stored) : [];
      expenses.push(expense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      Alert.alert('Success', 'Expense saved!');
      setTitle('');
      setAmount('');
      setImageUri(null);
    } catch (e) {
      Alert.alert('Error', 'Failed to save expense.');
    }
  };
//launch camera and galary
  const openCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo', saveToPhotos: true, quality: 0.7 });
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Add Your New Expense</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
        {/* Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
          placeholder="Eg: Market shopping"
          placeholderTextColor="#888"
        />
        {/* Amount */}
        <Text style={[styles.label, { color: colors.text }]}>Amount (Rs.)</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
          placeholder="Eg: 1500"
          placeholderTextColor="#888"
        />
        {/* category dropdown */}
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <View style={[styles.pickerWrapper, { backgroundColor: colors.input }]}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={{ color: colors.text }}
            dropdownIconColor={colors.text}
          >
            <Picker.Item label="Food" value="Food" />
            <Picker.Item label="Travel" value="Travel" />
            <Picker.Item label="Shopping" value="Shopping" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
        {/* date */}
        <Text style={[styles.label, { color: colors.text }]}>Date</Text>
        <TouchableOpacity
          style={[styles.dateButton, { backgroundColor: colors.input }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: colors.text }}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        {/* Buttons left and right */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: colors.input, borderColor: colors.border }]}
            onPress={openCamera}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>📷 Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.imageButton, { backgroundColor: colors.input, borderColor: colors.border }]}
            onPress={openGallery}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>🖼️ Pick from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Display Image */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 10 }}
            resizeMode="cover"
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveExpense}>
          <Text style={styles.saveButtonText}>💾 Save Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  card: {
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: { 
    fontSize: 16, 
    marginBottom: 6, 
    marginTop: 16 
  },
  input: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  pickerWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  dateButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
    gap: 12,
  },
  imageButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddExpenseScreen;
