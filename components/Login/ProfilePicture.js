import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { API_ENDPOINTS } from '../../src/config';

const ProfilePicture = ({ route, navigation }) => {
  const [photo, setPhoto] = useState(null);
  const { email } = route.params;

  
  const handleChoosePhoto = async () => {
    await launchImageLibrary({ noData: true }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setPhoto(response.assets[0]);
        console.log(response.assets[0])
      }
    });
  };

  const handleUploadPhoto = () => {
    if (!photo) {
      navigation.navigate('MainNav');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);  // Append email to the form data
    formData.append('profilePicture', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
    console.log("In handle upload photo")
    console.log(photo.fileName)
    console.log(photo.type)
    console.log(photo.uri)
    console.log(formData.ProfilePicture)

    fetch(API_ENDPOINTS.UPLOAD_PROFILE_PICTURE(email), {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to upload profile picture');
        }
        return response.json();
      })
      .then(data => {
        console.log('Profile picture uploaded successfully:', data);
        navigation.navigate('MainNav');
      })
      .catch(error => {
        console.error('Error uploading profile picture:', error);
        Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Profile Picture</Text>
      <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoButton}>
        <Text style={styles.photoButtonText}>Choose Photo</Text>
      </TouchableOpacity>
      {photo && (
        <View style={{ marginTop: 20 }}>
          <Text>Selected Photo:</Text>
          <Image
            source={{ uri: photo.uri }}
            style={styles.photo}
          />
        </View>
      )}
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUploadPhoto}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('MainNav')}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  photoButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfilePicture;