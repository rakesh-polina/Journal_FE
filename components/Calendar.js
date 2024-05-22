import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import { useNavigation } from '@react-navigation/native';

const Calendar = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());

  const handleDateChange = (event, selectedDate) => {
    setDate(selectedDate);
    navigation.navigate('EventLog');
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        mode="single"
        date={date}
        onChange={handleDateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

export default Calendar;
