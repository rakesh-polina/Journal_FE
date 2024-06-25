import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_ENDPOINTS } from '../../src/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../../src/storage';

const Password = ({route,navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {userData} = route.params;

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,14}$/;
    return passwordRegex.test(password);
  };

  const handleCreateAccount = () => {
    // Validate password and confirm password
    if (!password.trim()) {
      alert('Error, Please enter a password');
      return;
    }
    if (!validatePassword(password)) {
      alert(
        'Error, Password must be 8-14 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
      );
      return;
    }
    if (password !== confirmPassword) {
      alert('Error, Passwords do not match');
      return;
    }

    console.log('Creating account with user data:', userData);
    console.log('Password:', password);

    // Append password to user data
    userData.password = password;

    // Send user data with password to the server
    fetch(API_ENDPOINTS.CREATE_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        return response.json();
      })
      .then(async data => {
        console.log('User created successfully:', data);
        // await AsyncStorage.setItem('loginState', JSON.stringify({ email: data.email }));

        // Storing user data in variables
        const name = userData.name;
        const username = userData.username;
        const phone = userData.phone;
        const bday = userData.bday;
        const email = userData.email

        storage.save({
          key: 'loginState',
          data: {
            name: name,
            username: username,
            phone: phone,
            bday: bday,
            email: email,
          },
          expires: null, 
        })
        navigation.reset({
          index: 0,
          routes: [{ name: 'ProfilePicture', params: { email: data.email } }],
        });
      })
      .catch(error => {
        console.log(JSON.stringify(userData));
        console.error('Error creating user:', error);
        alert('Error, Failed to create user. Please try again.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Password</Text>
          <Text style={styles.instructionText}>
          <Text style={{ fontWeight: 'bold' }}>Password must:</Text>
            {"\n"} 
            * Have 8-14 characters
            {"\n"} 
            * Contain at least one lowercase letter
            {"\n"} 
            * Contain at least one uppercase letter
            {"\n"} 
            * Contain at least one number
            {"\n"} 
            * Contain at least one special character like #, @, $, %, &, *
            {"\n"} 
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAccount}>
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#00AAFF',
    paddingVertical: 12,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Password;

