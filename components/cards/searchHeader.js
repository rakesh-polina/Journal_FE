import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../styles/theme'

// Settings
const SearchHeader = ({routeName, toggleSearchBar}) => {
    const navigation = useNavigation();
    const openSettings = () => {
        navigation.navigate('Profile');
        console.log('settings')
    }
    
    return (
        <View style={styles.container}>
            {routeName === 'Home' && (
                <TouchableOpacity onPress={toggleSearchBar} style={styles.search}>
                    <Image source={require('../../assets/icons/search.png')} style={{ tintColor: '#fff', width: 30, height: 30 }} />
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => openSettings()} style={styles.button}>
                <Text style={styles.text}>.</Text>
            </TouchableOpacity>
        </View>
    );
  };


  const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    search: {
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
      },
    button: {
      marginRight: 20,
      padding: 10,
      backgroundColor: '#eee',
      borderRadius: 200,
    },
    text: {
      color: '#000',
      fontWeight: 'bold',
    },
  });

export default SearchHeader
