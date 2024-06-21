import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import theme from '../../styles/theme';

const years = Array.from({ length: 11 }, (_, i) => moment().year() - 5 + i);
const months_lower = moment.monthsShort();
const months = months_lower.map(month => month.toUpperCase());

const CustomCalendar = ({ onDateSelected, initialDate }) => {
  const initialMoment = initialDate ? moment(initialDate) : moment();
  const [selectedYear, setSelectedYear] = useState(initialMoment.year());
  const [selectedMonth, setSelectedMonth] = useState(initialMoment.month() + 1);
  const [selectedDate, setSelectedDate] = useState(initialDate || '');
  const [currentDate, setCurrentDate] = useState(initialMoment.format('YYYY-MM-DD'));

  const yearScrollViewRef = useRef(null);
  const monthScrollViewRef = useRef(null);
  const itemWidth = Dimensions.get('window').width / 5; // width for year and month items to show 5 items at a time
  const monthItemWidth = Dimensions.get('window').width / 5;

  useEffect(() => {
    if (yearScrollViewRef.current) {
      const currentYearIndex = years.indexOf(selectedYear);
      yearScrollViewRef.current.scrollTo({ x: itemWidth * currentYearIndex, animated: false });
    }
    if (monthScrollViewRef.current) {
      const currentMonthIndex = selectedMonth - 1;
      monthScrollViewRef.current.scrollTo({ x: monthItemWidth * currentMonthIndex, animated: false });
    }
  }, []);

  useEffect(() => {
    setCurrentDate(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`);
  }, [selectedYear, selectedMonth]);

  const handleYearMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / itemWidth);
    if (index >= 0 && index < years.length) {
      setSelectedYear(years[index]);
    }
  };

  const handleMonthMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / monthItemWidth);
    if (index >= 0 && index < months.length) {
      setSelectedMonth(index + 1);
    }
  };

  const handleYearItemPress = (index) => {
    setSelectedYear(years[index]);
    yearScrollViewRef.current.scrollTo({ x: itemWidth * index, animated: true });
  };

  const handleMonthItemPress = (index) => {
    setSelectedMonth(index + 1);
    monthScrollViewRef.current.scrollTo({ x: monthItemWidth * index, animated: true });
  };

  const renderYearItem = (year, index) => {
    const isSelected = selectedYear === year;
    return (
      <TouchableOpacity key={year} onPress={() => handleYearItemPress(index)}>
        <View style={[styles.item, { width: itemWidth }]}>
          <Text style={[styles.text, isSelected && styles.selectedText]}>{year}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonthItem = (month, index) => {
    const isSelected = selectedMonth === index + 1;
    return (
      <TouchableOpacity key={month} onPress={() => handleMonthItemPress(index)}>
        <View style={[styles.item, { width: monthItemWidth }]}>
          <Text style={[styles.text, isSelected && styles.selectedText]}>{month}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={[styles.container, { paddingHorizontal: itemWidth * 1.75 }]} 
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
        contentContainerStyle={[styles.container, { paddingHorizontal: monthItemWidth * 1.75 }]} 
        onMomentumScrollEnd={handleMonthMomentumScrollEnd}
        snapToInterval={monthItemWidth}
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
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: theme.primary }
        }}
        hideExtraDays={true}
        firstDay={1}
        enableSwipeMonths={true}
        hideArrows={true} // Hide navigation arrows
        renderHeader={() => null} // Hide the header
        theme={{
          backgroundColor: '#fff',
          calendarBackground: '#fff',
          textSectionTitleColor: theme.greyDark,
          selectedDayBackgroundColor: theme.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.primary,
          dayTextColor: theme.primaryText,
          textDisabledColor: theme.greyMedium,
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
    color: theme.greyDark,
  },
  selectedText: {
    color: theme.primary,
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default CustomCalendar;