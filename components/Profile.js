import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  ActivityIndicator
} from 'react-native';
import storage from '../src/storage'

function Profile() {

  const [loading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    storage.remove({
      key: 'loginState'
    });
    NativeModules.DevSettings.reload();
  }

  return (
    <SafeAreaView>
      <View>
        <Text>Profile</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00aaff" />
        ) : (
          <TouchableOpacity onPress={logout} style={styles.button}>
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        )}
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
