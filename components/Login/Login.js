import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../src/config';
import storage from '../../src/storage';

const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const navigation = useNavigation();

  const handleLogin = () => {
    // Perform input validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
    setLoading(true);

    const requestData = JSON.stringify({ email, password });
    console.log('Request Body:', requestData);

    // Make an HTTP request to your backend endpoint for user authentication
    fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => {
        // console.log(response);
        if (!response.ok) {
          throw new Error('Invalid credentials');
        }
        return response.json();
      })
      .then(data => {
        const { user } = data; // Extracting user data from the response

        // Storing user data in variables
        const name = user.name;
        const username = user.username;
        const phone = user.phone;
        const bday = user.bday;

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
        setLoading(false);
        NativeModules.DevSettings.reload();
        // navigation.navigate("MainNav");
        console.log('Login successful:', data);
      })
      .catch(error => {
        // Handle authentication error
        setLoading(false);
        console.error('Login failed:', error);
        setError(error.message);
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* <Button title="Login" onPress={handleLogin} /> */}
      {loading ? (
          <ActivityIndicator size="large" color='#0af' />
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Sign up" onPress={() => navigation.navigate("CreateUser")} />
      <Button title="Home" onPress={() => navigation.navigate("MainNav")} />
      <Button title="Log In With Google" onPress={handleLogin} />
      <Button title="Log In With Facebook" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
