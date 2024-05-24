// storage.js
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {
    // custom sync methods if needed
  },
});

// storage.save({
//     key: 'logIn',
//     data: {
//       loggedIn: false
//     },
//     expires: null,
//   })

export default storage;
