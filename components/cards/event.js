import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const writeRecords = () => {
  // Write records logic goes here
};

const Event = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} onPress={writeRecords}>
        Write Something About Your Day...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    borderRadius: 20,
    padding: 20,
    margin: 10,
    // height: 180,
    backgroundColor: '#193752',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
});

export default Event;
