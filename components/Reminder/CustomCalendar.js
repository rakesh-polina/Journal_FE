import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const years = Array.from({ length: 11 }, (_, i) => moment().year() - 5 + i);
const months = moment.months();

const CustomCalendar = ({ onDateSelected }) => {
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`);

  const yearScrollViewRef = useRef(null);
  const monthScrollViewRef = useRef(null);
  const itemWidth = Dimensions.get('window').width / 5; // width for year and month items to show 5 items at a time

  useEffect(() => {
    if (yearScrollViewRef.current) {
      yearScrollViewRef.current.scrollTo({ x: itemWidth * (Math.floor(years.length / 2) - 2), animated: false });
    }
    if (monthScrollViewRef.current) {
      monthScrollViewRef.current.scrollTo({ x: itemWidth * (Math.floor(months.length / 2) - 2), animated: false });
    }
  }, []);

  useEffect(() => {
    setCurrentDate(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`);
    console.log(selectedYear);
    console.log(selectedMonth);
  }, [selectedYear, selectedMonth]);

  const handleYearMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
    setSelectedYear(years[index + 2]);
  };

  const handleMonthMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
    setSelectedMonth(index + 3);
  };

  const renderYearItem = (year, index) => {
    const isSelected = selectedYear === year;
    return (
      <View key={year} style={[styles.item, { width: itemWidth }]}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>{year}</Text>
      </View>
    );
  };

  const renderMonthItem = (month, index) => {
    const isSelected = selectedMonth === index + 1;
    return (
      <View key={month} style={[styles.item, { width: itemWidth }]}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>{month}</Text>
      </View>
    );
  };

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container} 
        onMomentumScrollEnd={handleYearMomentumScrollEnd}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        ref={yearScrollViewRef}
      >
        {years.map(renderYearItem)}
      </ScrollView>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container} 
        onMomentumScrollEnd={handleMonthMomentumScrollEnd}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        ref={monthScrollViewRef}
      >
        {months.map(renderMonthItem)}
      </ScrollView>
      <Calendar
        key={currentDate}
        current={currentDate}
        minDate={moment().format('YYYY-MM-DD')}
        onDayPress={day => {
          setSelectedDate(day.dateString);
          onDateSelected(day.dateString);
        }}
        hideExtraDays={true}
        firstDay={1}
        enableSwipeMonths={true}
        hideArrows={true} // Hide navigation arrows
        renderHeader={() => null} // Hide the header
        theme={{
          backgroundColor: '#b3c7f9',
          calendarBackground: '#b3c7f9',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#1e3a8a',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#1e3a8a',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
  selectedText: {
    color: 'blue',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CustomCalendar;
