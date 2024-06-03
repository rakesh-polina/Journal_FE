import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { API_ENDPOINTS } from '../../src/config';
import { RadioButton } from 'react-native-paper';


function CreateUser({navigation}) {
  const [username, setUsername] = useState('');  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bday, setBday] = useState(new Date());
  const [gender, setGender] = useState('male'); 

  const handleSubmit = () => {
    if (!email.trim() || !phone.trim() || !name.trim() || !username.trim() || !gender.trim()) {
      alert('Error', 'Please fill all the fields');
      return;
    }
    const formattedBday = bday.toISOString().split('T')[0];
    console.log(formattedBday)
    const userData = { username, name, email, phone, bday: formattedBday, gender };
    navigation.navigate('Password', { userData });
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
        <Text>Gender</Text>
        <View style={styles.radioGroup}>
          <View style={styles.radioButton}>
            <RadioButton
              value="male"
              status={gender === 'male' ? 'checked' : 'unchecked'}
              onPress={() => setGender('male')}
            />
            <Text>Male</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="female"
              status={gender === 'female' ? 'checked' : 'unchecked'}
              onPress={() => setGender('female')}
            />
            <Text>Female</Text>
          </View>
          <View style={styles.radioButton}>
            <RadioButton
              value="other"
              status={gender === 'other' ? 'checked' : 'unchecked'}
              onPress={() => setGender('other')}
            />
            <Text>Other</Text>
          </View>
        </View>
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
    backgroundColor: 'black'
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#fff',
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
});

export default CreateUser;
