// import { PermissionsAndroid, Platform } from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// export const audioRecorderPlayer = new AudioRecorderPlayer();

// export const requestAudioPermissions = async () => {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       ]);

//       return (
//         granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
//         granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
//       );
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   } else if (Platform.OS === 'ios') {
//     const result = await request(PERMISSIONS.IOS.MICROPHONE);
//     return result === RESULTS.GRANTED;
//   }
//   return true;
// };

// export const startRecording = async (setRecording, setCurrentRecording) => {
//   const granted = await requestAudioPermissions();
//   if (!granted) return;

//   const path = Platform.select({
//     ios: 'hello.m4a',
//     android: 'sdcard/hello.mp4',
//   });

//   setRecording(true);
//   const result = await audioRecorderPlayer.startRecorder(path);
//   console.log('Recording started at:', result);
//   audioRecorderPlayer.addRecordBackListener((e) => {
//     console.log('Recording time: ', e.current_position);
//   });
//   setCurrentRecording(result);
// };

// export const stopRecording = async (setRecording, setCurrentRecording, setRecordings, recordings) => {
//   try {
//     const result = await audioRecorderPlayer.stopRecorder();
//     console.log('Recording stopped at:', result);
//     audioRecorderPlayer.removeRecordBackListener();
//     if (result) {
//       setRecordings([...recordings, { path: result }]);
//     } else {
//       console.warn('No path returned from stopRecorder');
//     }
//     setRecording(false);
//     setCurrentRecording(null);
//   } catch (error) {
//     console.error('Error stopping recording:', error.message);
//   }
// };


// export const playRecording = async (path) => {
//   await audioRecorderPlayer.startPlayer(path);
//   audioRecorderPlayer.addPlayBackListener((e) => {
//     console.log('Playback time: ', e.current_position);
//   });
//   await audioRecorderPlayer.setVolume(1.0);
// };

// export const stopPlayback = async () => {
//   await audioRecorderPlayer.stopPlayer();
//   audioRecorderPlayer.removePlayBackListener();
// };

// export const deleteRecording = (index, recordings, setRecordings) => {
//   if (Array.isArray(recordings) && index >= 0 && index < recordings.length) {
//     const newRecordings = [...recordings];
//     newRecordings.splice(index, 1);
//     setRecordings(newRecordings);
//   } else {
//     console.warn('Invalid recordings array or index out of bounds');
//   }
// };

// AudioRecorder.js
// AudioRecorder.js
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = ({ onRecordComplete }) => {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const audioRecorderPlayerRef = useRef(audioRecorderPlayer);

  const onStartRecord = async () => {
    setRecording(true);
    await audioRecorderPlayerRef.current.startRecorder();
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayerRef.current.stopRecorder();
    setRecording(false);
    onRecordComplete(result);
    setRecordings((prevRecordings) => [...prevRecordings, result]);
  };

  const onPlayPause = async (uri) => {
    const isPlaying = await audioRecorderPlayerRef.current.resumePlayer();
    if (isPlaying) {
      await audioRecorderPlayerRef.current.startPlayer(uri);
    } else {
      await audioRecorderPlayerRef.current.pausePlayer();
    }
  };

  const onDelete = (index) => {
    setRecordings((prevRecordings) => prevRecordings.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, recording ? styles.recordingButton : styles.defaultButton]}
        onPress={recording ? onStopRecord : onStartRecord}
      >
        <Text style={styles.buttonText}>{recording ? 'STOP RECORDING' : 'START RECORDING'}</Text>
      </TouchableOpacity>

      <FlatList
        data={recordings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.recordingContainer}>
            <Text>{`Recording ${index + 1}`}</Text>
            <View style={styles.controls}>
              <TouchableOpacity onPress={() => onPlayPause(item)}>
                <Icon name="play-arrow" size={30} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(index)}>
                <Icon name="delete" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  defaultButton: {
    backgroundColor: 'blue',
  },
  recordingButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  recordingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  controls: {
    flexDirection: 'row',
  },
});

export default AudioRecorder;
