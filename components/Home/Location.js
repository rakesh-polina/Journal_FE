import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  TextInput,
  FlatList,
  NativeModules,
  Alert,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import theme from '../../styles/theme';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const GOOGLE_PLACES_API_KEY = 'AIzaSyAZZOS-22GHCganlyyg5slPP_RXwA-KuJE';

const GEOCODING_API_KEY = 'AIzaSyA6y3A6O8Db6hYAaogtYLHKV_iYdyZxsAI';

function Location({ navigation, route }) {
    const { location: initialLocation, event } = route.params || {};
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (initialLocation) {
        setQuery(initialLocation);
      }
    }, [initialLocation]);

    useEffect(() => {
      if (query.length > 2) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, [query]);
  
    const fetchSuggestions = async (input) => {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${GOOGLE_PLACES_API_KEY}`;
      try {
        const response = await axios.get(url);
        if (response.data.predictions) {
          setSuggestions(response.data.predictions);
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    };
  
    const handleSelectSuggestion = (description) => {
      setQuery(description);
      setSuggestions([]);
    };

    const requestLocationPermission = async () => {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      return response === 'granted';
    };

    const handleUseCurrentLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Please enable location permissions');
        return;
      }
  
      setLoading(true);
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GEOCODING_API_KEY}`;
          try {
            const response = await axios.get(url);
            if (response.data.results.length > 0) {
              const location = response.data.results[0].formatted_address;
              setQuery(location);
            }
          } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'Failed to fetch current location');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          Alert.alert('Error', 'Failed to get current location');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };
    
    const handleSetLocation = () => {
      if (query.trim()) {
        event.location = query;
        navigation.navigate('CreateEvent', { location: query, event });
      } else {
        Alert.alert('Error', 'Please enter or select a location');
      }
    };


  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                multiline={false}
                numberOfLines={1}
                placeholder="Enter location"
                value={query}
                onChangeText={setQuery}
          />
            <TouchableOpacity style={styles.currentLoc} onPress={handleUseCurrentLocation}>
                <Image source={require('../../assets/icons/currLoc.png')} style={styles.currLocIcon}/>
                <Text style={styles.currentLocText}>Use Current Location</Text>
            </TouchableOpacity>
        </View>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectSuggestion(item.description)}>
            <View style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
  
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No suggestions available</Text>
          </View>
        )}
      />
      <View style={styles.setButtonContainer}>
          <TouchableOpacity style={styles.setButton} onPress={handleSetLocation}>
            <Text style={styles.setButtonText}>SET LOCATION</Text>
          </TouchableOpacity>

        </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
      },
      container: {
        padding: 10,
        alignSelf: 'stretch',
      },
      scrollContainer: {
        paddingBottom: 100,
      },
      setButtonContainer:{
        padding: 20,
        alignItems: 'center',
        paddingBottom: 10, 
      },
      setButton: {
        backgroundColor: theme.primary,
        borderRadius: 30,
        padding: 10,
        alignItems: 'center',
        width: 250,
        elevation: 3,
      },
      setButtonText: {
        fontSize: 22,
        color: '#ffffff',
      },
      searchBar: {
        // flex: 1,
        color: '#fff',
        height: 60,
        marginHorizontal: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 20,
        padding: 10,
      },
      currentLoc:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 15,
        borderBottomWidth: 2,
        borderColor: '#ccc',
      },
      currentLocText:{
        margin: 10,
        fontSize: 16,
        color: theme.primaryText,
      },
      currLocIcon:{
        width: 25,
        height: 25,
        margin: 10,
      },
      suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        height: 60,
      },
      suggestionText: {
        fontSize: 16,
        color: theme.primaryText,
      },
      emptyContainer: {
        padding: 20,
        alignItems: 'center',
      },
      emptyText: {
        fontSize: 16,
        color: '#aaa',
      },
  
});

export default Location;
