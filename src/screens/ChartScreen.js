import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const ChartScreen = () => {
  const [chartData, setChartData] = useState([]);
  const { colors, dark } = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stored = await AsyncStorage.getItem('expenses');
    const expenses = stored ? JSON.parse(stored) : [];

    const totals = {
      Food: 0,
      Travel: 0,
      Shopping: 0,
      Other: 0,
    };

    expenses.forEach((exp) => {
      if (totals[exp.category] !== undefined) {
        totals[exp.category] += exp.amount;
      }
    });

    const colorsList = ['#FF6384', '#36A2EB', '#FFCD56', '#4BC0C0'];
    const pieData = Object.entries(totals)
      .filter(([_, val]) => val > 0)
      .map(([cat, val], index) => ({
        name: cat,
        amount: val,
        color: colorsList[index],
        legendFontColor: colors.text,
        legendFontSize: 14,
      }));

    setChartData(pieData);
  };

  const getTotal = () => chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Expense Summary</Text>

      {chartData.length === 0 ? (
        <Text style={[styles.message, { color: colors.text }]}>No data available</Text>
      ) : (
        <View style={[styles.chartCard, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
          <PieChart
            data={chartData}
            width={screenWidth - 48}
            height={260}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              color: (opacity = 1) => dark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => colors.text,
              propsForLabels: {
                fontWeight: '600',
              },
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="24"
            absolute
            hasLegend={true}
          />

          {/* Breakdown */}
          <View style={styles.breakdownWrapper}>
            {chartData.map((item, index) => {
              const total = getTotal();
              const percentage = ((item.amount / total) * 100).toFixed(1);
              return (
                <View key={index} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.category, { color: colors.text }]}>{item.name}</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={[styles.amount, { color: colors.text }]}>Rs. {item.amount.toFixed(2)}</Text>
                    <Text style={[styles.percentage, { color: colors.text }]}>({percentage}%)</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  message: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  chartCard: {
    marginHorizontal: 8,
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderRadius: 24,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  breakdownWrapper: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default ChartScreen;
