import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TimePicker from 'react-native-wheel-time-picker';
import theme from '../../styles/theme';

const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * 60 * 1000;

const WheelTimePicker = ({ onSnappedTime, initialTime }) => {
  const initialMoment = initialTime ? new Date(`1970-01-01T${initialTime}Z`) : new Date();
  const initialTimeValue = initialMoment.getUTCHours() * MILLISECONDS_PER_HOUR + initialMoment.getUTCMinutes() * MILLISECONDS_PER_MINUTE;
  
  const [timeValue, setTimeValue] = useState(initialTimeValue);

  const [hour, min] = useMemo(() => {
    return [
      Math.floor(timeValue / MILLISECONDS_PER_HOUR),
      Math.floor((timeValue % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE),
    ];
  }, [timeValue]);

  useEffect(() => {
    onSnappedTime(new Date(0, 0, 0, hour, min));
  }, [hour, min]);

  return (
    <View style={styles.container}>
      <TimePicker
        value={timeValue}
        wheelProps={{
          selectedColor: theme.primary,
          disabledColor: theme.secondaryText,
          wheelHeight: 70,
          itemHeight: 40,
          displayCount: 3,
          textStyle: {fontSize: 18,},
        }}
        itemTextSize={24}
        onChange={(newValue) => setTimeValue(newValue)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeValue: {
    marginVertical: 20,
    fontSize: 26,
  },
});

export default WheelTimePicker;