import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  NativeModules,
  ActivityIndicator
} from 'react-native';
import storage from '../src/storage';
import { API_ENDPOINTS } from '../src/config';

function Profile() {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    storage.load({ key: 'loginState' })
      .then(data => {
        fetchUserData(data.email);
        console.log(data.email)
      })
      .catch(err => {
        console.log('Error loading user data:', err);
      });
  }, []);

  const fetchUserData = (email) => {
    fetch(API_ENDPOINTS.USER(email))
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        console.log("hehehehehehhe");
        console.log(userData, "999999");
        return response.json();
      })
      .then(data => {
        setUserData(data);
        console.log(userData, "jgkdHLJDJJk");
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data. Please try again.');
        setLoading(false);
      });
  };

  const handleEditButton = () => {

  }

  const logout = () => {
    setLoading(true);
    storage.remove({ key: 'loginState' });
    NativeModules.DevSettings.reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileContainer}>
          <Text style={styles.title}>Profile</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#00aaff" />
          ) : (
            userData && (
              <>
                {userData.profilePicture && (
                  <Image
                    source={{ uri: userData.profilePicture}}
                    style={styles.profileImage}
                  />
                )}
                <Text style={styles.field}>Name: {userData.name}</Text>
                <Text style={styles.field}>Username: {userData.username}</Text>
                <Text style={styles.field}>Birthday: {userData.bday}</Text>
                <Text style={styles.field}>Phone Number: {userData.phone}</Text>
                <Text style={styles.field}>Email: {userData.email}</Text>
                <Text style={styles.field}>Gender: {userData.gender}</Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profileContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    backgroundColor: 'black',
  },
  field: {
    fontSize: 18,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Profile;
