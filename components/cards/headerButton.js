import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Settings
const HeaderButton = () => {
    const navigation = useNavigation();
    const openSettings = () => {
        navigation.navigate('Profile');
        console.log('settings')
    }
    return (
      <TouchableOpacity onPress={() => openSettings()} style={styles.button}>
        <Text style={styles.text}>.</Text>
      </TouchableOpacity>
    );
  };


  const styles = StyleSheet.create({
    button: {
      marginRight: 10,
      padding: 10,
      backgroundColor: '#eee',
      borderRadius: 200,
    },
    text: {
      color: '#000',
      fontWeight: 'bold',
    },
  });

export default HeaderButton
