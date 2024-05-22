import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';


function CreateUser({navigation}) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bday, setBday] = useState(new Date());

  const handleSubmit = () => {
    if (!email.trim() || !phone.trim() || !name.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const userData = { username, name, email, phone, bday };

    fetch('http://192.168.1.11:3001/users/', {
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
      .then(data => {
        console.log('User created successfully:', data);
        // Optionally, you can navigate to a different screen upon successful user creation
        navigation.navigate('Password',{email: email});
      })
      .catch(error => {
        console.error('Error creating user:', error);
        Alert.alert('Error', 'Failed to create user. Please try again.');
      });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create User</Text>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
        />
        <Text>Birth Day</Text>
        <DatePicker mode="date" date={bday} onDateChange={setBday} />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  form: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateUser;
