import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Password = ({route,navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {email} = route.params;

  const handleCreateAccount = () => {
    // Validate password and confirm password
    if (!password.trim()) {
      alert('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Creating account with email:', email);
    console.log('Password:', password);

     // Fetch user data using email
  fetch(`http://192.168.1.11:3001/users/${email}`,{
    method: 'GET'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  })
  .then(userData => {
    // Append password to user data
    userData.password = password;

    // Update user data with the appended password
    return fetch(`http://192.168.1.11:3001/users/${email}`, {
      method: 'PUT', // Use PUT method for update
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Send updated user data
    });
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    return response.json();
  })
  .then(data => {
    console.log('Account created successfully:', data);
    // Optionally, you can navigate to a different screen upon successful account creation
  })
  .catch(error => {
    console.error('Error creating account:', error);
    Alert.alert('Error', 'Failed to create account. Please try again.');
  });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Password</Text>
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
    backgroundColor: '#007AFF',
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

