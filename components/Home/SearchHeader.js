import React, { useState, useEffect, useCallback, useRoute, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../../styles/theme';
import HeaderButton from '../cards/headerButton';

function SearchHeader({componentName, toggleSearchBar}) {
  
  const navigation = useNavigation();

  const handleSearch = useCallback(() => {
    if (componentName === 'Remainder') {
      toggleSearchBar();
    } else {
      openSearch();
    }
  }, [componentName,toggleSearchBar, navigation]);
    

  const openSearch = useCallback(() => {
    navigation.navigate('Search');
  }, []);


  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}> {componentName.toUpperCase()} </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSearch} style={styles.search}>
                    <Image source={require('../../assets/icons/search.png')} style={{ tintColor: '#fff', width: 30, height: 30 }} />
                </TouchableOpacity>

                <HeaderButton/>
            </View>

        </View>
        
        {/* {isSearchVisible ? (<View style={styles.searchContainer}>
            <TextInput
            style={styles.searchBar}
            placeholder="Search..."
            value={query}
            onChangeText={setQuery}
            // Add any additional props or state management for search functionality
            />
          
            </View>) : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
    
    container: {
        display: 'flex',
        justifyContent: 'flex-start',
    },

    header: {
        backgroundColor: theme.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 65,
    },
    headerText:{
        paddingHorizontal: 25,
        paddingVertical: 20,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
    },

    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    search: {
        backgroundColor: theme.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
      },
      searchIcon: {
        padding: 10,
      },
  });
  

export default SearchHeader;
