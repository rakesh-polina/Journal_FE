// DocDisplay.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DocDisplay = ({ docs, onRemove }) => {
  console.log('docs are ', docs);

  const extractFilename = (uri) => {
    return uri.split('/').pop();
  };
  
  return (
    <View style={styles.docsContainer}>
      {docs.map((doc, index) => {
        // Ensure doc has a name field
        const docName = doc.name || extractFilename(doc.uri);

        return (
          <View key={index} style={styles.docItemContainer}>
            <Text style={styles.docItem}>{docName}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
            >
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  docsContainer: {
    marginVertical: 10,
  },
  docItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  docItem: {
    flex: 1,
  },
  removeButton: {
    padding: 5,
  },
  removeIcon: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default DocDisplay;
