import React, {useRef, useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {ExpandableCalendar, AgendaList, CalendarProvider, WeekCalendar} from 'react-native-calendars';

const leftArrowIcon = require('../../assets/icons/previous.png');
const rightArrowIcon = require('../../assets/icons/next.png');

const ExCalendar = (props) => {
  const {weekView, onDateChange, markedDates} = props;
  // console.log('In calendar', markedDates)
  const todayBtnTheme = useRef({
    todayButtonTextColor: '#00aaff'
  });

  const initialDate = new Date().toISOString().split('T')[0];

  const onDateChanged = useCallback(
    (date, updateSource) => {
      console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
      onDateChange(date);
      // if (onDateChange) {
      // }
    },
    [onDateChange, initialDate]
  );

  return (
    <CalendarProvider
      date={initialDate}
      onDateChanged={onDateChanged}
      // onMonthChange={onMonthChange}
      // showTodayButton
      // disabledOpacity={1}
      theme={todayBtnTheme.current}
      // todayBottomMargin={16}
    >
      {weekView ? (
        <WeekCalendar testID='weekCalendar' firstDay={1} markedDates={markedDates} />
      ) : (
        <ExpandableCalendar
          testID='expandableCalendar'
          // disablePan
          // hideKnob
          calendarStyle={styles.calendar}
          // disableWeekScroll
          firstDay={1}
          leftArrowImageSource={leftArrowIcon}
          rightArrowImageSource={rightArrowIcon}
          animateScroll
          markedDates={markedDates}
        />
      )}

    </CalendarProvider>
  );
};

export default ExCalendar;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'lightgrey'
  },
  section: {
    backgroundColor: '#fff',
    color: 'grey',
    textTransform: 'capitalize'
  }
});