import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import storage from '../src/storage'

function Profile() {

  const navigation = useNavigation();
  
  const logout = () => {
    storage.remove({
      key: 'loginState'
    });
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Profile</Text>
        <TouchableOpacity onPress={() => logout()} style={styles.button}>
          <Text style={styles.text}>logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 200,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Profile;
